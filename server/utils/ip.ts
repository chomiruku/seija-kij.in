import type { H3Event } from 'h3'

/**
 * Real client IP from Cloudflare. Safe only because the origin is firewalled to
 * Cloudflare and Caddy forwards CF-Connecting-IP; x-forwarded-for is client-forgeable.
 */
export function getClientIP(event: H3Event): string {
  return getHeader(event, 'cf-connecting-ip')
    || event.node.req.socket?.remoteAddress
    || 'unknown'
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
