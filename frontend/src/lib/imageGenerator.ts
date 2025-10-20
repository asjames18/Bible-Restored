/**
 * Verse Image Generator
 * Creates beautiful, shareable verse cards using HTML5 Canvas
 */

export interface VerseCardTheme {
  id: string;
  name: string;
  background: string | CanvasGradient;
  textColor: string;
  accentColor: string;
  font: string;
  pattern?: 'none' | 'geometric' | 'floral' | 'wave';
}

export interface VerseCardOptions {
  verseText: string;
  verseRef: string;
  theme: VerseCardTheme;
  width?: number;
  height?: number;
  includeAppName?: boolean;
  fontSize?: number;
}

// Predefined themes
export const themes: VerseCardTheme[] = [
  {
    id: 'sunset',
    name: 'Sunset Glory',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    font: 'Georgia, serif',
    pattern: 'geometric',
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    textColor: '#ffffff',
    accentColor: '#60a5fa',
    font: 'Georgia, serif',
    pattern: 'wave',
  },
  {
    id: 'forest',
    name: 'Forest Peace',
    background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    textColor: '#ffffff',
    accentColor: '#d4ff00',
    font: 'Georgia, serif',
    pattern: 'floral',
  },
  {
    id: 'elegant',
    name: 'Elegant Black',
    background: '#1f2937',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    font: 'Georgia, serif',
    pattern: 'none',
  },
  {
    id: 'light',
    name: 'Pure Light',
    background: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#6366f1',
    font: 'Georgia, serif',
    pattern: 'geometric',
  },
  {
    id: 'dawn',
    name: 'Morning Dawn',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    textColor: '#ffffff',
    accentColor: '#fef3c7',
    font: 'Georgia, serif',
    pattern: 'none',
  },
];

/**
 * Creates a gradient background on canvas context
 */
function createGradient(
  ctx: CanvasRenderingContext2D,
  gradientString: string,
  width: number,
  height: number
): CanvasGradient | string {
  // Parse linear-gradient string
  const match = gradientString.match(/linear-gradient\((.+)\)/);
  if (!match) return gradientString;

  const parts = match[1].split(',').map((s) => s.trim());
  const angle = parseInt(parts[0]) || 135;
  
  // Calculate gradient direction based on angle
  const rad = (angle * Math.PI) / 180;
  const x1 = width / 2 - Math.cos(rad) * width / 2;
  const y1 = height / 2 - Math.sin(rad) * height / 2;
  const x2 = width / 2 + Math.cos(rad) * width / 2;
  const y2 = height / 2 + Math.sin(rad) * height / 2;

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

  // Add color stops
  for (let i = 1; i < parts.length; i++) {
    const colorMatch = parts[i].match(/#[0-9a-fA-F]{6}\s+(\d+)%/);
    if (colorMatch) {
      const color = parts[i].match(/#[0-9a-fA-F]{6}/)?.[0] || '#000000';
      const position = parseInt(colorMatch[1]) / 100;
      gradient.addColorStop(position, color);
    }
  }

  return gradient;
}

/**
 * Draws decorative pattern on canvas
 */
function drawPattern(
  ctx: CanvasRenderingContext2D,
  pattern: VerseCardTheme['pattern'],
  width: number,
  height: number,
  accentColor: string
) {
  if (pattern === 'none') return;

  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;

  switch (pattern) {
    case 'geometric':
      // Draw diagonal lines
      for (let i = -height; i < width + height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
      }
      break;

    case 'floral':
      // Draw circles
      for (let x = 0; x < width; x += 80) {
        for (let y = 0; y < height; y += 80) {
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      break;

    case 'wave':
      // Draw waves
      ctx.beginPath();
      for (let y = 0; y < height; y += 60) {
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 20) {
          const wave = Math.sin((x / 50) + (y / 30)) * 10;
          ctx.lineTo(x, y + wave);
        }
      }
      ctx.stroke();
      break;
  }

  ctx.globalAlpha = 1;
}

/**
 * Wraps text to fit within specified width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generates a verse card image and returns as data URL
 */
export async function generateVerseCard(options: VerseCardOptions): Promise<string> {
  const {
    verseText,
    verseRef,
    theme,
    width = 1200,
    height = 630,
    includeAppName = true,
    fontSize = 36,
  } = options;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set background
  if (typeof theme.background === 'string' && theme.background.includes('gradient')) {
    ctx.fillStyle = createGradient(ctx, theme.background, width, height) as any;
  } else {
    ctx.fillStyle = theme.background as string;
  }
  ctx.fillRect(0, 0, width, height);

  // Draw pattern
  if (theme.pattern) {
    drawPattern(ctx, theme.pattern, width, height, theme.accentColor);
  }

  // Set text properties
  ctx.fillStyle = theme.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw decorative top border
  ctx.fillStyle = theme.accentColor;
  ctx.fillRect(width * 0.15, 60, width * 0.7, 4);

  // Draw verse text
  const padding = 100;
  const maxTextWidth = width - padding * 2;
  ctx.font = `${fontSize}px ${theme.font}`;
  
  const lines = wrapText(ctx, `"${verseText}"`, maxTextWidth);
  const lineHeight = fontSize * 1.5;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2;

  ctx.fillStyle = theme.textColor;
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  // Draw verse reference
  ctx.font = `bold ${fontSize * 0.7}px ${theme.font}`;
  ctx.fillStyle = theme.accentColor;
  ctx.fillText(verseRef, width / 2, startY + totalTextHeight + lineHeight);

  // Draw decorative bottom border
  ctx.fillStyle = theme.accentColor;
  ctx.fillRect(width * 0.15, height - 64, width * 0.7, 4);

  // Draw app name at bottom
  if (includeAppName) {
    ctx.font = `${fontSize * 0.5}px ${theme.font}`;
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.6;
    ctx.fillText('The Restored Word', width / 2, height - 30);
    ctx.globalAlpha = 1;
  }

  // Convert to data URL
  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Downloads the generated image
 */
export function downloadImage(dataUrl: string, filename: string = 'verse-card.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Shares the image using Web Share API if available
 */
export async function shareImage(dataUrl: string, title: string, text: string): Promise<boolean> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'verse-card.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text,
        files: [file],
      });
      return true;
    } else {
      // Fallback: Copy to clipboard if supported
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({
            'image/png': blob,
          }),
        ]);
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Error sharing image:', error);
    return false;
  }
}

/**
 * Copies image to clipboard
 */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    if (navigator.clipboard && (window as any).ClipboardItem) {
      await navigator.clipboard.write([
        new (window as any).ClipboardItem({
          'image/png': blob,
        }),
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

