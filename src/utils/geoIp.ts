import { Language } from '../types';

const STORAGE_KEY = 'vwe_user_language';

/**
 * Extracts language from current window pathname (/tr or /us or /en)
 */
export function getLanguageFromUrl(): Language | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.toLowerCase();
  if (path === '/tr' || path.startsWith('/tr/')) {
    return 'tr';
  }
  if (path === '/us' || path.startsWith('/us/') || path === '/en' || path.startsWith('/en/')) {
    return 'us';
  }
  return null;
}

/**
 * Updates the browser URL without page reload (/tr or /us)
 */
export function syncUrlWithLanguage(lang: Language, replace = false): void {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  // Clean existing prefix
  let targetPath = `/${lang}`;
  if (currentPath.startsWith('/tr') || currentPath.startsWith('/us') || currentPath.startsWith('/en')) {
    const remainder = currentPath.replace(/^\/(tr|us|en)/, '');
    targetPath = `/${lang}${remainder}`;
  } else if (currentPath !== '/' && currentPath !== '') {
    targetPath = `/${lang}${currentPath}`;
  }

  const newUrl = `${targetPath}${search}${hash}`;

  if (window.location.pathname !== targetPath) {
    if (replace) {
      window.history.replaceState({ lang }, '', newUrl);
    } else {
      window.history.pushState({ lang }, '', newUrl);
    }
  }

  // Update localStorage
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // Ignore storage issues
  }

  // Update document language & title attributes
  updateDocumentMeta(lang);
}

/**
 * Updates document.documentElement.lang and document.title
 */
export function updateDocumentMeta(lang: Language): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang === 'tr' ? 'tr' : 'en';

  if (lang === 'tr') {
    document.title = 'Visual Web Studio & Editor - Canlı Kodsuz Web Düzenleyici';
  } else {
    document.title = 'Visual Web Studio & Editor - Visual No-Code HTML/ZIP Editor';
  }
}

/**
 * Detects visitor language:
 * 1. Checks URL (/tr or /us)
 * 2. Checks localStorage
 * 3. Fetches IP Geolocation (api.country.is -> ipapi.co)
 * 4. Fallback: navigator.language
 */
export async function detectVisitorLanguage(): Promise<{
  lang: Language;
  source: 'url' | 'storage' | 'ip' | 'browser';
  countryCode?: string;
}> {
  // 1. URL has absolute priority if present
  const fromUrl = getLanguageFromUrl();
  if (fromUrl) {
    return { lang: fromUrl, source: 'url' };
  }

  // 2. Saved preference in localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'tr' || saved === 'us') {
      return { lang: saved, source: 'storage' };
    }
  } catch (e) {
    // storage unavailable
  }

  // 3. IP Geolocation API lookup
  try {
    // api.country.is is blazing fast (<150ms), HTTPS, CORS-open, returns { ip: "...", country: "TR" }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const response = await fetch('https://api.country.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const country = (data.country || '').toUpperCase();
      if (country === 'TR' || country === 'AZ') {
        return { lang: 'tr', source: 'ip', countryCode: country };
      } else {
        return { lang: 'us', source: 'ip', countryCode: country };
      }
    }
  } catch (err) {
    // IP lookup timed out or was blocked by content blocker, proceed to secondary fallback
  }

  // Secondary IP lookup attempt: ipapi.co
  try {
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 2000);

    const response2 = await fetch('https://ipapi.co/json/', {
      signal: controller2.signal,
    });
    clearTimeout(timeoutId2);

    if (response2.ok) {
      const data2 = await response2.json();
      const country2 = (data2.country_code || '').toUpperCase();
      if (country2 === 'TR' || country2 === 'AZ') {
        return { lang: 'tr', source: 'ip', countryCode: country2 };
      } else {
        return { lang: 'us', source: 'ip', countryCode: country2 };
      }
    }
  } catch (err2) {
    // ignore
  }

  // 4. Fallback: Browser navigator language
  try {
    const browserLang = (
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      ''
    ).toLowerCase();

    if (browserLang.startsWith('tr')) {
      return { lang: 'tr', source: 'browser' };
    }
  } catch (e) {
    // ignore
  }

  return { lang: 'us', source: 'browser' };
}
