import { Language } from '../types';
import {
  COUNTRY_TO_LANGUAGE_MAP,
  BROWSER_LANG_PREFIX_MAP,
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
} from './languages';

const STORAGE_KEY = 'ziptrio_user_language';

const VALID_LANG_CODES = new Set<string>(
  SUPPORTED_LANGUAGES.map((l) => l.code).concat(['us'])
);

/**
 * Extracts language from URL query (?lang=...) or path (e.g. /az, /tr, /en, /de, etc.)
 */
export function getLanguageFromUrl(): Language | null {
  if (typeof window === 'undefined') return null;

  // 1. Check search params: ?lang=az
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang')?.toLowerCase();
  if (langParam && VALID_LANG_CODES.has(langParam)) {
    return (langParam === 'us' ? 'en' : langParam) as Language;
  }

  // 2. Check pathname: /az, /tr, /en, /de, /fr, etc.
  const path = window.location.pathname.toLowerCase();
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0) {
    const firstSeg = segments[0];
    if (VALID_LANG_CODES.has(firstSeg)) {
      return (firstSeg === 'us' ? 'en' : firstSeg) as Language;
    }
  }

  return null;
}

/**
 * Syncs the browser URL path with the language (e.g. /az, /tr, /en)
 */
export function syncUrlWithLanguage(lang: Language, replace = false): void {
  if (typeof window === 'undefined') return;

  const normalizedLang = lang === 'us' ? 'en' : lang;
  const targetPath = `/${normalizedLang}`;

  const currentPath = window.location.pathname.toLowerCase();
  const currentSearch = window.location.search || '';
  const currentHash = window.location.hash || '';

  // Only update URL if different
  if (currentPath !== targetPath && !currentPath.startsWith(`${targetPath}/`)) {
    const newUrl = `${targetPath}${currentSearch}${currentHash}`;
    if (replace) {
      window.history.replaceState({ lang: normalizedLang }, '', newUrl);
    } else {
      window.history.pushState({ lang: normalizedLang }, '', newUrl);
    }
  }

  // Persist choice in localStorage
  try {
    localStorage.setItem(STORAGE_KEY, normalizedLang);
  } catch (e) {
    // storage not available
  }

  // Update document metadata
  updateDocumentMeta(normalizedLang);
}

/**
 * Updates document.documentElement attributes and title
 */
export function updateDocumentMeta(lang: Language): void {
  if (typeof document === 'undefined') return;

  const meta = getLanguageMeta(lang);
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.isRtl ? 'rtl' : 'ltr';

  if (lang === 'az') {
    document.title = 'ZipTrio — Vizual Veb Redaktor & Şablon Aləti';
  } else if (lang === 'tr') {
    document.title = 'ZipTrio — Canlı Kodsuz Web Düzenleyici';
  } else {
    document.title = 'ZipTrio — Visual No-Code HTML/ZIP Editor';
  }
}

/**
 * Detects visitor language:
 * 1. Checks URL (/az, /tr, /en, etc.)
 * 2. Checks localStorage
 * 3. Fetches IP Geolocation (api.country.is -> ipapi.co) matching country to 28 languages
 * 4. Fallback: navigator.language
 */
export async function detectVisitorLanguage(): Promise<{
  lang: Language;
  source: 'url' | 'storage' | 'ip' | 'browser';
  countryCode?: string;
}> {
  // 1. Direct URL path or param
  const fromUrl = getLanguageFromUrl();
  if (fromUrl) {
    return { lang: fromUrl, source: 'url' };
  }

  // 2. Saved preference in localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && VALID_LANG_CODES.has(saved)) {
      return { lang: saved === 'us' ? 'en' : saved, source: 'storage' };
    }
  } catch (e) {
    // storage unavailable
  }

  // 3. Real IP Geolocation Lookup
  // Attempt 1: api.country.is (ultra-fast, ~100ms, free, returns { ip: "...", country: "AZ" })
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const response = await fetch('https://api.country.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const country = (data.country || '').toUpperCase();
      if (country && COUNTRY_TO_LANGUAGE_MAP[country]) {
        const detected = COUNTRY_TO_LANGUAGE_MAP[country];
        return { lang: detected, source: 'ip', countryCode: country };
      }
    }
  } catch (err) {
    // Try fallback
  }

  // Attempt 2: ipapi.co (reliable fallback)
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
      if (country2 && COUNTRY_TO_LANGUAGE_MAP[country2]) {
        const detected = COUNTRY_TO_LANGUAGE_MAP[country2];
        return { lang: detected, source: 'ip', countryCode: country2 };
      }
    }
  } catch (err2) {
    // Continue to browser detection
  }

  // 4. Browser navigator language fallback
  try {
    const browserLanguages = navigator.languages || [navigator.language || ''];
    for (const rawLang of browserLanguages) {
      const normalized = (rawLang || '').toLowerCase().trim();
      // Exact prefix like 'az', 'tr', 'de', 'fr'
      const prefix = normalized.split('-')[0];
      if (BROWSER_LANG_PREFIX_MAP[prefix]) {
        return { lang: BROWSER_LANG_PREFIX_MAP[prefix], source: 'browser' };
      }
    }
  } catch (e) {
    // ignore
  }

  // Default to English
  return { lang: 'en', source: 'browser' };
}
