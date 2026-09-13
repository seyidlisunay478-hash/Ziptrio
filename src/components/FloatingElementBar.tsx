import React from 'react';
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sliders,
  X,
  Undo2,
} from 'lucide-react';
import { ParsedElementInfo } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface FloatingElementBarProps {
  element: ParsedElementInfo;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onOpenInspector: () => void;
  isInspectorOpen: boolean;
  onDeselect: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

export const FloatingElementBar: React.FC<FloatingElementBarProps> = ({
  element,
  onDuplicate,
  onDelete,
  onMove,
  onOpenInspector,
  isInspectorOpen,
  onDeselect,
  canUndo,
  onUndo,
}) => {
  const { t, lang } = useLanguage();

  const getFriendlyTagName = (tag: string) => {
    const uppercase = tag.toUpperCase();
    if (lang === 'us') {
      switch (uppercase) {
        case 'H1':
          return 'Main Heading (H1)';
        case 'H2':
          return 'Section Heading (H2)';
        case 'H3':
          return 'Subheading (H3)';
        case 'H4':
        case 'H5':
        case 'H6':
          return `Heading (${uppercase})`;
        case 'BUTTON':
          return 'Button';
        case 'P':
          return 'Paragraph (P)';
        case 'A':
          return 'Link (A)';
        case 'SPAN':
          return 'Text / Badge (Span)';
        case 'IMG':
          return 'Image (Img)';
        case 'DIV':
          return 'Container (Div)';
        case 'HEADER':
          return 'Header';
        case 'NAV':
          return 'Nav Menu';
        case 'SECTION':
          return 'Section';
        case 'FOOTER':
          return 'Footer';
        default:
          return `<${tag.toLowerCase()}>`;
      }
    }

    switch (uppercase) {
      case 'H1':
        return 'Ana Başlık (H1)';
      case 'H2':
        return 'Bölüm Başlığı (H2)';
      case 'H3':
        return 'Alt Başlık (H3)';
      case 'H4':
      case 'H5':
      case 'H6':
        return `Başlık (${uppercase})`;
      case 'BUTTON':
        return 'Buton (Button)';
      case 'P':
        return 'Paragraf (P)';
      case 'A':
        return 'Link Bağlantısı (A)';
      case 'SPAN':
        return 'Metin / Rozet (Span)';
      case 'IMG':
        return 'Resim (Img)';
      case 'DIV':
        return 'Kutu / Bölüm (Div)';
      case 'HEADER':
        return 'Üst Alan (Header)';
      case 'NAV':
        return 'Menü (Nav)';
      case 'SECTION':
        return 'Bölüm (Section)';
      case 'FOOTER':
        return 'Alt Alan (Footer)';
      default:
        return `<${tag.toLowerCase()}>`;
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white/95 backdrop-blur-md border border-indigo-100 shadow-2xl shadow-indigo-500/15 rounded-2xl px-2.5 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-3 text-xs text-slate-800">
        {/* Element Info Badge */}
        <div className="flex items-center gap-1.5 truncate max-w-[120px] sm:max-w-[200px]">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
          <div className="truncate">
            <span className="font-bold text-[11px] sm:text-xs text-indigo-900 block truncate">
              {getFriendlyTagName(element.tagName)}
            </span>
            {element.classList.length > 0 ? (
              <span className="text-[10px] font-mono text-slate-400 truncate block">
                .{element.classList[0]}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 truncate block">
                {element.textContent ? `"${element.textContent.slice(0, 15)}..."` : (lang === 'us' ? 'Selected' : 'Seçili Öğe')}
              </span>
            )}
          </div>
        </div>

        <div className="w-px h-5 bg-slate-200 shrink-0 hidden xs:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Duplicate */}
          <button
            onClick={onDuplicate}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition active:scale-95 cursor-pointer"
            title={t.duplicate}
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.duplicate}</span>
          </button>

          {/* Move Up */}
          <button
            onClick={() => onMove('up')}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 cursor-pointer"
            title={t.moveUp}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Move Down */}
          <button
            onClick={() => onMove('down')}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 cursor-pointer"
            title={t.moveDown}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium text-[11px] transition active:scale-95 cursor-pointer flex items-center gap-1"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.delete}</span>
          </button>

          {/* Quick Undo if available */}
          {canUndo && onUndo && (
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition active:scale-95 cursor-pointer"
              title={t.undoTooltip}
            >
              <Undo2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">{t.undo}</span>
            </button>
          )}

          {/* Open Style Inspector Button */}
          <button
            onClick={onOpenInspector}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm transition active:scale-95 cursor-pointer ${
              isInspectorOpen
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-indigo-500/20'
            }`}
            title={lang === 'us' ? 'Open Visual Style Inspector' : 'Görsel CSS, Renk ve Yazı Ayarlarını Aç'}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isInspectorOpen ? (lang === 'us' ? 'Close Panel' : 'Paneli Kapat') : (lang === 'us' ? 'Edit Styles' : 'Stili Düzenle')}</span>
          </button>

          {/* Deselect */}
          <button
            onClick={onDeselect}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ml-0.5"
            title={t.deselect}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
