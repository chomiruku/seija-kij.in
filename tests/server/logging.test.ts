import { describe, it, expect } from 'vitest'
import { cleanLogField } from '~/server/utils/logging'

describe('cleanLogField', () => {
  it('strips newlines and ANSI escapes so fake log lines cannot be injected', () => {
    expect(cleanLogField('/a\n[2026] GET 200 IP: 1.2.3.4\x1b[31m')).toBe('/a[2026] GET 200 IP: 1.2.3.4[31m')
  })
  it('rejects non-strings and caps length', () => {
    expect(cleanLogField({ x: 1 })).toBe('')
    expect(cleanLogField('a'.repeat(500))).toHaveLength(200)
  })
})
