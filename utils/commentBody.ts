/**
 * Escapes a booru comment, then renders [quote] blocks. Output goes to v-html,
 * so escaping MUST run before any markup is added.
 */
export const parseCommentBody = (body: string | null | undefined): string => {
  if (!body) return ''
  
  // Escape HTML to prevent XSS
  let escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  // Parse [quote][/quote] tags
  escaped = escaped.replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, (_match: string, content: string) => {
    // Clean up the quote content and parse attribution
    const lines = content.trim().split('\n')
    let attribution = ''
    let quoteText = content.trim()
    
    // Check if first line contains "said:" pattern for attribution
    if (lines.length > 0 && lines[0].includes(' said:')) {
      attribution = lines[0].replace(' said:', '').trim()
      quoteText = lines.slice(1).join('\n').trim()
    }
    
    const quotedContent = quoteText ? `<div class="quote-content">${quoteText.replace(/\n/g, '<br>')}</div>` : ''
    const attributionContent = attribution ? `<div class="quote-attribution">— ${attribution}</div>` : ''
    
    return `<div class="comment-quote">${quotedContent}${attributionContent}</div>`
  })
  
  // Convert line breaks to <br> tags
  escaped = escaped.replace(/\n/g, '<br>')
  
  return escaped
}
