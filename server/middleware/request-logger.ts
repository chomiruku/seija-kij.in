import { getClientIP, isLocalhost } from '../utils/ip'
import { getCloudflareData, formatBotLog, formatDetailedLog, shouldFilterRequest } from '../utils/logging'

export default defineEventHandler(async (event) => {
  const clientIP = getClientIP(event)
  const method = getMethod(event)
  const url = getRequestURL(event)
  const userAgent = getHeader(event, 'user-agent') || 'Unknown'
  const cfData = getCloudflareData(event)
  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  // Filter out health check spam from Go-http-client on /api/health (only from localhost)
  if (url.pathname === '/api/health' && userAgent === 'Go-http-client/1.1' && isLocalhost(clientIP)) {
    return // Skip logging this request
  }

  // Filter out asset requests
  if (shouldFilterRequest(url.pathname, userAgent)) {
    return // Skip logging asset requests
  }

  // Hook into the response to capture status code
  event.node.res.on('finish', () => {
    const endTime = Date.now()
    const duration = endTime - startTime
    const statusCode = event.node.res.statusCode

    // Log the complete request with response info
    if (cfData.cfVerifiedBot) {
      // Simplified logging for verified bots
      console.log(formatBotLog(timestamp, method, statusCode, userAgent, url.pathname))
    }
    else {
      // Full logging for legitimate traffic
      console.log(formatDetailedLog(
        timestamp,
        method,
        statusCode,
        clientIP,
        cfData,
        url.pathname,
        duration,
        userAgent
      ))
    }
  })
})
