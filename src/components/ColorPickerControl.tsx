import React, { useState, useEffect, useRef } from 'react';
import { Pipette, Sparkles, Hash, Ban, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface ColorPickerControlProps {
  label: string;
  value: string;
  onChange: (newColor: string) => void;
  allowTransparent?: boolean;
}

// Convert rgb/rgba or hex string to standard 6-digit hex (#rrggbb)
export function parseColorToHex(colorStr: string): string {
  if (!colorStr) return '#000000';
  const trimmed = colorStr.trim().toLowerCase();

  if (trimmed === 'transparent' || trimmed === 'rgba(0, 0, 0, 0)') {
    return 'transparent';
  }

  if (trimmed.startsWith('#')) {
    if (trimmed.length === 4) {
      // Short hex #rgb -> #rrggbb
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
    }
    return trimmed.slice(0, 7);
  }

  const match = trimmed.match(/\d+/g);
  if (!match || match.length < 3) return '#000000';

  const r = Math.min(255, Math.max(0, parseInt(match[0], 10)));
  const g = Math.min(255, Math.max(0, parseInt(match[1], 10)));
  const b = Math.min(255, Math.max(0, parseInt(match[2], 10)));

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

// Convert hue (0-360) to a vibrant hex color
function hueToHex(h: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    const color = 0.95 - 0.95 * Math.max(Math.min(k, 4 - k, 1), 0);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

// Rich curated palette categories
const PALETTES = {
  modern: [
    { name: 'Blue / Mavi', hex: '#3b82f6' },
    { name: 'Indigo / İndigo', hex: '#6366f1' },
    { name: 'Purple / Mor', hex: '#8b5cf6' },
    { name: 'Pink / Pembe', hex: '#ec4899' },
    { name: 'Rose / Gül', hex: '#f43f5e' },
    { name: 'Red / Kırmızı', hex: '#ef4444' },
    { name: 'Orange / Turuncu', hex: '#f97316' },
    { name: 'Amber / Sarı', hex: '#f59e0b' },
    { name: 'Emerald / Zümrüt', hex: '#10b981' },
    { name: 'Green / Yeşil', hex: '#22c55e' },
    { name: 'Teal / Turkuaz', hex: '#14b8a6' },
    { name: 'Cyan', hex: '#06b6d4' },
  ],
  neutrals: [
    { name: 'Black / Siyah', hex: '#000000' },
    { name: 'Dark Graphite / Grafit', hex: '#0f172a' },
    { name: 'Dark Slate', hex: '#1e293b' },
    { name: 'Slate Gray', hex: '#475569' },
    { name: 'Light Slate', hex: '#94a3b8' },
    { name: 'Smoke / Duman', hex: '#cbd5e1' },
    { name: 'Cloud / Bulut', hex: '#f1f5f9' },
    { name: 'White / Beyaz', hex: '#ffffff' },
  ],
  pastels: [
    { name: 'Pastel Red', hex: '#fecaca' },
    { name: 'Pastel Orange', hex: '#fed7aa' },
    { name: 'Pastel Yellow', hex: '#fef08a' },
    { name: 'Pastel Green', hex: '#bbf7d0' },
    { name: 'Pastel Blue', hex: '#bfdbfe' },
    { name: 'Pastel Indigo', hex: '#c7d2fe' },
    { name: 'Pastel Purple', hex: '#e9d5ff' },
    { name: 'Pastel Pink', hex: '#fbcfe8' },
  ],
};

export const ColorPickerControl: React.FC<ColorPickerControlProps> = ({
  label,
  value,
  onChange,
  allowTransparent = false,
}) => {
  const { lang } = useLanguage();
  const nativePickerRef = useRef<HTMLInputElement>(null);
  const currentHex = parseColorToHex(value);
  const isTransparent = currentHex === 'transparent';

  const [hexInput, setHexInput] = useState(isTransparent ? 'transparent' : currentHex);
  const [activePaletteTab, setActivePaletteTab] = useState<'modern' | 'neutrals' | 'pastels'>('modern');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hueValue, setHueValue] = useState(210); // Default blueish

  const isEn = lang === 'us';

  // Keep local input in sync when prop changes externally
  useEffect(() => {
    setHexInput(isTransparent ? 'transparent' : currentHex);
  }, [value, isTransparent, currentHex]);

  const handleHexInputChange = (text: string) => {
    setHexInput(text);
    const cleaned = text.trim();
    if (cleaned.toLowerCase() === 'transparent') {
      if (allowTransparent) onChange('transparent');
      return;
    }

    let candidate = cleaned;
    if (!candidate.startsWith('#')) {
      candidate = '#' + candidate;
    }

    // If it's a valid 3 or 6 digit hex
    if (/^#([0-9a-fA-F]{3}){1,2}$/.test(candidate)) {
      onChange(candidate);
    }
  };

  const handleEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          onChange(result.sRGBHex);
        }
      } catch (e) {
        // User canceled eyedropper, do nothing
      }
    }
  };

  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
      {/* Top Header Row: Label & Current Value */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          {label}
        </label>

        {/* Current Color Indicator Badge */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs relative overflow-hidden shrink-0"
            style={{
              backgroundColor: isTransparent ? 'transparent' : currentHex,
              backgroundImage: isTransparent
                ? 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)'
                : 'none',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
            }}
          >
            {isTransparent && (
              <span className="absolute inset-0 border-t-2 border-red-500 transform rotate-45" />
            )}
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {isTransparent ? (isEn ? 'Transparent' : 'Saydam') : currentHex.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Interactive Controls: Big Swatch Trigger + Hex Input + Tools */}
      <div className="flex items-center gap-2">
        {/* Visual Color Picker Button (Clicking triggers native OS / browser full color picker) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => nativePickerRef.current?.click()}
            className="w-10 h-10 rounded-xl border-2 border-slate-200 hover:border-indigo-500 p-0.5 shadow-xs transition active:scale-95 cursor-pointer relative overflow-hidden group flex items-center justify-center"
            title={isEn ? 'Open Full Color Picker' : 'Detaylı Renk Seçicisini Aç'}
          >
            <div
              className="w-full h-full rounded-lg relative overflow-hidden"
              style={{
                backgroundColor: isTransparent ? '#ffffff' : currentHex,
                backgroundImage: isTransparent
                  ? 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)'
                  : 'none',
                backgroundSize: '8px 8px',
              }}
            >
              {isTransparent && (
                <span className="absolute inset-0 border-t-2 border-red-500 transform rotate-45" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white">
              <Pipette className="w-3.5 h-3.5 drop-shadow" />
            </div>
          </button>

          {/* Hidden actual native color picker input */}
          <input
            type="color"
            ref={nativePickerRef}
            value={isTransparent ? '#ffffff' : currentHex}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </div>

        {/* Manual Hex Input with '#' Icon */}
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-2.5 text-slate-400 font-mono text-xs pointer-events-none">
            <Hash className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={hexInput.replace(/^#/, '')}
            onChange={(e) => handleHexInputChange(e.target.value)}
            placeholder={isEn ? 'HEX code e.g. 3B82F6' : 'HEX kodu örn: 3B82F6'}
            className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:bg-white rounded-xl pl-8 pr-2.5 py-2 text-xs font-mono text-slate-800 focus:outline-none transition uppercase"
          />
        </div>

        {/* EyeDropper Tool Button (If supported by browser) */}
        {hasEyeDropper && (
          <button
            type="button"
            onClick={handleEyedropper}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition active:scale-95 cursor-pointer shrink-0"
            title={isEn ? 'Pick Color from Screen (Eyedropper)' : 'Ekrandan Renk Çek (Damla Aracı)'}
          >
            <Pipette className="w-4 h-4" />
          </button>
        )}

        {/* Transparent (Renksiz / Saydam) Button */}
        {allowTransparent && (
          <button
            type="button"
            onClick={() => onChange('transparent')}
            className={`p-2.5 rounded-xl border transition active:scale-95 cursor-pointer shrink-0 ${
              isTransparent
                ? 'bg-red-50 text-red-600 border-red-300 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title={isEn ? 'Transparent (Remove background)' : 'Saydam (Arka planı kaldır)'}
          >
            <Ban className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Interactive Rainbow Hue Spectrum Bar */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span className="font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {isEn ? 'Live Color Spectrum' : 'Canlı Renk Tayfı'}
          </span>
          <span className="font-mono text-[9px] text-slate-400">{isEn ? 'Slide to Select' : 'Kaydırarak Seç'}</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={hueValue}
          onChange={(e) => {
            const h = parseInt(e.target.value, 10);
            setHueValue(h);
            onChange(hueToHex(h));
          }}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer border border-slate-200 shadow-2xs"
          style={{
            background:
              'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
        />
      </div>

      {/* Palettes Section */}
      <div className="pt-1 space-y-1.5">
        {/* Palette Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActivePaletteTab('modern')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                activePaletteTab === 'modern'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isEn ? 'Vibrant' : 'Canlı Renkler'}
            </button>
            <button
              type="button"
              onClick={() => setActivePaletteTab('neutrals')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                activePaletteTab === 'neutrals'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isEn ? 'Neutrals' : 'Nötr & Gri'}
            </button>
            <button
              type="button"
              onClick={() => setActivePaletteTab('pastels')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                activePaletteTab === 'pastels'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isEn ? 'Pastel' : 'Pastel'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <span>{showAdvanced ? (isEn ? 'Less' : 'Daha Az') : (isEn ? 'All' : 'Tümü')}</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Color Swatches Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 pt-0.5">
          {PALETTES[activePaletteTab].slice(0, showAdvanced ? undefined : 12).map((item) => {
            const isSelected = !isTransparent && currentHex.toLowerCase() === item.hex.toLowerCase();
            return (
              <button
                key={item.hex}
                type="button"
                onClick={() => onChange(item.hex)}
                style={{ backgroundColor: item.hex }}
                className={`h-6 rounded-lg border transition transform active:scale-90 flex items-center justify-center cursor-pointer shadow-2xs relative ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 ring-offset-1 scale-105 border-transparent'
                    : 'border-slate-300/80 hover:scale-110 hover:shadow-xs'
                }`}
                title={`${item.name} (${item.hex})`}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 stroke-3 ${
                      ['#ffffff', '#f1f5f9', '#fef08a', '#bbf7d0', '#fecaca', '#fed7aa'].includes(
                        item.hex.toLowerCase()
                      )
                        ? 'text-slate-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
