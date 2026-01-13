import { getClientIP } from '../utils/ip'
import { getCloudflareData, formatBotLog, formatDetailedLog } from '../utils/logging'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const clientIP = getClientIP(event)
  const { path, query, referrer, userAgent, timestamp } = body

  // Get Cloudflare data
  const cfData = getCloudflareData(event)

  // Build query string for display
  const queryString = query && Object.keys(query).length > 0
    ? '?' + new URLSearchParams(query).toString()
    : ''

  const fullPath = path + queryString

  // Format similar to request logger but indicate it's a client-side navigation
  if (cfData.cfVerifiedBot) {
    // Simplified logging for verified bots
    console.log(formatBotLog(timestamp, 'CLIENT-NAV', 200, userAgent, fullPath))
  }
  else {
    // Full logging for legitimate traffic
    console.log(formatDetailedLog(
      timestamp,
      'CLIENT-NAV',
      200,
      clientIP,
      cfData,
      fullPath,
      null, // No duration for client-side navigation
      userAgent,
      { referrer: referrer || '/' }
    ))
  }

  return { success: true }
})
