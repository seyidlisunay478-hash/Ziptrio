import React, { useState } from 'react';
import {
  X,
  Type,
  Heading1,
  Heading2,
  Square,
  Image as ImageIcon,
  MousePointerClick,
  Link as LinkIcon,
  Tag,
  Plus,
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface AddElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddElement: (elementData: {
    tag: string;
    text?: string;
    className?: string;
    src?: string;
  }) => void;
}

export const AddElementModal: React.FC<AddElementModalProps> = ({
  isOpen,
  onClose,
  onAddElement,
}) => {
  const { t, lang } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('button');
  const [customText, setCustomText] = useState<string>(lang === 'us' ? 'New Button' : 'Yeni Buton');
  const [customClass, setCustomClass] = useState<string>('btn btn-primary');

  if (!isOpen) return null;

  const isEn = lang === 'us';

  const elementPresets = [
    {
      id: 'h1',
      tag: 'h1',
      title: isEn ? 'Large Heading (H1)' : 'Büyük Başlık (H1)',
      shortTitle: isEn ? 'H1 Heading' : 'Büyük Başlık',
      icon: <Heading1 className="w-5 h-5 text-blue-400" />,
      defaultText: isEn ? 'New Large Heading' : 'Yeni Büyük Başlık',
      defaultClass: 'text-3xl font-bold',
    },
    {
      id: 'h2',
      tag: 'h2',
      title: isEn ? 'Section Heading (H2)' : 'Alt Başlık (H2)',
      shortTitle: isEn ? 'H2 Heading' : 'Alt Başlık',
      icon: <Heading2 className="w-5 h-5 text-indigo-400" />,
      defaultText: isEn ? 'Section Heading' : 'Bölüm Başlığı',
      defaultClass: 'text-2xl font-semibold',
    },
    {
      id: 'p',
      tag: 'p',
      title: isEn ? 'Paragraph Text' : 'Paragraf Metni',
      shortTitle: isEn ? 'Paragraph' : 'Paragraf',
      icon: <Type className="w-5 h-5 text-emerald-400" />,
      defaultText: isEn ? 'Enter your description or paragraph here.' : 'Buraya yeni açıklama veya paragraf metninizi yazabilirsiniz.',
      defaultClass: 'text-base text-gray-600',
    },
    {
      id: 'button',
      tag: 'button',
      title: isEn ? 'Interactive Button' : 'Etkileşimli Buton',
      shortTitle: isEn ? 'Button' : 'Buton',
      icon: <MousePointerClick className="w-5 h-5 text-amber-400" />,
      defaultText: isEn ? 'Click Here' : 'Hemen Tıkla',
      defaultClass: 'btn btn-primary',
    },
    {
      id: 'a',
      tag: 'a',
      title: isEn ? 'Link' : 'Bağlantı (Link)',
      shortTitle: isEn ? 'Link' : 'Bağlantı',
      icon: <LinkIcon className="w-5 h-5 text-sky-400" />,
      defaultText: isEn ? 'Read More →' : 'Detaylı Bilgi →',
      defaultClass: 'link',
    },
    {
      id: 'badge',
      tag: 'span',
      title: isEn ? 'Badge / Chip' : 'Rozet / Etiket (Badge)',
      shortTitle: isEn ? 'Badge' : 'Rozet',
      icon: <Tag className="w-5 h-5 text-purple-400" />,
      defaultText: isEn ? 'New' : 'Yeni',
      defaultClass: 'badge',
    },
    {
      id: 'div',
      tag: 'div',
      title: isEn ? 'Container Box (Div)' : 'Konteyner / Kutu (Div)',
      shortTitle: isEn ? 'Container' : 'Kutu',
      icon: <Square className="w-5 h-5 text-pink-400" />,
      defaultText: '',
      defaultClass: 'card p-4',
    },
    {
      id: 'img',
      tag: 'img',
      title: isEn ? 'Image' : 'Resim / Görsel',
      shortTitle: isEn ? 'Image' : 'Resim',
      icon: <ImageIcon className="w-5 h-5 text-teal-400" />,
      defaultText: '',
      defaultClass: 'rounded-lg w-full max-w-sm',
    },
  ];

  const handleSelectPreset = (preset: typeof elementPresets[0]) => {
    setSelectedType(preset.id);
    setCustomText(preset.defaultText);
    setCustomClass(preset.defaultClass);
  };

  const handleConfirm = () => {
    const preset = elementPresets.find((p) => p.id === selectedType) || elementPresets[3];
    onAddElement({
      tag: preset.tag,
      text: customText,
      className: customClass,
      src: preset.tag === 'img' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop' : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white text-sm">{t.addElementTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.selectElementType}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {elementPresets.map((preset) => {
                const isSelected = selectedType === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="mb-1.5">{preset.icon}</div>
                    <span className="text-xs font-medium">{preset.shortTitle}</span>
                    <span className="text-[10px] text-slate-400 font-mono">&lt;{preset.tag}&gt;</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text input if not img or div */}
          {selectedType !== 'img' && selectedType !== 'div' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.elementText}
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={isEn ? 'Enter element text...' : 'Öğe metnini girin...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Class input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.cssClasses}
            </label>
            <input
              type="text"
              value={customClass}
              onChange={(e) => setCustomClass(e.target.value)}
              placeholder="e.g. btn btn-primary"
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addElementBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
