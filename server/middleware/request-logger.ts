import chalk from 'chalk'

export default defineEventHandler(async (event) => {
    // Get the IP address, considering proxies and load balancers
    const getClientIP = (event: any) => {
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
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

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
        console.log(
            chalk.gray(`[${timestamp}]`) + ' ' +
            getMethodColor(method) + ' ' +
            getStatusColor(statusCode) + ' ' +
            chalk.bold.blue('IP:') + ' ' + chalk.cyan(clientIP) + ' ' +
            chalk.dim('-') + ' ' +
            chalk.white(url.pathname) + ' ' +
            chalk.dim('-') + ' ' +
            chalk.bold.magenta('Time:') + ' ' + chalk.yellow(`${duration}ms`) + ' ' +
            chalk.dim('-') + ' ' +
            chalk.bold.gray('UA:') + ' ' + chalk.dim(userAgent.substring(0, 50) + (userAgent.length > 50 ? '...' : ''))
        )
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