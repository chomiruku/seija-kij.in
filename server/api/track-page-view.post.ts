import type { H3Event } from 'h3'
import chalk from 'chalk'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Get the IP address (same logic as request logger)
    const getClientIP = (event: H3Event) => {
        const forwarded = getHeader(event, 'x-forwarded-for')
        const realIP = getHeader(event, 'x-real-ip')
        const cfConnectingIP = getHeader(event, 'cf-connecting-ip')
        const xClientIP = getHeader(event, 'x-client-ip')

        if (forwarded) {
            const ips = (forwarded as string).split(',').map((ip: string) => ip.trim())
            return ips[0]
        }

        if (realIP) return realIP
        if (cfConnectingIP) return cfConnectingIP
        if (xClientIP) return xClientIP

        return event.node.req.socket?.remoteAddress || 'unknown'
    }

    const clientIP = getClientIP(event)
    const { path, query, referrer, userAgent, timestamp } = body

    // Get Cloudflare data
    const countryCode = getHeader(event, 'cf-ipcountry') || 'XX'
    const cfRay = getHeader(event, 'cf-ray') || null
    const cfCity = getHeader(event, 'cf-ipcity') || null
    const cfBotScore = getHeader(event, 'cf-bot-score') || null
    const cfVerifiedBot = getHeader(event, 'cf-verified-bot') === 'true'

    // Build query string for display
    const queryString = query && Object.keys(query).length > 0
        ? '?' + new URLSearchParams(query).toString()
        : ''

    const fullPath = path + queryString

    // Format similar to request logger but indicate it's a client-side navigation
    if (cfVerifiedBot) {
        // Simplified logging for verified bots
        console.log(
            chalk.gray(`[${timestamp}]`) + ' ' +
            chalk.magenta('CLIENT-NAV') + ' ' +
            chalk.green('200') + ' ' +
            chalk.bold.cyan('[BOT]') + ' ' +
            chalk.dim(userAgent.substring(0, 40) + (userAgent.length > 40 ? '...' : '')) + ' ' +
            chalk.dim('-') + ' ' +
            chalk.white(fullPath)
        )
    } else {
        // Full logging for legitimate traffic
        let logMessage =
            chalk.gray(`[${timestamp}]`) + ' ' +
            chalk.magenta('CLIENT-NAV') + ' ' +
            chalk.green('200') + ' ' +
            chalk.bold.blue('IP:') + ' ' + chalk.cyan(clientIP) + ' ' +
            chalk.bold.yellow(`[${countryCode}]`)

        // Add city if available
        if (cfCity) {
            logMessage += ' ' + chalk.dim(`(${cfCity})`)
        }

        logMessage += ' ' + chalk.dim('-') + ' ' + chalk.white(fullPath)

        // Add CF-Ray if available
        if (cfRay) {
            logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('Ray:') + ' ' + chalk.dim(cfRay)
        }

        logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.yellow('From:') + ' ' + chalk.dim(referrer || '/')

        // Add bot score if available
        if (cfBotScore) {
            const score = parseInt(cfBotScore)
            const scoreColor = score < 30 ? chalk.red : score < 50 ? chalk.yellow : chalk.green
            logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('Bot:') + ' ' + scoreColor(cfBotScore)
        }

        logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('UA:') + ' ' + chalk.dim(userAgent.substring(0, 50) + (userAgent.length > 50 ? '...' : ''))

        console.log(logMessage)
    }

    return { success: true }
})