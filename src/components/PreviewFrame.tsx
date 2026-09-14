import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Eye,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import { DeviceViewport, ParsedElementInfo } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface PreviewFrameProps {
  htmlContent: string;
  viewport: DeviceViewport;
  selectedElement: ParsedElementInfo | null;
  onElementSelect: (el: ParsedElementInfo) => void;
  onElementDeselect: () => void;
  onDocumentChange: (newCleanHtml: string) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onReload: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNavigatePage?: (href: string) => void;
  iframeKey?: number;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  htmlContent,
  viewport,
  selectedElement,
  onElementSelect,
  onElementDeselect,
  onDocumentChange,
  iframeRef,
  onReload,
  onUndo,
  onRedo,
  onNavigatePage,
  iframeKey = 1,
}) => {
  const { t, lang } = useLanguage();
  const [zoom, setZoom] = useState<number>(100);
  const [isLiveClickable, setIsLiveClickable] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'VWE_ELEMENT_SELECTED') {
        onElementSelect(event.data.data);
      } else if (event.data.type === 'VWE_ELEMENT_DESELECTED') {
        onElementDeselect();
      } else if (event.data.type === 'VWE_DOCUMENT_CHANGED') {
        onDocumentChange(event.data.cleanHtml);
      } else if (event.data.type === 'VWE_NAVIGATE_PAGE') {
        if (onNavigatePage) {
          onNavigatePage(event.data.href);
        }
      } else if (event.data.type === 'VWE_KEY_SHORTCUT') {
        if (event.data.action === 'undo' && onUndo) {
          onUndo();
        } else if (event.data.action === 'redo' && onRedo) {
          onRedo();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect, onElementDeselect, onDocumentChange, onUndo, onRedo, onNavigatePage]);

  const toggleLiveClickable = () => {
    const nextState = !isLiveClickable;
    setIsLiveClickable(nextState);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'VWE_SET_INSPECTOR_ACTIVE',
          active: !nextState,
        },
        '*'
      );
    }
  };

  const handleScrollPage = (direction: 'top' | 'bottom' | 'up' | 'down') => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'VWE_SCROLL_PAGE',
          direction,
        },
        '*'
      );
    }
  };

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return {
          width: '390px',
          height: '780px',
          label: `390 × 844 px (${t.mobile})`,
          icon: <Smartphone className="w-3.5 h-3.5" />,
        };
      case 'tablet':
        return {
          width: '768px',
          height: '880px',
          label: `768 × 1024 px (${t.tablet})`,
          icon: <Tablet className="w-3.5 h-3.5" />,
        };
      default:
        return {
          width: '100%',
          height: '100%',
          label: `100% (${t.desktop})`,
          icon: <Monitor className="w-3.5 h-3.5" />,
        };
    }
  };

  const { width: viewportWidth, height: viewportHeight, label: viewportLabel } = getViewportDimensions();

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-100 overflow-hidden relative select-none">
      {/* Top Preview Control Strip */}
      <div className="h-11 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between text-xs text-slate-600 shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Inspector vs Live Mode Toggle */}
          <button
            onClick={toggleLiveClickable}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition font-semibold text-xs cursor-pointer shadow-xs active:scale-95 ${
              !isLiveClickable
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
            title={
              !isLiveClickable
                ? t.interactiveModeOff
                : t.interactiveModeOn
            }
          >
            {!isLiveClickable ? (
              <>
                <MousePointer2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">{lang === 'us' ? 'Visual Inspector Active' : 'Öğe Düzenleyici Açık'}</span>
                <span className="sm:hidden">{t.editBadge}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{lang === 'us' ? 'Live Interactive Mode' : 'Canlı Mod'}</span>
                <span className="sm:hidden">{t.interactiveBadge}</span>
              </>
            )}
          </button>

          {/* Quick Scroll Actions in Top Bar */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              onClick={() => handleScrollPage('top')}
              className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition flex items-center gap-1 cursor-pointer"
              title={lang === 'us' ? 'Scroll to Top' : 'Sayfa Başına Kaydır'}
            >
              <ArrowUp className="w-3 h-3 text-indigo-600" />
              <span>{lang === 'us' ? 'Top' : 'Başa'}</span>
            </button>
            <button
              onClick={() => handleScrollPage('down')}
              className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition flex items-center gap-1 cursor-pointer"
              title={lang === 'us' ? 'Scroll Down' : 'Aşağıya Kaydır'}
            >
              <ArrowDown className="w-3 h-3 text-indigo-600" />
              <span>{lang === 'us' ? 'Down' : 'Aşağı'}</span>
            </button>
          </div>

          {/* Current selected tag notification */}
          {selectedElement ? (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 bg-indigo-50/70 px-2.5 py-1 rounded-xl border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-slate-500 font-medium">{lang === 'us' ? 'Selected:' : 'Seçili:'}</span>
              <strong className="text-indigo-950 font-mono">
                &lt;{selectedElement.tagName.toLowerCase()}&gt;
              </strong>
              {selectedElement.classList[0] && (
                <span className="text-indigo-600 font-mono text-[11px]">
                  .{selectedElement.classList[0]}
                </span>
              )}
            </div>
          ) : (
            <span className="hidden xl:inline-flex text-[11px] text-slate-400 items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {t.clickInstruction}
            </span>
          )}
        </div>

        {/* Right: Dimensions, Zoom, Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden lg:inline">
            {viewportLabel}
          </span>

          {/* Zoom controls */}
          <div className="hidden xs:flex items-center bg-slate-100 rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
              title={t.zoomOut}
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="px-1.5 text-[11px] font-mono font-medium text-slate-700">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 25))}
              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
              title={t.zoomIn}
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Reload button */}
          <button
            onClick={onReload}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title={t.reloadPreview}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Canvas Area */}
      <div
        className="flex-1 w-full h-full overflow-y-auto overflow-x-auto bg-slate-100/90 flex justify-center items-start p-0 sm:p-4 relative"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.22) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className={`flex flex-col transition-all duration-300 ease-out origin-top ${
            viewport === 'desktop'
              ? 'w-full h-full rounded-none border-0 bg-white shadow-xs'
              : 'rounded-[32px] sm:rounded-[36px] shadow-2xl border-4 sm:border-[8px] border-slate-900 bg-white overflow-hidden my-auto shrink-0'
          }`}
          style={{
            width: viewport === 'desktop' ? '100%' : viewportWidth,
            height: viewport === 'desktop' ? '100%' : viewportHeight,
            maxHeight: viewport !== 'desktop' ? 'calc(100% - 24px)' : undefined,
            maxWidth: '100%',
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
          }}
        >
          {/* Mock device notch for mobile / tablet */}
          {viewport !== 'desktop' && (
            <div className="h-6 bg-slate-900 flex items-center justify-center shrink-0">
              <div className="w-20 h-1 bg-slate-700 rounded-full"></div>
            </div>
          )}

          {/* The Website Iframe with full scroll capability */}
          <iframe
            key={iframeKey}
            ref={iframeRef as any}
            srcDoc={htmlContent}
            title={t.appName}
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
            scrolling="yes"
            className="w-full h-full border-none bg-white flex-1 overflow-auto"
          />
        </div>

        {/* Floating Quick Scroll Controls in preview bottom right */}
        <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-1.5 shadow-lg rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-1">
          <button
            onClick={() => handleScrollPage('up')}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition active:scale-95 cursor-pointer"
            title={lang === 'us' ? 'Scroll Up' : 'Yukarı Kaydır'}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScrollPage('down')}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition active:scale-95 cursor-pointer"
            title={lang === 'us' ? 'Scroll Down' : 'Aşağı Kaydır'}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
