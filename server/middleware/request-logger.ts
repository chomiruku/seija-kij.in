import chalk from 'chalk'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
    // Get the IP address, considering proxies and load balancers
    const getClientIP = (event: H3Event) => {
        // Check common proxy headers first
        const forwarded = getHeader(event, 'x-forwarded-for')
        const realIP = getHeader(event, 'x-real-ip')
        const cfConnectingIP = getHeader(event, 'cf-connecting-ip') // Cloudflare
        const xClientIP = getHeader(event, 'x-client-ip')

        // x-forwarded-for can contain multiple IPs, take the first one
        if (forwarded) {
            const ips = forwarded.split(',').map((ip: string) => ip.trim())
            return ips[0]
        }

        // Check other headers
        if (realIP) return realIP
        if (cfConnectingIP) return cfConnectingIP
        if (xClientIP) return xClientIP

        // Fall back to the direct connection IP
        return event.node.req.socket?.remoteAddress || 'unknown'
    }

    const clientIP = getClientIP(event)
    const method = getMethod(event)
    const url = getRequestURL(event)
    const userAgent = getHeader(event, 'user-agent') || 'Unknown'
    const countryCode = getHeader(event, 'cf-ipcountry') || 'XX'
    const cfRay = getHeader(event, 'cf-ray') || null
    const cfCity = getHeader(event, 'cf-ipcity') || null
    const cfBotScore = getHeader(event, 'cf-bot-score') || null
    const cfVerifiedBot = getHeader(event, 'cf-verified-bot') === 'true'
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    // Filter out health check spam from Go-http-client on /api/health (only from localhost)
    const isLocalhost = clientIP === '127.0.0.1' || clientIP === '::1' || clientIP === '::ffff:127.0.0.1' || clientIP === 'localhost'
    if (url.pathname === '/api/health' && userAgent === 'Go-http-client/1.1' && isLocalhost) {
        return // Skip logging this request
    }

    // Filter out asset requests (Nuxt icons, images, fonts, CSS, JS, etc.)
    const assetPatterns = [
        '/api/_nuxt_icon/',
        '/_nuxt/',
        '/fonts/',
        '/images/',
        '/__nuxt_error',
        '/favicon.ico',
        '/favicon.svg'
    ]

    const isAssetRequest = assetPatterns.some(pattern => url.pathname.startsWith(pattern)) ||
                          url.pathname.match(/\.(css|js|map|woff2?|ttf|eot|otf|png|jpg|jpeg|gif|svg|webp|ico)$/)

    if (isAssetRequest) {
        return // Skip logging asset requests
    }

    // Color-coded method styling
    const getMethodColor = (method: string) => {
        switch (method.toLowerCase()) {
            case 'get': return chalk.green(method)
            case 'post': return chalk.blue(method)
            case 'put': return chalk.yellow(method)
            case 'patch': return chalk.cyan(method)
            case 'delete': return chalk.red(method)
            case 'options': return chalk.gray(method)
            case 'head': return chalk.magenta(method)
            default: return chalk.white(method)
        }
    }

    // Color-coded status code styling
    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return chalk.green(status)
        if (status >= 300 && status < 400) return chalk.yellow(status)
        if (status >= 400 && status < 500) return chalk.red(status)
        if (status >= 500) return chalk.bgRed.white(status)
        return chalk.white(status)
    }

    // Hook into the response to capture status code
    event.node.res.on('finish', () => {
        const endTime = Date.now()
        const duration = endTime - startTime
        const statusCode = event.node.res.statusCode

        // Log the complete request with response info
        if (cfVerifiedBot) {
            // Simplified logging for verified bots
            console.log(
                chalk.gray(`[${timestamp}]`) + ' ' +
                getMethodColor(method) + ' ' +
                getStatusColor(statusCode) + ' ' +
                chalk.bold.cyan('[BOT]') + ' ' +
                chalk.dim(userAgent.substring(0, 40) + (userAgent.length > 40 ? '...' : '')) + ' ' +
                chalk.dim('-') + ' ' +
                chalk.white(url.pathname)
            )
        } else {
            // Full logging for legitimate traffic
            let logMessage =
                chalk.gray(`[${timestamp}]`) + ' ' +
                getMethodColor(method) + ' ' +
                getStatusColor(statusCode) + ' ' +
                chalk.bold.blue('IP:') + ' ' + chalk.cyan(clientIP) + ' ' +
                chalk.bold.yellow(`[${countryCode}]`)

            // Add city if available
            if (cfCity) {
                logMessage += ' ' + chalk.dim(`(${cfCity})`)
            }

            logMessage += ' ' + chalk.dim('-') + ' ' + chalk.white(url.pathname)

            // Add CF-Ray if available
            if (cfRay) {
                logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('Ray:') + ' ' + chalk.dim(cfRay)
            }

            logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.magenta('Time:') + ' ' + chalk.yellow(`${duration}ms`)

            // Add bot score if available
            if (cfBotScore) {
                const score = parseInt(cfBotScore)
                const scoreColor = score < 30 ? chalk.red : score < 50 ? chalk.yellow : chalk.green
                logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('Bot:') + ' ' + scoreColor(cfBotScore)
            }

            logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('UA:') + ' ' + chalk.dim(userAgent.substring(0, 50) + (userAgent.length > 50 ? '...' : ''))

            console.log(logMessage)
        }
    })

    // Optional: Log the initial request (without status code yet)
    // Uncomment if you want to see requests as they come in
    /*
    console.log(
        chalk.gray(`[${timestamp}]`) + ' ' +
        getMethodColor(method) + ' ' +
        chalk.white(url.pathname) + ' ' +
        chalk.dim('-') + ' ' +
        chalk.bold.blue('IP:') + ' ' + chalk.cyan(clientIP) + ' ' +
        chalk.dim('- STARTED')
    )
    */
})