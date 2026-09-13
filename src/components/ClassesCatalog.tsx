import React, { useState } from 'react';
import { Tag, Search, X, Check, Copy, Layers, ExternalLink, Code } from 'lucide-react';
import { CssRuleItem } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface ClassesCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  allClassNames: string[];
  cssRules: CssRuleItem[];
  onSelectClass?: (className: string) => void;
}

export const ClassesCatalog: React.FC<ClassesCatalogProps> = ({
  isOpen,
  onClose,
  allClassNames,
  cssRules,
  onSelectClass,
}) => {
  const { lang, t } = useLanguage();
  const isEn = lang === 'us';

  const [search, setSearch] = useState('');
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredClasses = allClassNames.filter((cls) =>
    cls.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (cls: string) => {
    navigator.clipboard.writeText(cls);
    setCopiedClass(cls);
    setTimeout(() => setCopiedClass(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl h-[80dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 bg-slate-950/80 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">
              {isEn ? 'Parsed CSS Classes & Rules' : 'Ayrıştırılan CSS Sınıfları ve Kuralları'}
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
              {allClassNames.length} {isEn ? 'Classes' : 'Sınıf'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? 'Search class name (e.g. btn, hero, card, container)...' : 'Sınıf adı ara (örn. btn, hero, card, container)...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Classes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {isEn ? 'No matching CSS classes found.' : 'Eşleşen CSS sınıfı bulunamadı.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredClasses.map((cls) => {
                // Find matching rule
                const matchingRule = cssRules.find(
                  (r) =>
                    r.selector.includes('.' + cls) ||
                    r.selector.toLowerCase().includes('.' + cls.toLowerCase())
                );

                return (
                  <div
                    key={cls}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-semibold text-emerald-300 truncate">
                        .{cls}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(cls)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                          title={isEn ? 'Copy class name' : 'Sınıf adını kopyala'}
                        >
                          {copiedClass === cls ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {matchingRule ? (
                      <div className="text-[10px] font-mono text-slate-400 line-clamp-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                        {Object.entries(matchingRule.declarations)
                          .slice(0, 2)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join('; ')}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        {isEn ? 'HTML or CSS component class' : 'HTML veya CSS bileşen sınıfı'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-slate-800 bg-slate-950/80 px-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            {isEn
              ? `Total ${allClassNames.length} unique classes parsed`
              : `Toplam ${allClassNames.length} benzersiz sınıf ayrıştırıldı`}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition cursor-pointer"
          >
            {isEn ? 'Close' : 'Kapat'}
          </button>
        </div>
      </div>
    </div>
  );
};
