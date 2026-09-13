import React from 'react';
import {
  Eye,
  Sliders,
  FolderTree,
  Tag,
  Code2,
} from 'lucide-react';
import { ActiveMobileTab, ParsedElementInfo } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface MobileBottomNavProps {
  activeTab: ActiveMobileTab;
  setActiveTab: (tab: ActiveMobileTab) => void;
  selectedElement: ParsedElementInfo | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  selectedElement,
}) => {
  const { t } = useLanguage();

  return (
    <nav className="md:hidden h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-1 z-40 shrink-0 select-none">
      <button
        onClick={() => setActiveTab('preview')}
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition cursor-pointer ${
          activeTab === 'preview'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Eye className="w-4 h-4" />
        <span className="text-[10px]">{t.navPreview}</span>
      </button>

      <button
        onClick={() => setActiveTab('inspector')}
        className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition cursor-pointer ${
          activeTab === 'inspector'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Sliders className="w-4 h-4" />
          {selectedElement && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          )}
        </div>
        <span className="text-[10px]">
          {selectedElement ? `${t.navEdit} (1)` : t.navEdit}
        </span>
      </button>

      <button
        onClick={() => setActiveTab('files')}
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition cursor-pointer ${
          activeTab === 'files'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FolderTree className="w-4 h-4" />
        <span className="text-[10px]">{t.navFiles}</span>
      </button>

      <button
        onClick={() => setActiveTab('classes')}
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition cursor-pointer ${
          activeTab === 'classes'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Tag className="w-4 h-4" />
        <span className="text-[10px]">{t.navClasses}</span>
      </button>

      <button
        onClick={() => setActiveTab('code')}
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition cursor-pointer ${
          activeTab === 'code'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Code2 className="w-4 h-4" />
        <span className="text-[10px]">{t.navCode}</span>
      </button>
    </nav>
  );
};
