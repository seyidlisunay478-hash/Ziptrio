import React, { useState, useEffect } from 'react';
import { FileCode, Save, X, Check, Copy } from 'lucide-react';
import { ProjectFile } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface CodeViewProps {
  isOpen: boolean;
  onClose: () => void;
  file: ProjectFile | null;
  onSaveFile: (path: string, newContent: string) => void;
}

export const CodeView: React.FC<CodeViewProps> = ({
  isOpen,
  onClose,
  file,
  onSaveFile,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'us';

  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setIsSaved(false);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSave = () => {
    onSaveFile(file.path, content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = content.split('\n').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[85dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-slate-800 bg-slate-950/80 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-xs font-semibold text-white truncate max-w-xs">
              {file.path}
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {file.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? 'Copied' : 'Kopyalandı') : (isEn ? 'Copy' : 'Kopyala')}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? (isEn ? 'Saved!' : 'Kaydedildi!') : (isEn ? 'Save' : 'Kaydet')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 flex overflow-hidden bg-slate-950 font-mono text-xs">
          {/* Line Numbers */}
          <div className="w-12 py-3 bg-slate-950 text-slate-400 select-none text-right pr-3 shrink-0 border-r border-slate-800/80 overflow-hidden leading-relaxed font-mono">
            {Array.from({ length: Math.min(lineCount, 500) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-3 bg-slate-950 text-slate-200 outline-none resize-none font-mono text-xs leading-relaxed whitespace-pre overflow-auto"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="h-8 border-t border-slate-800 bg-slate-950/90 px-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {isEn
              ? `${lineCount} lines • ${content.length} characters`
              : `${lineCount} satır • ${content.length} karakter`}
          </span>
          <span className="text-blue-400 font-medium">
            {isEn ? 'Changes immediately reflect in preview' : 'Değişiklikler anında önizlemeye yansıtılır'}
          </span>
        </div>
      </div>
    </div>
  );
};
