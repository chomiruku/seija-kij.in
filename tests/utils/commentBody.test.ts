import { describe, it, expect } from 'vitest'
import { parseCommentBody } from '~/utils/commentBody'

describe('parseCommentBody', () => {
  it('escapes HTML everywhere, including inside [quote] blocks', () => {
    const out = parseCommentBody('<img src=x onerror=alert(1)>[quote]<b> said:\n<script>x</script>[/quote]')
    expect(out).not.toMatch(/<(img|script|b)[\s>]/)
    expect(out).toContain('&lt;img')
    expect(out).toContain('class="comment-quote"')
  })
})
