export function toPlainText(input: string): string {
  if (!input) return '';
  // Remove tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  // Decode common HTML entities
  const textArea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (textArea) {
    textArea.innerHTML = withoutTags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return textArea.value;
  }
  return withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}


