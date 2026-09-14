import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  const isAz = lang === 'az';
  const isTr = lang === 'tr';

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-in slide-in-from-bottom-2 duration-200">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>
          {isAz
            ? 'Oflayn Rejim — Keşlənmiş məlumatlar istifadə olunur.'
            : isTr
            ? 'Çevrimdışı Mod — Önbelleğe alınan veriler kullanılıyor.'
            : 'Offline Mode — Cached data is being used.'}
        </span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-emerald-400/40 animate-in slide-in-from-bottom-2 duration-200">
        <Wifi className="w-4 h-4 shrink-0" />
        <span>
          {isAz
            ? 'İnternet bağlantısı bərpa olundu!'
            : isTr
            ? 'İnternet bağlantısı yeniden kuruldu!'
            : 'Internet connection restored!'}
        </span>
      </div>
    );
  }

  return null;
};
