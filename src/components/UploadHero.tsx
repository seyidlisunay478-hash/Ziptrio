import React, { useRef } from 'react';
import { Upload, FileArchive, Sparkles, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../utils/sampleProjects';
import { useLanguage } from '../utils/LanguageContext';

interface UploadHeroProps {
  onFileUpload: (file: File) => void;
  onLoadSample: (sampleId: string) => void;
}

export const UploadHero: React.FC<UploadHeroProps> = ({
  onFileUpload,
  onLoadSample,
}) => {
  const { t, lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-full h-full flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 bg-slate-50/70 text-slate-900 select-none overflow-y-auto"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.22) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip,.html,.htm"
        className="hidden"
      />

      <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-[28px] sm:rounded-[36px] shadow-xl shadow-slate-200/50 p-5 sm:p-8 md:p-10 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Cute Glowing Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-4 sm:mb-6">
          <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 sm:mb-3">
          {t.heroTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-5 sm:mb-7 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Central Upload Button & Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl p-4 sm:p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 sm:gap-3 group mb-5"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <FileArchive className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition">
              {t.selectFileBtn}
            </span>
            <p className="text-[11px] text-slate-400 mt-2">
              {t.dropText}
            </p>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left w-full mb-6 pt-3 border-t border-slate-100 text-[11px] sm:text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.feature1}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.feature2}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.feature3}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.feature4}</span>
          </div>
        </div>

        {/* Ready-to-Test Templates */}
        <div className="w-full bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.starterTemplates}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_PROJECTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onLoadSample(sample.id)}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                    {lang === 'us' && sample.id === 'startup'
                      ? 'Modern Startup Landing Page'
                      : lang === 'us' && sample.id === 'portfolio'
                      ? 'Minimalist Portfolio & Resume'
                      : sample.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {lang === 'us' && sample.id === 'startup'
                      ? 'Multi-file modern website with HTML, CSS and interactive JS.'
                      : lang === 'us' && sample.id === 'portfolio'
                      ? 'Clean, responsive personal portfolio with dark mode & cards.'
                      : sample.description}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0 ml-1.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
