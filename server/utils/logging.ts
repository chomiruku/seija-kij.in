import chalk from 'chalk'
import type { H3Event } from 'h3'

/**
 * Cloudflare request metadata
 */
export interface CloudflareData {
  countryCode: string
  cfRay: string | null
  cfCity: string | null
  cfBotScore: string | null
  cfVerifiedBot: boolean
}

/**
 * Extracts Cloudflare-specific headers from the request
 */
export function getCloudflareData(event: H3Event): CloudflareData {
  return {
    countryCode: getHeader(event, 'cf-ipcountry') || 'XX',
    cfRay: getHeader(event, 'cf-ray') || null,
    cfCity: getHeader(event, 'cf-ipcity') || null,
    cfBotScore: getHeader(event, 'cf-bot-score') || null,
    cfVerifiedBot: getHeader(event, 'cf-verified-bot') === 'true',
  }
}

/**
 * Color-codes HTTP method names
 */
export function getMethodColor(method: string): string {
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

/**
 * Color-codes HTTP status codes
 */
export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return chalk.green(status.toString())
  if (status >= 300 && status < 400) return chalk.yellow(status.toString())
  if (status >= 400 && status < 500) return chalk.red(status.toString())
  if (status >= 500) return chalk.bgRed.white(status.toString())
  return chalk.white(status.toString())
}

/**
 * Formats a request log message for bots
 */
export function formatBotLog(
  timestamp: string,
  method: string,
  statusCode: number,
  userAgent: string,
  pathname: string
): string {
  return (
    chalk.gray(`[${timestamp}]`) + ' '
    + getMethodColor(method) + ' '
    + getStatusColor(statusCode) + ' '
    + chalk.bold.cyan('[BOT]') + ' '
    + chalk.dim(userAgent.substring(0, 40) + (userAgent.length > 40 ? '...' : '')) + ' '
    + chalk.dim('-') + ' '
    + chalk.white(pathname)
  )
}

/**
 * Formats a detailed request log message for legitimate traffic
 */
export function formatDetailedLog(
  timestamp: string,
  method: string,
  statusCode: number,
  clientIP: string,
  cfData: CloudflareData,
  pathname: string,
  duration: number | null,
  userAgent: string,
  additionalInfo?: { referrer?: string }
): string {
  let logMessage
    = chalk.gray(`[${timestamp}]`) + ' '
    + getMethodColor(method) + ' '
    + getStatusColor(statusCode) + ' '
    + chalk.bold.blue('IP:') + ' ' + chalk.cyan(clientIP) + ' '
    + chalk.bold.yellow(`[${cfData.countryCode}]`)

  // Add city if available
  if (cfData.cfCity) {
    logMessage += ' ' + chalk.dim(`(${cfData.cfCity})`)
  }

  logMessage += ' ' + chalk.dim('-') + ' ' + chalk.white(pathname)

  // Add CF-Ray if available
  if (cfData.cfRay) {
    logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('Ray:') + ' ' + chalk.dim(cfData.cfRay)
  }

  // Add referrer if provided (for client-side navigation)
  if (additionalInfo?.referrer) {
    logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.yellow('From:') + ' ' + chalk.dim(additionalInfo.referrer)
  }

  // Add duration if provided (for server-side requests)
  if (duration !== null) {
    logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.magenta('Time:') + ' ' + chalk.yellow(`${duration}ms`)
  }

  // Add bot score if available
  if (cfData.cfBotScore) {
    const score = Number.parseInt(cfData.cfBotScore)
    const scoreColor = score < 30 ? chalk.red : score < 50 ? chalk.yellow : chalk.green
    logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('Bot:') + ' ' + scoreColor(cfData.cfBotScore)
  }

  logMessage += ' ' + chalk.dim('-') + ' ' + chalk.bold.gray('UA:') + ' ' + chalk.dim(userAgent.substring(0, 50) + (userAgent.length > 50 ? '...' : ''))

  return logMessage
}

/**
 * Checks if a request should be filtered from logs
 */
export function shouldFilterRequest(pathname: string, _userAgent: string | undefined): boolean {
  // Filter out asset requests
  const assetPatterns = [
    '/api/_nuxt_icon/',
    '/_nuxt/',
    '/fonts/',
    '/images/',
    '/__nuxt_error',
    '/favicon.ico',
    '/favicon.svg',
    '/api/track-page-view',
  ]

  const isAssetRequest = assetPatterns.some(pattern => pathname.startsWith(pattern))
    || /\.(css|js|map|woff2?|ttf|eot|otf|png|jpg|jpeg|gif|svg|webp|ico)$/.test(pathname)

  return isAssetRequest
}
