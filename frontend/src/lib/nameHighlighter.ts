export interface HebrewName {
  id: string;
  label: string;
  hebrew: string;
  transliteration: string;
  meaning: string;
  context: string;
  references: string[];
  category: string;
}

export interface NameHighlighterOptions {
  showHebrewBadge?: boolean;
  showTranslitBadge?: boolean;
  enablePopovers?: boolean;
}

let hebrewLexicon: HebrewName[] = [];
let byLabel: Record<string, HebrewName> = {};

export async function loadHebrewLexicon(): Promise<HebrewName[]> {
  if (hebrewLexicon.length > 0) {
    return hebrewLexicon;
  }

  try {
    const response = await fetch('/lexicons/hebrew_names.json');
    const data = await response.json();
    hebrewLexicon = data.names;
    
    // Build lookup map
    byLabel = {};
    hebrewLexicon.forEach(name => {
      byLabel[name.label] = name;
    });
    
    return hebrewLexicon;
  } catch (error) {
    console.error('Failed to load Hebrew lexicon:', error);
    return [];
  }
}

export function getHebrewName(label: string): HebrewName | undefined {
  return byLabel[label];
}

export function highlightNames(
  text: string, 
  options: NameHighlighterOptions = {}
): string {
  const {
    showHebrewBadge = false,
    showTranslitBadge = false,
    enablePopovers = true
  } = options;

  if (hebrewLexicon.length === 0) {
    return text;
  }

  let highlightedText = text;

  // Sort by length (longest first) to avoid partial matches
  const sortedNames = [...hebrewLexicon].sort((a, b) => b.label.length - a.label.length);

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  sortedNames.forEach(name => {
    // Create a regex that won't match text inside HTML tags
    // This prevents replacing text that's already been highlighted
    const regex = new RegExp(`\\b${escapeRegExp(name.label)}\\b(?![^<]*>|[^<>]*<\/)`, 'gi');
    
    highlightedText = highlightedText.replace(regex, (match) => {
      const badges = [];
      
      if (showHebrewBadge) {
        badges.push(`<span class="hebrew-badge" title="Hebrew: ${escapeAttr(name.hebrew)}">${escapeHtml(name.hebrew)}</span>`);
      }
      
      if (showTranslitBadge) {
        badges.push(`<span class="translit-badge" title="Transliteration: ${escapeAttr(name.transliteration)}">${escapeHtml(name.transliteration)}</span>`);
      }

      const badgeHtml = badges.length > 0 ? ` ${badges.join(' ')}` : '';
      
      if (enablePopovers) {
        return `<span class="name-token" data-name-id="${escapeAttr(name.id)}" data-name-label="${escapeAttr(name.label)}">${match}</span>${badgeHtml}`;
      } else {
        return `${match}${badgeHtml}`;
      }
    });
  });

  return highlightedText;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getHighlightedNames(text: string): HebrewName[] {
  const foundNames: HebrewName[] = [];
  
  hebrewLexicon.forEach(name => {
    const regex = new RegExp(`\\b${escapeRegExp(name.label)}\\b`, 'gi');
    if (regex.test(text)) {
      foundNames.push(name);
    }
  });
  
  return foundNames;
}

export function stripHighlighting(html: string): string {
  return html
    .replace(/<span class="name-token[^"]*"[^>]*>([^<]*)<\/span>/g, '$1')
    .replace(/<span class="hebrew-badge[^"]*"[^>]*>[^<]*<\/span>/g, '')
    .replace(/<span class="translit-badge[^"]*"[^>]*>[^<]*<\/span>/g, '')
    .replace(/<span class="translator-note[^"]*"[^>]*>([^<]*)<\/span>/g, '$1');
}

/**
 * Utility to safely escape HTML attribute values
 */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Format translator notes (text in curly braces) to be more user-friendly
 * Converts {text} into interactive, styled elements
 */
export function formatTranslatorNotes(text: string): string {
  // Match text within curly braces
  return text.replace(/\{([^}]+)\}/g, (match, content) => {
    // Check if it's a Hebrew reference note (contains "Heb.")
    const isHebrewNote = content.includes('Heb.');
    
    // Create a tooltip-friendly version
    const tooltipText = isHebrewNote 
      ? 'Hebrew meaning: ' + content.replace(/.*Heb\.\s*/i, '')
      : 'Added for clarity: ' + content;
    
    // Return formatted HTML with icon and styling
    return `<span class="translator-note" data-note="${escapeAttr(content)}" title="${escapeAttr(tooltipText)}">
      <span class="note-icon">ℹ️</span>
      <span class="note-content">${content}</span>
    </span>`;
  });
}
