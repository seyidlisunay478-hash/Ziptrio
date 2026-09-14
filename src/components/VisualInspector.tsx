import React, { useState, useEffect, useMemo } from 'react';
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
  Code2,
  Play,
  Zap,
  FileCode,
  ExternalLink,
  Terminal,
  AlertCircle,
} from 'lucide-react';
import { ParsedElementInfo, ProjectFile } from '../types';
import { ColorPickerControl } from './ColorPickerControl';
import { useLanguage } from '../utils/LanguageContext';
import { findScriptsForElement, EVENT_PRESETS } from '../utils/jsInspector';

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
  files?: ProjectFile[];
  onExecuteScript?: (code: string) => void;
  onOpenFileInEditor?: (filePath: string) => void;
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
  files = [],
  onExecuteScript,
  onOpenFileInEditor,
}) => {
  const { lang, t } = useLanguage();
  const isEn = lang === 'us' || lang === 'en';

  const [textInput, setTextInput] = useState('');
  const [newClassInput, setNewClassInput] = useState('');
  const [classSuggestions, setClassSuggestions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'design' | 'classes' | 'attributes' | 'javascript'>('design');

  // JavaScript tab states
  const [selectedEventName, setSelectedEventName] = useState('onclick');
  const [newEventCode, setNewEventCode] = useState("this.classList.toggle('active');");
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [liveConsoleCode, setLiveConsoleCode] = useState("this.style.transform = 'scale(1.05)';\nthis.style.transition = 'all 0.3s ease';");
  const [consoleStatus, setConsoleStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [editingEventName, setEditingEventName] = useState<string | null>(null);
  const [editingEventValue, setEditingEventValue] = useState<string>('');

  useEffect(() => {
    if (element) {
      setTextInput(element.textContent || '');
      setNewClassInput('');
    }
  }, [element?.vweId]);

  if (!element) return null;

  const scriptMatches = useMemo(() => {
    return findScriptsForElement(element, files);
  }, [element, files]);

  const attachedEvents = useMemo(() => {
    const list: { name: string; value: string }[] = [];
    if (!element || !element.attributes) return list;
    for (const [key, val] of Object.entries(element.attributes)) {
      const lower = key.toLowerCase();
      if (lower.startsWith('on') || lower.startsWith('data-action') || lower.startsWith('data-click')) {
        list.push({ name: key, value: String(val ?? '') });
      }
    }
    return list;
  }, [element?.attributes]);

  const jsBadgeCount = attachedEvents.length + scriptMatches.length;

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

      {/* Sub-Tabs (Design, Classes, Attributes, JavaScript) */}
      <div className="flex border-b border-slate-200 bg-white px-1 pt-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSection('design')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeSection === 'design'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isEn ? 'CSS & Style' : 'Görsel & CSS'}
        </button>
        <button
          onClick={() => setActiveSection('classes')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeSection === 'classes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isEn ? 'Classes' : 'Sınıflar'} ({element.classList.length})
        </button>
        <button
          onClick={() => setActiveSection('attributes')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeSection === 'attributes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isEn ? 'Attributes' : 'Öznitelik'}
        </button>
        <button
          onClick={() => setActiveSection('javascript')}
          className={`flex-1 py-2 px-1.5 text-center text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
            activeSection === 'javascript'
              ? 'border-amber-500 text-amber-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title={lang === 'az' ? 'Elementin arxasındakı JavaScript' : isEn ? 'JavaScript behind this element' : 'Bu öğenin arkasındaki JavaScript'}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>JavaScript</span>
          {jsBadgeCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {jsBadgeCount}
            </span>
          )}
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

        {/* ================= JAVASCRIPT TAB ================= */}
        {activeSection === 'javascript' && (
          <div className="space-y-4 text-xs">
            {/* Header info about target element */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
              <Code2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'az' ? 'Seçilmiş Element:' : isEn ? 'Target Element:' : 'Seçili Öğe:'}</span>
                  <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-900 font-mono text-[10px]">
                    &lt;{element.tagName.toLowerCase()}
                    {element.idAttr ? ` id="${element.idAttr}"` : ''}
                    {element.classList.length > 0 ? ` class="${element.classList.slice(0, 2).join(' ')}"` : ''}&gt;
                  </code>
                </div>
                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                  {lang === 'az'
                    ? 'Bu elementə bağlı JavaScript hadisələrini redaktə edin, layihə skriptlərini görün və ya birbaşa canlı kod işlədin.'
                    : isEn
                    ? 'Inspect and edit event listeners attached to this element, view referencing project scripts, or run live JavaScript.'
                    : 'Bu öğeye bağlı JavaScript olaylarını düzenleyin, sayfadaki JS kodlarını inceleyin veya canlı JavaScript çalıştırın.'}
                </p>
              </div>
            </div>

            {/* SECTION 1: Attached Event Handlers (onclick, onmouseover, etc.) */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {lang === 'az' ? 'Hadisə Dinləyiciləri' : isEn ? 'Event Handlers' : 'Olay Dinleyicileri'} ({attachedEvents.length})
                </span>
                <button
                  onClick={() => setShowAddEventModal(!showAddEventModal)}
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>{lang === 'az' ? 'Hadisə Əlavə Et' : isEn ? 'Add Event' : 'Olay Ekle'}</span>
                </button>
              </div>

              {/* Creator: Add new event */}
              {showAddEventModal && (
                <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-slate-800">
                      {lang === 'az' ? 'Yeni Hadisə Seçimi' : isEn ? 'Add New Event Listener' : 'Yeni Olay Tanımla'}
                    </span>
                    <button
                      onClick={() => setShowAddEventModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Event selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                        {lang === 'az' ? 'Hadisə (Event):' : isEn ? 'Event Type:' : 'Olay Türü:'}
                      </label>
                      <select
                        value={selectedEventName}
                        onChange={(e) => setSelectedEventName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono"
                      >
                        <option value="onclick">onclick (Tıklama)</option>
                        <option value="ondblclick">ondblclick (Çift Tıklama)</option>
                        <option value="onmouseenter">onmouseenter (Üzerine Gelince)</option>
                        <option value="onmouseleave">onmouseleave (Ayrılınca)</option>
                        <option value="onchange">onchange (Değer Değişince)</option>
                        <option value="onsubmit">onsubmit (Form Gönderilince)</option>
                        <option value="onfocus">onfocus (Odaklanınca)</option>
                        <option value="onblur">onblur (Odaktan Çıkınca)</option>
                        <option value="onkeydown">onkeydown (Tuşa Basılınca)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                        {lang === 'az' ? 'Hazır Şablon:' : isEn ? 'Presets:' : 'Hazır Şablon:'}
                      </label>
                      <select
                        onChange={(e) => {
                          const preset = EVENT_PRESETS.find((p) => p.code === e.target.value);
                          if (preset) {
                            setSelectedEventName(preset.event);
                            setNewEventCode(preset.code);
                          } else if (e.target.value) {
                            setNewEventCode(e.target.value);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {lang === 'az' ? 'Şablon seçin...' : isEn ? 'Choose preset...' : 'Şablon seçin...'}
                        </option>
                        {EVENT_PRESETS.map((p, idx) => (
                          <option key={idx} value={p.code}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                      {lang === 'az' ? 'İcra Olunacaq JavaScript Kodu:' : isEn ? 'JavaScript Code to Run:' : 'Çalıştırılacak JavaScript Kodu:'}
                    </label>
                    <textarea
                      rows={2}
                      value={newEventCode}
                      onChange={(e) => setNewEventCode(e.target.value)}
                      placeholder="this.classList.toggle('active');"
                      className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg p-2 focus:outline-none border border-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowAddEventModal(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      {lang === 'az' ? 'Ləğv et' : isEn ? 'Cancel' : 'İptal'}
                    </button>
                    <button
                      onClick={() => {
                        if (selectedEventName.trim() && newEventCode.trim()) {
                          onUpdateAttribute(selectedEventName.trim(), newEventCode.trim());
                          setShowAddEventModal(false);
                        }
                      }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                    >
                      {lang === 'az' ? 'Elementə Bağla' : isEn ? 'Attach to Element' : 'Öğeye Ekle'}
                    </button>
                  </div>
                </div>
              )}

              {/* List of currently attached events */}
              {attachedEvents.length === 0 ? (
                <div className="text-center py-4 px-3 bg-white rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">
                    {lang === 'az'
                      ? 'Bu elementdə hələ inline hadisə (onclick və s.) yoxdur.'
                      : isEn
                      ? 'No inline event handlers attached to this element.'
                      : 'Bu öğede henüz inline olay (onclick vb.) tanımlı değil.'}
                  </p>
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="mt-2 text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
                  >
                    + {lang === 'az' ? 'İlk Hadisəni Əlavə Edin' : isEn ? 'Add first event listener' : 'İlk olayı şimdi ekleyin'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {attachedEvents.map(({ name, value }) => {
                    const isEditing = editingEventName === name;
                    const currentValue = isEditing ? editingEventValue : value;

                    return (
                      <div
                        key={name}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
                      >
                        <div className="bg-slate-100/80 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Run on element */}
                            <button
                              onClick={() => {
                                if (onExecuteScript) {
                                  onExecuteScript(currentValue);
                                }
                              }}
                              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer border border-emerald-200"
                              title={lang === 'az' ? 'Bu kodu sınaqdan keçir' : isEn ? 'Test run this code' : 'Bu kodu önizlemede test et'}
                            >
                              <Play className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                              <span>{lang === 'az' ? 'Test Et' : isEn ? 'Test' : 'Test Et'}</span>
                            </button>

                            {/* Delete event */}
                            <button
                              onClick={() => onUpdateAttribute(name, null)}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                              title={lang === 'az' ? 'Hadisəni sil' : isEn ? 'Remove event' : 'Olayı kaldır'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="p-2.5 space-y-2">
                          <textarea
                            rows={2}
                            value={currentValue}
                            onChange={(e) => {
                              setEditingEventName(name);
                              setEditingEventValue(e.target.value);
                            }}
                            className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg p-2 focus:outline-none border border-slate-800"
                          />
                          {isEditing && (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingEventName(null)}
                                className="px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                {lang === 'az' ? 'İmtina' : isEn ? 'Reset' : 'Vazgeç'}
                              </button>
                              <button
                                onClick={() => {
                                  onUpdateAttribute(name, editingEventValue);
                                  setEditingEventName(null);
                                }}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-xs cursor-pointer"
                              >
                                {lang === 'az' ? 'Yadda Saxla' : isEn ? 'Save' : 'Kaydet'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: Project JS Scripts Targeting This Element */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  {lang === 'az'
                    ? 'Bu Elementi Hədəfləyən Skriptlər'
                    : isEn
                    ? 'Project Scripts Referencing Element'
                    : 'Öğeyi Hedefleyen JS Kodları'}{' '}
                  ({scriptMatches.length})
                </span>
              </div>

              {scriptMatches.length === 0 ? (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs space-y-1">
                  <p>
                    {lang === 'az'
                      ? 'Proyekt fayllarında bu elementin ID və ya sinifini birbaşa seçən JS kodu tapılmadı.'
                      : isEn
                      ? 'No project scripts currently reference this element by ID or class.'
                      : 'Proje JS dosyalarında bu öğenin ID (#id) veya sınıflarını doğrudan seçen bir kural bulunamadı.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'az'
                      ? 'Məsləhət: Yuxarıdakı "Hadisə Əlavə Et" düyməsi ilə elementə dərhal klik və ya animasiya kodu bağlaya bilərsiniz.'
                      : isEn
                      ? 'Tip: You can attach event handlers directly using the "Add Event" button above.'
                      : 'İpucu: Yukarıdaki "Olay Ekle" butonuyla öğeye hemen tıklama kodu veya animasyon ekleyebilirsiniz.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {scriptMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
                    >
                      <div className="bg-slate-100/90 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileCode className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="font-mono text-[11px] font-semibold text-slate-800 truncate">
                            {match.file}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            :{match.line}
                          </span>
                        </div>
                        {onOpenFileInEditor && (
                          <button
                            onClick={() => onOpenFileInEditor(match.file)}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer"
                            title={lang === 'az' ? 'Faylı redaktorda aç' : isEn ? 'Open file in editor' : 'Dosyayı kod editöründe aç'}
                          >
                            <span>{lang === 'az' ? 'Redaktorda Aç' : isEn ? 'Open Editor' : 'Editörde Aç'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>

                      <div className="px-3 py-1.5 bg-slate-50/50 border-b border-slate-100">
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {match.reason}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-950 overflow-x-auto">
                        <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
                          {match.codeSnippet}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: Live JavaScript Console & Sandbox */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  {lang === 'az' ? 'Canlı JS Sınaq Konsolu' : isEn ? 'Live JS Sandbox' : 'Canlı JS Test Konsolu'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">
                  this = element
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                {lang === 'az'
                  ? 'Element üzərində anında JavaScript əmrlərini icra edin (`this` seçilmiş elementi göstərir):'
                  : isEn
                  ? 'Run real-time JavaScript statements directly on this element (`this` refers to DOM node):'
                  : 'Bu öğe üzerinde anında JavaScript kodlarını çalıştırın (`this` seçili öğeyi temsil eder):'}
              </p>

              {/* Quick Snippets */}
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() =>
                    setLiveConsoleCode("this.style.color = '#ef4444';\nthis.style.fontWeight = 'bold';")
                  }
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-mono cursor-pointer"
                >
                  Kırmızı Yap
                </button>
                <button
                  onClick={() =>
                    setLiveConsoleCode(
                      "this.style.backgroundColor = '#1e293b';\nthis.style.color = '#ffffff';\nthis.style.borderRadius = '12px';"
                    )
                  }
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-mono cursor-pointer"
                >
                  Koyu Kutu
                </button>
                <button
                  onClick={() =>
                    setLiveConsoleCode(
                      "this.style.transform = 'rotate(4deg) scale(1.05)';\nthis.style.transition = 'all 0.3s';"
                    )
                  }
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-mono cursor-pointer"
                >
                  Döndür & Büyüt
                </button>
                <button
                  onClick={() =>
                    setLiveConsoleCode("this.classList.toggle('active');")
                  }
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-mono cursor-pointer"
                >
                  Toggle Class
                </button>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={liveConsoleCode}
                  onChange={(e) => setLiveConsoleCode(e.target.value)}
                  placeholder="this.style.transform = 'scale(1.1)';"
                  className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl p-2.5 focus:outline-none border border-slate-800"
                />

                <button
                  onClick={() => {
                    if (onExecuteScript && liveConsoleCode.trim()) {
                      onExecuteScript(liveConsoleCode.trim());
                      setConsoleStatus({ ok: true, msg: 'Kod elementdə uğurla icra olundu!' });
                      setTimeout(() => setConsoleStatus(null), 3000);
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>
                    {lang === 'az'
                      ? 'Elementdə Canlı İşlət'
                      : isEn
                      ? 'Execute Live on Element'
                      : 'Elementte Canlı Çalıştır'}
                  </span>
                </button>

                {consoleStatus && (
                  <div
                    className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                      consoleStatus.ok
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{consoleStatus.msg}</span>
                  </div>
                )}
              </div>
            </div>
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
