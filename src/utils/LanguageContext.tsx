import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, Translations } from './translations';
import {
  detectVisitorLanguage,
  getLanguageFromUrl,
  syncUrlWithLanguage,
  updateDocumentMeta,
} from './geoIp';

interface LanguageContextType {
  lang: Language;
  setLang: (newLang: Language, updateUrl?: boolean) => void;
  t: Translations;
  isDetecting: boolean;
  countryCode: string | null;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'tr',
  setLang: () => {},
  t: TRANSLATIONS.tr,
  isDetecting: false,
  countryCode: null,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with URL or sensible default
  const initialUrlLang = getLanguageFromUrl();
  const [lang, setLangState] = useState<Language>(initialUrlLang || 'tr');
  const [isDetecting, setIsDetecting] = useState<boolean>(!initialUrlLang);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  const setLang = (newLang: Language, updateUrl = true) => {
    setLangState(newLang);
    if (updateUrl) {
      syncUrlWithLanguage(newLang, false);
    }
  };

  // On mount: run detection if no direct URL parameter was provided
  useEffect(() => {
    let mounted = true;

    // Listen to browser Back/Forward navigation
    const handlePopState = () => {
      const urlLang = getLanguageFromUrl();
      if (urlLang) {
        setLangState(urlLang);
        updateDocumentMeta(urlLang);
      }
    };
    window.addEventListener('popstate', handlePopState);

    // If URL already has /tr or /us, sync immediately
    if (initialUrlLang) {
      syncUrlWithLanguage(initialUrlLang, true);
      setIsDetecting(false);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }

    // Otherwise, detect via IP Geolocation or Browser
    detectVisitorLanguage().then(({ lang: detectedLang, source, countryCode: detectedCountry }) => {
      if (!mounted) return;
      setLangState(detectedLang);
      if (detectedCountry) {
        setCountryCode(detectedCountry);
      }
      setIsDetecting(false);

      // Directly update URL path to /tr or /us
      syncUrlWithLanguage(detectedLang, true);
    });

    return () => {
      mounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: TRANSLATIONS[lang],
        isDetecting,
        countryCode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
