import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../utils/LanguageContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { lang } = useLanguage();

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const isAz = lang === 'az';
  const isTr = lang === 'tr';

  const label = isAz
    ? 'Tətbiqi Quraşdır'
    : isTr
    ? 'Uygulamayı Yükle'
    : 'Install App';

  const iosLabel = isAz
    ? 'iOS-a Quraşdır'
    : isTr
    ? 'iOS’a Yükle'
    : 'Install on iOS';

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
        title={label}
      >
        <Download className="w-3.5 h-3.5 shrink-0 animate-bounce" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden text-[11px]">PWA</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition active:scale-95 cursor-pointer whitespace-nowrap"
          title={iosLabel}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{iosLabel}</span>
          <span className="sm:hidden text-[11px]">PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    ZT
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isAz
                        ? 'ZipTrio-nu iPhone-a Quraşdırın'
                        : isTr
                        ? 'ZipTrio’yu iPhone’a Yükleyin'
                        : 'Install ZipTrio on iPhone'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isAz
                        ? 'Daha sürətli və tam ekran təcrübə'
                        : isTr
                        ? 'Daha hızlı ve tam ekran deneyim'
                        : 'Faster and full screen experience'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                    1
                  </span>
                  <div>
                    <p>
                      {isAz ? (
                        <>Safari alətlər panelindəki <strong>Paylaş</strong> (<Share className="w-3 h-3 inline text-indigo-600 mx-0.5" />) düyməsinə toxunun.</>
                      ) : isTr ? (
                        <>Safari araç çubuğundaki <strong>Paylaş</strong> (<Share className="w-3 h-3 inline text-indigo-600 mx-0.5" />) simgesine dokunun.</>
                      ) : (
                        <>Tap the <strong>Share</strong> (<Share className="w-3 h-3 inline text-indigo-600 mx-0.5" />) button in the Safari toolbar.</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                    2
                  </span>
                  <div>
                    <p>
                      {isAz ? (
                        <>Aşağı sürüşdürün və <strong>"Ana Ekrana Əlavə Et"</strong> seçin.</>
                      ) : isTr ? (
                        <>Aşağı kaydırın ve <strong>"Ana Ekrana Ekle"</strong> seçeneğine dokunun.</>
                      ) : (
                        <>Scroll down and tap <strong>"Add to Home Screen"</strong>.</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                    3
                  </span>
                  <div>
                    <p>
                      {isAz ? (
                        <>Yuxarı sağ küncdəki <strong>"Əlavə et"</strong> düyməsinə klikləyin.</>
                      ) : isTr ? (
                        <>Sağ üst köşedeki <strong>"Ekle"</strong> butonuna basın.</>
                      ) : (
                        <>Tap <strong>"Add"</strong> in the top right corner.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                {isAz ? 'Bağla' : isTr ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop install prompt button (shows guided tooltip/dialog if user clicks)
  return (
    <button
      onClick={() => {
        alert(
          isAz
            ? 'Tətbiqi quraşdırmaq üçün brauzerinizin ünvan sətrindəki Quraşdır (⊕) düyməsinə klikləyin.'
            : isTr
            ? 'Uygulamayı yüklemek için tarayıcınızın adres çubuğundaki Yükle (⊕) simgesine tıklayın.'
            : 'To install the app, click the Install (⊕) button in your browser address bar.'
        );
      }}
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200 transition cursor-pointer"
      title={label}
    >
      <Download className="w-3.5 h-3.5 text-indigo-500" />
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
};
