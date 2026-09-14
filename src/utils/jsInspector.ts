import { ParsedElementInfo, ProjectFile } from '../types';

export interface ScriptMatch {
  id: string;
  file: string;
  line: number;
  reason: string;
  codeSnippet: string;
}

/**
 * Scans project files (JS and HTML <script> sections) to find any script code
 * referencing or interacting with the selected element.
 */
export function findScriptsForElement(
  element: ParsedElementInfo | null,
  files: ProjectFile[] = []
): ScriptMatch[] {
  if (!element) return [];

  const matches: ScriptMatch[] = [];
  const idToSearch = element.idAttr?.trim();
  const classesToSearch = (element.classList || []).filter(
    (c) => c && c.length > 2 && !c.startsWith('vwe-')
  );
  const tagToSearch = element.tagName.toLowerCase();

  // Extract function names from inline attributes (e.g. onclick="toggleMenu()")
  const inlineFunctionNames: string[] = [];
  if (element.jsEvents) {
    for (const val of Object.values(element.jsEvents)) {
      const match = val.match(/([a-zA-Z0-9_$]+)\s*\(/);
      if (match && match[1]) {
        inlineFunctionNames.push(match[1]);
      }
    }
  }

  // Scan JS files and HTML files
  const scriptFiles = files.filter(
    (f) => f.type === 'js' || f.type === 'html' || f.name.endsWith('.js') || f.name.endsWith('.html')
  );

  for (const file of scriptFiles) {
    const lines = (file.content || '').split('\n');

    lines.forEach((lineText, idx) => {
      let matchReason = '';

      // Check ID match
      if (idToSearch) {
        if (
          lineText.includes(`'${idToSearch}'`) ||
          lineText.includes(`"${idToSearch}"`) ||
          lineText.includes(`#${idToSearch}`) ||
          lineText.includes(`getElementById('${idToSearch}')`) ||
          lineText.includes(`getElementById("${idToSearch}")`)
        ) {
          matchReason = `Element ID (#${idToSearch})`;
        }
      }

      // Check inline function definition match
      if (!matchReason) {
        for (const fnName of inlineFunctionNames) {
          if (
            lineText.includes(`function ${fnName}`) ||
            lineText.includes(`${fnName} = function`) ||
            lineText.includes(`${fnName} = (`) ||
            lineText.includes(`const ${fnName} =`) ||
            lineText.includes(`let ${fnName} =`)
          ) {
            matchReason = `Tetiklenen Fonksiyon (${fnName})`;
            break;
          }
        }
      }

      // Check class match (look for .className in querySelector or getElementsByClassName)
      if (!matchReason) {
        for (const cls of classesToSearch) {
          if (
            lineText.includes(`.${cls}`) ||
            lineText.includes(`'${cls}'`) ||
            lineText.includes(`"${cls}"`)
          ) {
            matchReason = `CSS Sınıfı (.${cls})`;
            break;
          }
        }
      }

      if (matchReason) {
        // Grab context lines around match
        const start = Math.max(0, idx - 1);
        const end = Math.min(lines.length - 1, idx + 3);
        const snippet = lines.slice(start, end + 1).join('\n');

        matches.push({
          id: `${file.path}:${idx + 1}`,
          file: file.path || file.name,
          line: idx + 1,
          reason: matchReason,
          codeSnippet: snippet,
        });
      }
    });
  }

  // Limit to 10 most relevant matches
  return matches.slice(0, 10);
}

/**
 * Common event presets for quick 1-click addition
 */
export const EVENT_PRESETS = [
  {
    name: 'Aç / Kapat Sınıfı (Toggle Class)',
    event: 'onclick',
    code: "this.classList.toggle('active');",
    description: "Tıklanınca öğeye 'active' sınıfını ekler veya kaldırır.",
  },
  {
    name: 'Görünür / Gizle (Toggle Display)',
    event: 'onclick',
    code: "this.style.display = this.style.display === 'none' ? 'block' : 'none';",
    description: 'Tıklanınca öğenin görünürlüğünü gizler veya açar.',
  },
  {
    name: 'Uyarı Mesajı Göster (Alert)',
    event: 'onclick',
    code: "alert('ZipTrio: Butona tıklandı!');",
    description: 'Tıklanınca ekranda bir bildirim kutusu açar.',
  },
  {
    name: 'Sayfa Başına Kaydır (Scroll to Top)',
    event: 'onclick',
    code: "window.scrollTo({ top: 0, behavior: 'smooth' });",
    description: 'Yumuşak animasyonla sayfanın en üstüne kaydırır.',
  },
  {
    name: 'Ölçek Animasyonu (Scale Click Animation)',
    event: 'onclick',
    code: "this.style.transform = 'scale(0.95)'; setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);",
    description: 'Tıklanma hissi veren mikro basılma animasyonu.',
  },
  {
    name: 'Konsola Yazdır (Console Log)',
    event: 'onclick',
    code: "console.log('Tıklanan öğe:', this);",
    description: 'Tarayıcı geliştirici konsoluna öğeyi yazdırır.',
  },
];
