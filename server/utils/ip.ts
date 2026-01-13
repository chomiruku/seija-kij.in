import type { H3Event } from 'h3'

/**
 * Extracts the real client IP address from an H3 event
 * Handles proxy headers and load balancers correctly
 *
 * Priority order:
 * 1. x-forwarded-for (first IP in the list)
 * 2. x-real-ip
 * 3. cf-connecting-ip (Cloudflare)
 * 4. x-client-ip
 * 5. Direct socket connection IP
 */
export function getClientIP(event: H3Event): string {
  // Check common proxy headers first
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  const cfConnectingIP = getHeader(event, 'cf-connecting-ip') // Cloudflare
  const xClientIP = getHeader(event, 'x-client-ip')

  // x-forwarded-for can contain multiple IPs, take the first one (original client)
  if (forwarded) {
    const ips = forwarded.split(',').map((ip: string) => ip.trim())
    return ips[0]
  }

  // Check other headers in priority order
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  if (xClientIP) return xClientIP

  // Fall back to the direct connection IP
  return event.node.req.socket?.remoteAddress || 'unknown'
}

/**
 * Checks if an IP address is localhost
 */
export function isLocalhost(ip: string): boolean {
  return ip === '127.0.0.1'
    || ip === '::1'
    || ip === '::ffff:127.0.0.1'
    || ip === 'localhost'
}
