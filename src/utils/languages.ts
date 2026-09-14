import { Language } from '../types';

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
  isRtl?: boolean;
}

/**
 * 28 Supported Languages (with Azerbaijani 'az' prominently included)
 */
export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', country: 'Türkiye' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan dili', flag: '🇦🇿', country: 'Azərbaycan' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', country: 'Global / United States' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Deutschland / Österreich' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', country: 'France / Belgique' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', country: 'España / Latinoamérica' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', country: 'Italia' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', country: 'Brasil / Portugal' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', country: 'Россия / СНГ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', country: 'العالم العربي', isRtl: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', country: '日本' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', country: '대한민국' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', country: '中国' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', country: 'Nederland' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', country: 'Polska' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', country: 'Україна' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', country: 'Sverige' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', country: 'Norge' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', country: 'Danmark' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', country: 'Suomi' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', country: 'Ελλάδα' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', country: 'Česko' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', country: 'România' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', country: 'Magyarország' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', country: 'भारत' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', country: 'Indonesia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', country: 'Việt Nam' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', country: 'ישראל', isRtl: true },
];

/**
 * Country Code (ISO 3166-1 alpha-2) to Language mapping for automatic IP geolocation detection
 */
export const COUNTRY_TO_LANGUAGE_MAP: Record<string, Language> = {
  // Azerbaijan
  AZ: 'az',

  // Turkey
  TR: 'tr',

  // English speaking countries
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  IE: 'en',
  ZA: 'en',
  SG: 'en',
  NG: 'en',
  PH: 'en',
  KE: 'en',
  GH: 'en',

  // German speaking
  DE: 'de',
  AT: 'de',
  CH: 'de',
  LI: 'de',

  // French speaking
  FR: 'fr',
  BE: 'fr',
  LU: 'fr',
  MC: 'fr',
  SN: 'fr',
  CI: 'fr',
  CM: 'fr',

  // Spanish speaking
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',

  // Italian
  IT: 'it',
  SM: 'it',
  VA: 'it',

  // Portuguese
  BR: 'pt',
  PT: 'pt',
  AO: 'pt',
  MZ: 'pt',

  // Russian speaking / CIS
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  KG: 'ru',
  TJ: 'ru',
  UZ: 'ru',

  // Arabic
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  QA: 'ar',
  KW: 'ar',
  BH: 'ar',
  OM: 'ar',
  JO: 'ar',
  LB: 'ar',
  IQ: 'ar',
  MA: 'ar',
  DZ: 'ar',
  TN: 'ar',
  LY: 'ar',
  SD: 'ar',
  YE: 'ar',

  // East Asia & Southeast Asia
  JP: 'ja',
  KR: 'ko',
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  MO: 'zh',
  VN: 'vi',
  ID: 'id',

  // European nations
  NL: 'nl',
  PL: 'pl',
  UA: 'uk',
  SE: 'sv',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
  GR: 'el',
  CY: 'el',
  CZ: 'cs',
  SK: 'cs',
  RO: 'ro',
  MD: 'ro',
  HU: 'hu',

  // South Asia
  IN: 'hi',
  PK: 'hi',

  // Middle East
  IL: 'he',
};

/**
 * Browser navigator prefix to supported Language code mapping
 */
export const BROWSER_LANG_PREFIX_MAP: Record<string, Language> = {
  az: 'az',
  tr: 'tr',
  en: 'en',
  de: 'de',
  fr: 'fr',
  es: 'es',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  ar: 'ar',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh',
  nl: 'nl',
  pl: 'pl',
  uk: 'uk',
  sv: 'sv',
  no: 'no',
  nb: 'no',
  nn: 'no',
  da: 'da',
  fi: 'fi',
  el: 'el',
  cs: 'cs',
  sk: 'cs',
  ro: 'ro',
  hu: 'hu',
  hi: 'hi',
  id: 'id',
  vi: 'vi',
  he: 'he',
};

export function getLanguageMeta(code: Language): LanguageMeta {
  const normalized = code === 'us' ? 'en' : code;
  return (
    SUPPORTED_LANGUAGES.find((item) => item.code === normalized) ||
    SUPPORTED_LANGUAGES[0]
  );
}
