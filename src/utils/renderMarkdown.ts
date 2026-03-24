/**
 * Convert inline markdown to HTML string.
 * Safe to use with dangerouslySetInnerHTML because content
 * comes exclusively from the Anthropic API (no user-generated input).
 */
export function renderInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
}
