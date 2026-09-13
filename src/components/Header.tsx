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
} from 'lucide-react';
import { DeviceViewport, ProjectFile } from '../types';
import { SAMPLE_PROJECTS } from '../utils/sampleProjects';
import { useLanguage } from '../utils/LanguageContext';

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
  const { lang, setLang, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);

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

      {/* Right Controls: Language Selector (/tr, /us) + Mobile upload icon + Download Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Direct Language Switcher (/tr & /us) */}
        <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setLang('tr')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer ${
              lang === 'tr'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900 bg-transparent'
            }`}
            title="Türkçe sürüm (/tr)"
          >
            <span className="text-xs leading-none">🇹🇷</span>
            <span className="text-[11px] tracking-tight">TR</span>
          </button>
          <button
            onClick={() => setLang('us')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer ${
              lang === 'us'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900 bg-transparent'
            }`}
            title="English version (/us)"
          >
            <span className="text-xs leading-none">🇺🇸</span>
            <span className="text-[11px] tracking-tight">US</span>
          </button>
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
