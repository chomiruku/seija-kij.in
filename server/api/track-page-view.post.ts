import { getClientIP } from '../utils/ip'
import { getCloudflareData, formatBotLog, formatDetailedLog, cleanLogField } from '../utils/logging'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  if (!body || typeof body.path !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'path required' })
  }

  const clientIP = getClientIP(event)
  const cfData = getCloudflareData(event)
  // Body fields are attacker-controlled: clean before they reach the console
  const query = body.query && typeof body.query === 'object' ? new URLSearchParams(body.query).toString() : ''
  const fullPath = cleanLogField(body.path + (query ? `?${query}` : ''))
  const referrer = cleanLogField(body.referrer) || '/'
  const userAgent = cleanLogField(getHeader(event, 'user-agent')) || 'Unknown'
  const timestamp = new Date().toISOString()

  if (cfData.cfVerifiedBot) {
    console.log(formatBotLog(timestamp, 'CLIENT-NAV', 200, userAgent, fullPath))
  }
  else {
    console.log(formatDetailedLog(timestamp, 'CLIENT-NAV', 200, clientIP, cfData, fullPath, null, userAgent, { referrer }))
  }

  return { success: true }
})
