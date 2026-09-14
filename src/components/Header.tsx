import React, { useRef, useState } from 'react';
import {
  Upload,
  Download,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  FolderArchive,
  Layers,
  Sparkles,
  FileCode,
  ChevronDown,
  Globe,
  Search,
  Check,
  MapPin,
  X,
} from 'lucide-react';
import { DeviceViewport, ProjectFile } from '../types';
import { SAMPLE_PROJECTS } from '../utils/sampleProjects';
import { useLanguage } from '../utils/LanguageContext';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '../utils/languages';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  files: ProjectFile[];
  viewport: DeviceViewport;
  setViewport: (vp: DeviceViewport) => void;
  onFileUpload: (file: File) => void;
  onLoadSample: (sampleId: string) => void;
  onExportZip: () => void;
  onExportHtml: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  activeHtmlName: string;
  onResetToUpload: () => void;
  historyIndex?: number;
}

export const Header: React.FC<HeaderProps> = ({
  files,
  viewport,
  setViewport,
  onFileUpload,
  onLoadSample,
  onExportZip,
  onExportHtml,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  activeHtmlName,
  onResetToUpload,
  historyIndex = 0,
}) => {
  const { lang, setLang, t, countryCode, isDetecting } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const currentMeta = getLanguageMeta(lang);
  const filteredLanguages = SUPPORTED_LANGUAGES.filter((item) => {
    const q = langSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q)
    );
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    e.target.value = '';
  };

  const isZipProject = files.length > 1 || files.some((f) => f.type !== 'html');

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 px-2 sm:px-4 md:px-5 flex items-center justify-between select-none z-30 shrink-0 shadow-xs">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip,.html,.htm"
        className="hidden"
      />

      {/* Brand & Sol Üst İleri/Geri (Undo/Redo) Butonları */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div
          onClick={onResetToUpload}
          className="flex items-center gap-2 cursor-pointer group"
          title={t.homeTooltip}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
              {t.appName}
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 hidden sm:inline-block">
                {t.visualBadge}
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[80px] sm:max-w-[130px] md:max-w-[180px] mt-0.5">
              {activeHtmlName || t.preview}
            </p>
          </div>
        </div>

        {/* --- SOL ÜST İLERİ / GERİ (UNDO / REDO) KONTROLLERİ --- */}
        <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-xl border border-slate-200 shadow-2xs gap-0.5 sm:gap-1">
          {/* Geri Al (Undo) */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer ${
              canUndo
                ? 'bg-white text-indigo-700 shadow-xs hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/80'
                : 'text-slate-300 cursor-not-allowed bg-transparent'
            }`}
            title={t.undoTooltip}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{t.undo}</span>
            {canUndo && historyIndex > 0 && (
              <span className="hidden md:inline-flex text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-mono font-bold">
                {historyIndex}
              </span>
            )}
          </button>

          {/* İleri Al (Redo) */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer ${
              canRedo
                ? 'bg-white text-indigo-700 shadow-xs hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/80'
                : 'text-slate-300 cursor-not-allowed bg-transparent'
            }`}
            title={t.redoTooltip}
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{t.redo}</span>
          </button>
        </div>

        {/* Upload & Samples buttons on desktop */}
        <div className="hidden lg:flex items-center gap-1.5 ml-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title={t.newFileTooltip}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.newFile}</span>
          </button>

          {/* Sample projects dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSamplesMenu(!showSamplesMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
              title={t.samplesTooltip}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.samples}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showSamplesMenu && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {t.samplesHeader}
                </div>
                {SAMPLE_PROJECTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onLoadSample(sample.id);
                      setShowSamplesMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-indigo-50/70 text-xs text-slate-700 transition flex flex-col cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900">{sample.name}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {sample.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Device Switcher */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={t.desktopTooltip}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">{t.desktop}</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={t.tabletTooltip}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">{t.tablet}</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={t.mobileTooltip}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">{t.mobile}</span>
          </button>
        </div>
      </div>

      {/* Right Controls: PWA Install & Language Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <PWAInstallButton />

        {/* Language Selector Area */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs ${
              showLangMenu
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-2 ring-indigo-500/20'
                : 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200 text-slate-800'
            }`}
            title="Dili Değiştir / Select Language"
          >
            <span className="text-sm leading-none">{currentMeta.flag}</span>
            <span className="text-[11px] font-medium text-slate-700 hidden sm:inline">
              {currentMeta.nativeName}
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-slate-200/80 shadow-2xs">
              /{currentMeta.code}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
                showLangMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 28 Languages Dropdown Popover */}
          {showLangMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLangMenu(false)}
              />

              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800">
                        28 Dil Seçimi / Languages
                      </span>
                    </div>
                    {countryCode && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Ülke: {countryCode}</span>
                      </span>
                    )}
                  </div>

                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Dil veya ülke ara (az, tr, de, en...)"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                      autoFocus
                    />
                    {langSearch && (
                      <button
                        onClick={() => setLangSearch('')}
                        className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Language items list */}
                <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                  {filteredLanguages.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Dil bulunamadı.
                    </div>
                  ) : (
                    filteredLanguages.map((item) => {
                      const isActive =
                        lang === item.code || (item.code === 'en' && lang === 'us');

                      return (
                        <button
                          key={item.code}
                          onClick={() => {
                            setLang(item.code);
                            setShowLangMenu(false);
                            setLangSearch('');
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200/80'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-base leading-none shrink-0">{item.flag}</span>
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-800 truncate">
                                  {item.nativeName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({item.name})
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {item.country}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              /{item.code}
                            </span>
                            {isActive && (
                              <Check className="w-3.5 h-3.5 text-indigo-600" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer status */}
                <div className="p-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 text-center">
                  Her dil için URL otomatik <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">/{lang}</code> olarak güncellenir.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 cursor-pointer"
          title={t.uploadFile}
        >
          <Upload className="w-3.5 h-3.5 text-indigo-600" />
        </button>

        {/* Download Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-500/20 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t.download}</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1.5 w-60 sm:w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                {t.downloadMenuTitle}
              </div>

              {isZipProject && (
                <button
                  onClick={() => {
                    onExportZip();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-indigo-50/60 text-xs text-slate-800 transition flex items-center gap-2.5 cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">{t.downloadZip}</div>
                    <div className="text-[10px] text-slate-500">{t.downloadZipDesc}</div>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  onExportHtml();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-indigo-50/60 text-xs text-slate-800 transition flex items-center gap-2.5 cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">{t.downloadHtml}</div>
                  <div className="text-[10px] text-slate-500">
                    {t.downloadHtmlDesc} {activeHtmlName}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
