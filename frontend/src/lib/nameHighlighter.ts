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

  sortedNames.forEach(name => {
    const regex = new RegExp(`\\b${escapeRegExp(name.label)}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, (match) => {
      const badges = [];
      
      if (showHebrewBadge) {
        badges.push(`<span class="hebrew-badge" title="Hebrew: ${name.hebrew}">${name.hebrew}</span>`);
      }
      
      if (showTranslitBadge) {
        badges.push(`<span class="translit-badge" title="Transliteration: ${name.transliteration}">${name.transliteration}</span>`);
      }

      const badgeHtml = badges.length > 0 ? ` ${badges.join(' ')}` : '';
      
      if (enablePopovers) {
        return `<span class="name-token" data-name-id="${name.id}" data-name-label="${name.label}">${match}</span>${badgeHtml}`;
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
    .replace(/<span class="translit-badge[^"]*"[^>]*>[^<]*<\/span>/g, '');
}
