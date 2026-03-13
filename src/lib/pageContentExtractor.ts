/**
 * Extracts readable text content from the current page.
 * Ignores navigation, footer repetition, decorative elements, and hidden content.
 * Preserves heading hierarchy and paragraph flow.
 */

const IGNORED_SELECTORS = [
  'nav',
  'header',
  'footer',
  '[aria-hidden="true"]',
  '.font-caption',
  'button',
  'script',
  'style',
  'noscript',
  'canvas',
  'svg',
  '[role="navigation"]',
  '.pointer-events-none',
];

const CONTENT_SELECTORS = [
  'main h1',
  'main h2',
  'main h3',
  'main p',
  'main li',
  'main blockquote',
];

/**
 * Extract clean text from the current page's <main> element.
 */
export function extractPageContent(): string {
  const main = document.querySelector('main');
  if (!main) {
    // Fallback: try to get content from visible sections
    return extractFallbackContent();
  }

  const blocks: string[] = [];
  const walker = document.createTreeWalker(
    main,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        const el = node as Element;
        // Skip ignored elements
        if (IGNORED_SELECTORS.some(sel => el.matches(sel) || el.closest(sel))) {
          return NodeFilter.FILTER_REJECT;
        }
        // Only process content-bearing elements
        const tagName = el.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'p', 'li', 'blockquote'].includes(tagName)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  const seenTexts = new Set<string>();
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const el = node as Element;
    const text = el.textContent?.trim();
    if (!text || text.length < 3) continue;
    
    // Deduplicate
    const normalized = text.toLowerCase().replace(/\s+/g, ' ');
    if (seenTexts.has(normalized)) continue;
    seenTexts.add(normalized);

    const tagName = el.tagName.toLowerCase();
    if (tagName.startsWith('h')) {
      blocks.push(`\n${text}.\n`);
    } else {
      blocks.push(text);
    }
  }

  return blocks.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function extractFallbackContent(): string {
  const elements = document.querySelectorAll('h1, h2, h3, p');
  const texts: string[] = [];
  const seen = new Set<string>();

  elements.forEach(el => {
    if (IGNORED_SELECTORS.some(sel => el.matches(sel) || el.closest(sel))) return;
    const text = el.textContent?.trim();
    if (!text || text.length < 3) return;
    const normalized = text.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(normalized)) return;
    seen.add(normalized);
    texts.push(text);
  });

  return texts.join('\n').trim();
}

/**
 * Split text into chunks suitable for TTS (max ~4500 chars each).
 * Splits at sentence boundaries.
 */
export function splitIntoChunks(text: string, maxChunkSize = 4500): string[] {
  if (text.length <= maxChunkSize) return [text];

  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
