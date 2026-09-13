import React, { useState, useEffect } from 'react';
import {
  Type,
  Palette,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Sliders,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Check,
  ChevronRight,
  Maximize2,
  Tag,
} from 'lucide-react';
import { ParsedElementInfo } from '../types';
import { ColorPickerControl } from './ColorPickerControl';
import { useLanguage } from '../utils/LanguageContext';

interface VisualInspectorProps {
  element: ParsedElementInfo | null;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateText: (text: string) => void;
  onUpdateInnerHTML: (html: string) => void;
  onUpdateClasses: (classes: string) => void;
  onUpdateAttribute: (name: string, value: string | null) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onMoveElement: (direction: 'up' | 'down') => void;
  onClose: () => void;
  allClassNames: string[];
}

export const VisualInspector: React.FC<VisualInspectorProps> = ({
  element,
  onUpdateStyle,
  onUpdateText,
  onUpdateClasses,
  onUpdateAttribute,
  onDeleteElement,
  onDuplicateElement,
  onMoveElement,
  onClose,
  allClassNames,
}) => {
  const { lang, t } = useLanguage();
  const isEn = lang === 'us';

  const [textInput, setTextInput] = useState('');
  const [newClassInput, setNewClassInput] = useState('');
  const [classSuggestions, setClassSuggestions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'design' | 'classes' | 'attributes'>('design');

  useEffect(() => {
    if (element) {
      setTextInput(element.textContent || '');
      setNewClassInput('');
    }
  }, [element?.vweId]);

  if (!element) return null;

  const cs = element.computedStyle;

  // Friendly element naming
  const getFriendlyTagName = (tag: string) => {
    const tUpper = tag.toUpperCase();
    if (isEn) {
      switch (tUpper) {
        case 'H1':
          return 'Main Heading (H1)';
        case 'H2':
          return 'Section Heading (H2)';
        case 'H3':
          return 'Sub Heading (H3)';
        case 'H4':
        case 'H5':
        case 'H6':
          return `Heading (${tUpper})`;
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
          return 'Container Box (Div)';
        case 'HEADER':
          return 'Header Bar';
        case 'NAV':
          return 'Navigation (Nav)';
        case 'SECTION':
          return 'Section';
        case 'FOOTER':
          return 'Footer';
        case 'INPUT':
          return 'Input Field';
        default:
          return `<${tag.toLowerCase()}> Element`;
      }
    }

    switch (tUpper) {
      case 'H1':
        return 'Ana Başlık (H1)';
      case 'H2':
        return 'Bölüm Başlığı (H2)';
      case 'H3':
        return 'Alt Başlık (H3)';
      case 'H4':
      case 'H5':
      case 'H6':
        return `Başlık (${tUpper})`;
      case 'BUTTON':
        return 'Buton (Button)';
      case 'P':
        return 'Paragraf Metni (P)';
      case 'A':
        return 'Bağlantı Linki (A)';
      case 'SPAN':
        return 'Metin / Rozet (Span)';
      case 'IMG':
        return 'Resim / Görsel (Img)';
      case 'DIV':
        return 'Kutu / Konteyner (Div)';
      case 'HEADER':
        return 'Üst Menü Alanı (Header)';
      case 'NAV':
        return 'Menü (Nav)';
      case 'SECTION':
        return 'Bölüm (Section)';
      case 'FOOTER':
        return 'Alt Bilgi (Footer)';
      case 'INPUT':
        return 'Giriş Alanı (Input)';
      default:
        return `<${tag.toLowerCase()}> Öğesi`;
    }
  };

  const isTextElement = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'BUTTON', 'A', 'LABEL', 'LI'].includes(
    element.tagName
  );

  const colorPresets = [
    '#ffffff',
    '#0f172a',
    '#2563eb',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    'transparent',
  ];

  const handleRemoveClass = (clsToRemove: string) => {
    const updated = element.classList.filter((c) => c !== clsToRemove).join(' ');
    onUpdateClasses(updated);
  };

  const handleAddClass = (clsToAdd: string) => {
    const trimmed = clsToAdd.trim();
    if (!trimmed) return;
    const current = new Set(element.classList);
    trimmed.split(/\s+/).forEach((c) => current.add(c));
    onUpdateClasses(Array.from(current).join(' '));
    setNewClassInput('');
    setClassSuggestions([]);
  };

  const handleClassInputChange = (val: string) => {
    setNewClassInput(val);
    if (!val.trim()) {
      setClassSuggestions([]);
      return;
    }
    const q = val.toLowerCase();
    const matches = allClassNames
      .filter((c) => c.toLowerCase().includes(q) && !element.classList.includes(c))
      .slice(0, 6);
    setClassSuggestions(matches);
  };

  return (
    <div className="w-full h-full bg-white border-l border-slate-200 flex flex-col select-none text-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-150">
      {/* Element Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
            <span className="font-bold text-sm text-slate-900 truncate">
              {getFriendlyTagName(element.tagName)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            title={isEn ? 'Close Panel' : 'Paneli Kapat'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tag, ID and Class pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold border border-blue-200">
            &lt;{element.tagName.toLowerCase()}&gt;
          </span>
          {element.idAttr && (
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
              #{element.idAttr}
            </span>
          )}
          {element.classList.slice(0, 3).map((cls) => (
            <span
              key={cls}
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200/80 text-slate-700"
            >
              .{cls}
            </span>
          ))}
        </div>

        {/* Quick Action Buttons (Duplicate, Delete, Move) */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-200">
          <button
            onClick={onDuplicateElement}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200 cursor-pointer"
            title={isEn ? 'Create duplicate of this element' : 'Bu öğenin birebir kopyasını oluştur'}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isEn ? 'Copy' : 'Kopyala'}</span>
          </button>

          <button
            onClick={() => onMoveElement('up')}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
            title={isEn ? 'Move Up' : 'Yukarı Taşı'}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{isEn ? 'Up' : 'Yukarı'}</span>
          </button>

          <button
            onClick={() => onMoveElement('down')}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
            title={isEn ? 'Move Down' : 'Aşağı Taşı'}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{isEn ? 'Down' : 'Aşağı'}</span>
          </button>

          <button
            onClick={onDeleteElement}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition border border-red-200 cursor-pointer"
            title={isEn ? 'Delete element' : 'Bu öğeyi sayfadan sil'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Delete' : 'Sil'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs (Design, Classes, Attributes) */}
      <div className="flex border-b border-slate-200 bg-white px-2 pt-1">
        <button
          onClick={() => setActiveSection('design')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeSection === 'design'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isEn ? 'Visual CSS & Colors' : 'Görsel CSS & Renkler'}
        </button>
        <button
          onClick={() => setActiveSection('classes')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeSection === 'classes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isEn ? 'Classes' : 'Sınıflar'} ({element.classList.length})
        </button>
        <button
          onClick={() => setActiveSection('attributes')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeSection === 'attributes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isEn ? 'Attributes' : 'Öznitelikler'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= DESIGN & CSS SETTINGS ================= */}
        {activeSection === 'design' && (
          <div className="space-y-4 text-xs">
            {/* Direct Text Editor (if text element) */}
            {isTextElement && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  {isEn ? 'Text Content' : 'Metin İçeriği'}
                </label>
                <textarea
                  rows={2}
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    onUpdateText(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-sans"
                  placeholder={isEn ? 'Type text...' : 'Metin yazın...'}
                />
              </div>
            )}

            {/* Typography CSS Section */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? 'Typography & Style' : 'Yazı Boyutu & Stili'}
              </span>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-600 font-medium">
                    {isEn ? 'Font Size' : 'Yazı Boyutu'}
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600">{cs.fontSize}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="72"
                  value={parseInt(cs.fontSize) || 16}
                  onChange={(e) => onUpdateStyle('fontSize', `${e.target.value}px`)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Font Weight & Align */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">
                    {isEn ? 'Font Weight' : 'Kalınlık'}
                  </label>
                  <select
                    value={cs.fontWeight}
                    onChange={(e) => onUpdateStyle('fontWeight', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                  >
                    <option value="300">{isEn ? 'Thin (300)' : 'İnce (300)'}</option>
                    <option value="400">{isEn ? 'Normal (400)' : 'Normal (400)'}</option>
                    <option value="500">{isEn ? 'Medium (500)' : 'Orta (500)'}</option>
                    <option value="600">{isEn ? 'Semi Bold (600)' : 'Yarı Kalın (600)'}</option>
                    <option value="700">{isEn ? 'Bold (700)' : 'Kalın (700)'}</option>
                    <option value="800">{isEn ? 'Extra Bold (800)' : 'Çok Kalın (800)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">
                    {isEn ? 'Alignment' : 'Hizalama'}
                  </label>
                  <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateStyle('textAlign', 'left')}
                      className={`flex-1 py-1 rounded flex justify-center cursor-pointer ${
                        cs.textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isEn ? 'Align Left' : 'Sola Hizala'}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateStyle('textAlign', 'center')}
                      className={`flex-1 py-1 rounded flex justify-center cursor-pointer ${
                        cs.textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isEn ? 'Align Center' : 'Ortala'}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateStyle('textAlign', 'right')}
                      className={`flex-1 py-1 rounded flex justify-center cursor-pointer ${
                        cs.textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isEn ? 'Align Right' : 'Sağa Hizala'}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Color with Full Visual Color Picker */}
              <div className="pt-1">
                <ColorPickerControl
                  label={isEn ? 'Text Color' : 'Yazı Rengi'}
                  value={cs.color}
                  onChange={(newColor) => onUpdateStyle('color', newColor)}
                  allowTransparent={false}
                />
              </div>
            </div>

            {/* Background & Colors Section with Full Visual Color Picker */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? 'Background Style' : 'Arka Plan Stili'}
              </span>

              <ColorPickerControl
                label={isEn ? 'Background Color' : 'Arka Plan Rengi'}
                value={cs.backgroundColor}
                onChange={(newColor) => onUpdateStyle('backgroundColor', newColor)}
                allowTransparent={true}
              />
            </div>

            {/* Spacing: Padding & Margin */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? 'Spacing (Inner & Outer)' : 'Boşluklar (İç & Dış)'}
              </span>

              {/* Padding Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-600 font-medium">
                    {isEn ? 'Inner Spacing (Padding)' : 'İç Boşluk (Padding)'}
                  </label>
                  <span className="text-xs font-mono font-semibold text-blue-600">
                    {cs.paddingTop}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={parseInt(cs.paddingTop) || 0}
                  onChange={(e) => {
                    const val = `${e.target.value}px`;
                    onUpdateStyle('padding', val);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Margin Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-600 font-medium">
                    {isEn ? 'Outer Spacing (Margin)' : 'Dış Boşluk (Margin)'}
                  </label>
                  <span className="text-xs font-mono font-semibold text-amber-600">
                    {cs.marginTop}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={parseInt(cs.marginTop) || 0}
                  onChange={(e) => {
                    const val = `${e.target.value}px`;
                    onUpdateStyle('margin', val);
                  }}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Border Radius & Borders */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? 'Corner Radius & Border' : 'Köşe Yuvarlaklığı & Kenarlık'}
              </span>

              {/* Border Radius */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-600 font-medium">
                    {isEn ? 'Corner Radius (Border Radius)' : 'Köşe Yuvarlaklığı (Radius)'}
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {cs.borderRadius}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={parseInt(cs.borderRadius) || 0}
                  onChange={(e) => onUpdateStyle('borderRadius', `${e.target.value}px`)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Border Width */}
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">
                  {isEn ? 'Border Width' : 'Kenarlık Kalınlığı'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={parseInt(cs.borderWidth) || 0}
                  onChange={(e) => {
                    onUpdateStyle('borderWidth', `${e.target.value}px`);
                    if (!cs.borderStyle || cs.borderStyle === 'none') {
                      onUpdateStyle('borderStyle', 'solid');
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                />
              </div>

              {/* Kenarlık Rengi using ColorPickerControl */}
              <div className="pt-1">
                <ColorPickerControl
                  label={isEn ? 'Border Color' : 'Kenarlık Rengi'}
                  value={cs.borderColor}
                  onChange={(newColor) => {
                    onUpdateStyle('borderColor', newColor);
                    if (!cs.borderStyle || cs.borderStyle === 'none') {
                      onUpdateStyle('borderStyle', 'solid');
                    }
                  }}
                  allowTransparent={true}
                />
              </div>
            </div>

            {/* Opacity & Shadow */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? 'Shadow & Opacity' : 'Gölge & Saydamlık'}
              </span>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-600 font-medium">
                    {isEn ? 'Opacity' : 'Saydamlık (Opaklık)'}
                  </label>
                  <span className="text-xs font-mono text-slate-700">
                    {Math.round((parseFloat(cs.opacity) || 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round((parseFloat(cs.opacity) || 1) * 100)}
                  onChange={(e) => onUpdateStyle('opacity', `${parseInt(e.target.value) / 100}`)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1.5">
                  {isEn ? 'Shadow Presets' : 'Hazır Gölge'}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onUpdateStyle('boxShadow', 'none')}
                    className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] cursor-pointer"
                  >
                    {isEn ? 'No Shadow' : 'Gölge Yok'}
                  </button>
                  <button
                    onClick={() => onUpdateStyle('boxShadow', '0 4px 12px rgba(0,0,0,0.08)')}
                    className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] cursor-pointer"
                  >
                    {isEn ? 'Subtle Shadow' : 'Hafif Gölge'}
                  </button>
                  <button
                    onClick={() => onUpdateStyle('boxShadow', '0 10px 25px rgba(0,0,0,0.15)')}
                    className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] cursor-pointer"
                  >
                    {isEn ? 'Elevated' : 'Kabarık Gölge'}
                  </button>
                  <button
                    onClick={() => onUpdateStyle('boxShadow', '0 0 20px rgba(37,99,235,0.3)')}
                    className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] text-blue-600 cursor-pointer font-medium"
                  >
                    {isEn ? 'Blue Glow' : 'Mavi Işıma'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= CLASSES TAB ================= */}
        {activeSection === 'classes' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                {isEn ? 'Assigned CSS Classes' : 'Tanımlı CSS Sınıfları'}
              </label>

              {element.classList.length === 0 ? (
                <p className="text-slate-400 text-xs italic">
                  {isEn ? 'No CSS classes assigned to this element.' : 'Bu öğede atanmış bir CSS sınıfı yok.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {element.classList.map((cls) => (
                    <span
                      key={cls}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-medium"
                    >
                      <span>.{cls}</span>
                      <button
                        onClick={() => handleRemoveClass(cls)}
                        className="hover:text-red-500 transition cursor-pointer"
                        title={isEn ? 'Remove class' : 'Sınıfı kaldır'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Add Class Input */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 relative">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {isEn ? 'Add New Class' : 'Yeni Sınıf Ekle'}
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newClassInput}
                  onChange={(e) => handleClassInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddClass(newClassInput);
                  }}
                  placeholder={isEn ? 'e.g. btn-primary, hero-title...' : 'örn: btn-primary, hero-title...'}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleAddClass(newClassInput)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {isEn ? 'Add' : 'Ekle'}
                </button>
              </div>

              {/* Suggestions dropdown */}
              {classSuggestions.length > 0 && (
                <div className="absolute left-3.5 right-3.5 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 max-h-44 overflow-y-auto">
                  {classSuggestions.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => handleAddClass(sug)}
                      className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-xs font-mono text-blue-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>.{sug}</span>
                      <Plus className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ATTRIBUTES TAB ================= */}
        {activeSection === 'attributes' && (
          <div className="space-y-4 text-xs">
            {/* ID */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                {isEn ? 'Element ID (#id)' : 'Öğe ID (#id)'}
              </label>
              <input
                type="text"
                value={element.idAttr}
                onChange={(e) => onUpdateAttribute('id', e.target.value)}
                placeholder={isEn ? 'Element ID' : "Öğe ID'si"}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Link href if <a> */}
            {element.tagName === 'A' && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  {isEn ? 'Link URL (href)' : 'Bağlantı URL (href)'}
                </span>
                <input
                  type="text"
                  value={element.attributes.href || ''}
                  onChange={(e) => onUpdateAttribute('href', e.target.value)}
                  placeholder={isEn ? 'https://... or #section' : 'https://... veya #bolum'}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            )}

            {/* Image src if <img> */}
            {element.tagName === 'IMG' && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  {isEn ? 'Image Source (src) & Alt Text' : 'Resim Kaynağı (src) & Açıklama (alt)'}
                </span>
                <input
                  type="text"
                  value={element.attributes.src || ''}
                  onChange={(e) => onUpdateAttribute('src', e.target.value)}
                  placeholder={isEn ? 'Image URL address' : 'Resim URL adresi'}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
                <input
                  type="text"
                  value={element.attributes.alt || ''}
                  onChange={(e) => onUpdateAttribute('alt', e.target.value)}
                  placeholder={isEn ? 'Alt description text' : 'Alt açıklama metni'}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function rgbToHex(rgbStr: string): string {
  if (!rgbStr) return '#000000';
  if (rgbStr.startsWith('#')) return rgbStr;
  const match = rgbStr.match(/\d+/g);
  if (!match || match.length < 3) return '#000000';
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
