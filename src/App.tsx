import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadHero } from './components/UploadHero';
import { PreviewFrame } from './components/PreviewFrame';
import { VisualInspector } from './components/VisualInspector';
import { FloatingElementBar } from './components/FloatingElementBar';
import {
  ProjectFile,
  ParsedElementInfo,
  DeviceViewport,
  CssRuleItem,
} from './types';
import { parseUploadedFile, exportProjectAsZip, downloadBlob } from './utils/zipParser';
import {
  preparePreviewHtml,
  extractClassesAndRules,
  cleanHtmlForExport,
} from './utils/htmlParser';
import { SAMPLE_PROJECTS } from './utils/sampleProjects';
import { Sparkles, X, Check, Sliders, ArrowUp, ArrowDown, Copy, Trash2 } from 'lucide-react';

export default function App() {
  // State: whether we are on the initial upload screen or full-screen preview
  const [hasLoadedProject, setHasLoadedProject] = useState<boolean>(false);

  // Project files state
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeHtmlPath, setActiveHtmlPath] = useState<string>('index.html');
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // Selected element for visual editing
  const [selectedElement, setSelectedElement] = useState<ParsedElementInfo | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Viewport mode
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');

  // Parsed classes
  const [allClassNames, setAllClassNames] = useState<string[]>([]);
  const [cssRules, setCssRules] = useState<CssRuleItem[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(0);
  const filesRef = useRef<ProjectFile[]>(files);
  const lastEditTimeRef = useRef<number>(0);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Iframe ref for postMessage communication
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const activeHtmlFile =
    files.find((f) => f.path === activeHtmlPath && f.type === 'html') ||
    files.find((f) => f.type === 'html') ||
    files[0];

  // Refresh preview HTML
  const refreshPreview = useCallback(
    (currentFiles: ProjectFile[], targetHtmlPath: string, addToHistory = true) => {
      const htmlFile =
        currentFiles.find((f) => f.path === targetHtmlPath && f.type === 'html') ||
        currentFiles.find((f) => f.type === 'html');

      if (!htmlFile) return;

      const { allClassNames: extractedClasses, rules } = extractClassesAndRules(currentFiles);
      setAllClassNames(extractedClasses);
      setCssRules(rules);

      const processed = preparePreviewHtml(htmlFile.content, currentFiles);
      setPreviewHtml(processed);

      if (addToHistory) {
        const nextHist = [...historyRef.current.slice(0, historyIndexRef.current + 1), htmlFile.content];
        historyRef.current = nextHist;
        historyIndexRef.current = nextHist.length - 1;
        setHistory(nextHist);
        setHistoryIndex(nextHist.length - 1);
      }
    },
    []
  );

  // Handle uploaded file (single HTML or ZIP archive)
  const handleFileUpload = async (file: File) => {
    try {
      showToast(`${file.name} ayrıştırılıyor...`);
      const parsedFiles = await parseUploadedFile(file);

      if (parsedFiles.length === 0) {
        showToast('Dosya içinde geçerli HTML bulunamadı.');
        return;
      }

      setFiles(parsedFiles);
      filesRef.current = parsedFiles;

      const firstHtml = parsedFiles.find((f) => f.type === 'html') || parsedFiles[0];
      setActiveHtmlPath(firstHtml.path);
      setSelectedElement(null);
      setIsInspectorOpen(false);

      historyRef.current = [firstHtml.content];
      historyIndexRef.current = 0;
      setHistory([firstHtml.content]);
      setHistoryIndex(0);
      setIframeKey((k) => k + 1);

      refreshPreview(parsedFiles, firstHtml.path, false);
      setHasLoadedProject(true);
      showToast(`${file.name} yüklendi! Düzenlemek için herhangi bir öğeye tıklayın.`);
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast(`Hata: ${err.message || 'Dosya okunamadı'}`);
    }
  };

  // Load predefined sample
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PROJECTS.find((s) => s.id === sampleId);
    if (!sample) return;

    setFiles(sample.files);
    filesRef.current = sample.files;
    setActiveHtmlPath('index.html');
    setSelectedElement(null);
    setIsInspectorOpen(false);

    historyRef.current = [sample.files[0].content];
    historyIndexRef.current = 0;
    setHistory([sample.files[0].content]);
    setHistoryIndex(0);
    setIframeKey((k) => k + 1);

    refreshPreview(sample.files, 'index.html', false);
    setHasLoadedProject(true);
    showToast(`"${sample.name}" yüklendi!`);
  };

  // When iframe notifies document changed: group rapid edits (<450ms) into a single undoable step!
  const handleDocumentChange = useCallback(
    (newCleanHtml: string) => {
      const currentHist = historyRef.current;
      const currentIdx = historyIndexRef.current;

      if (currentHist[currentIdx] === newCleanHtml) {
        return;
      }

      // Update current files
      setFiles((prev) =>
        prev.map((f) =>
          f.path === activeHtmlPath ? { ...f, content: newCleanHtml, size: newCleanHtml.length } : f
        )
      );

      const now = Date.now();
      const isRapidContinuousEdit = now - lastEditTimeRef.current < 450;
      lastEditTimeRef.current = now;

      if (isRapidContinuousEdit && currentIdx > 0) {
        // Continuous action (dragging slider / rapid typing): update current step
        const updatedHist = [...currentHist];
        updatedHist[currentIdx] = newCleanHtml;
        historyRef.current = updatedHist;
        setHistory(updatedHist);
      } else {
        // Distinct new change: append a clean new history snapshot
        const sliced = currentHist.slice(0, currentIdx + 1);
        const updatedHist = [...sliced, newCleanHtml];
        historyRef.current = updatedHist;
        historyIndexRef.current = updatedHist.length - 1;
        setHistory(updatedHist);
        setHistoryIndex(updatedHist.length - 1);
      }
    },
    [activeHtmlPath]
  );

  // Undo / Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    const nextIdx = historyIndexRef.current - 1;
    const targetHtml = historyRef.current[nextIdx];
    if (!targetHtml) return;

    historyIndexRef.current = nextIdx;
    setHistoryIndex(nextIdx);

    const currentFiles = filesRef.current;
    const updatedFiles = currentFiles.map((f) =>
      f.path === activeHtmlPath ? { ...f, content: targetHtml, size: targetHtml.length } : f
    );
    setFiles(updatedFiles);
    filesRef.current = updatedFiles;

    // Force clean remount of the iframe with the previous snapshot
    setIframeKey((k) => k + 1);
    refreshPreview(updatedFiles, activeHtmlPath, false);

    setSelectedElement(null);
    setIsInspectorOpen(false);
    showToast(`Geri alındı (${nextIdx + 1}/${historyRef.current.length})`);
  }, [activeHtmlPath, refreshPreview]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const nextIdx = historyIndexRef.current + 1;
    const targetHtml = historyRef.current[nextIdx];
    if (!targetHtml) return;

    historyIndexRef.current = nextIdx;
    setHistoryIndex(nextIdx);

    const currentFiles = filesRef.current;
    const updatedFiles = currentFiles.map((f) =>
      f.path === activeHtmlPath ? { ...f, content: targetHtml, size: targetHtml.length } : f
    );
    setFiles(updatedFiles);
    filesRef.current = updatedFiles;

    // Force clean remount of the iframe with the next snapshot
    setIframeKey((k) => k + 1);
    refreshPreview(updatedFiles, activeHtmlPath, false);

    setSelectedElement(null);
    setIsInspectorOpen(false);
    showToast(`İleri alındı (${nextIdx + 1}/${historyRef.current.length})`);
  }, [activeHtmlPath, refreshPreview]);

  // Global Keyboard shortcuts for Undo (Ctrl+Z / Cmd+Z) & Redo (Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Export
  const handleExportZip = async () => {
    try {
      showToast('ZIP hazırlanıyor...');
      const blob = await exportProjectAsZip(files, 'duzenlenmis-web-sitesi.zip');
      downloadBlob(blob, 'duzenlenmis-web-sitesi.zip');
      showToast('ZIP başarıyla indirildi!');
    } catch (err: any) {
      console.error(err);
      showToast('İndirme hatası oluştu.');
    }
  };

  const handleExportHtml = () => {
    try {
      const htmlFile = activeHtmlFile;
      const cleanHtml = cleanHtmlForExport(htmlFile.content);
      const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, htmlFile.name || 'index.html');
      showToast(`${htmlFile.name} indirildi!`);
    } catch (err: any) {
      console.error(err);
      showToast('İndirme hatası oluştu.');
    }
  };

  // PostMessage helpers
  const sendIframeMessage = (msg: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(msg, '*');
    }
  };

  const handleUpdateStyle = (property: string, value: string) => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_UPDATE_STYLE',
      vweId: selectedElement.vweId,
      property,
      value,
    });
    setSelectedElement((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        computedStyle: {
          ...prev.computedStyle,
          [property]: value,
        },
      };
    });
  };

  const handleUpdateText = (text: string) => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_UPDATE_TEXT',
      vweId: selectedElement.vweId,
      text,
    });
  };

  const handleUpdateInnerHTML = (html: string) => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_UPDATE_INNER_HTML',
      vweId: selectedElement.vweId,
      html,
    });
  };

  const handleUpdateClasses = (classes: string) => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_UPDATE_CLASSES',
      vweId: selectedElement.vweId,
      classes,
    });
    setSelectedElement((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        classList: classes.split(/\s+/).filter(Boolean),
      };
    });
  };

  const handleUpdateAttribute = (name: string, value: string | null) => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_UPDATE_ATTRIBUTE',
      vweId: selectedElement.vweId,
      name,
      value,
    });
    setSelectedElement((prev) => {
      if (!prev) return null;
      const nextAttrs = { ...prev.attributes };
      if (value === null || value === '') {
        delete nextAttrs[name];
      } else {
        nextAttrs[name] = value;
      }
      return {
        ...prev,
        attributes: nextAttrs,
      };
    });
  };

  const handleExecuteScript = (code: string) => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_RUN_JAVASCRIPT_ON_ELEMENT',
      vweId: selectedElement.vweId,
      code,
    });
    showToast('JavaScript öğede çalıştırıldı');
  };

  const handleOpenFileInEditor = (filePath: string) => {
    const file = files.find(
      (f) => f.path === filePath || f.name === filePath || f.path.endsWith(filePath)
    );
    if (file) {
      setActiveHtmlPath(file.path);
      showToast(`${file.name} seçildi`);
    } else {
      showToast(`${filePath} açıldı`);
    }
  };

  const handleDeleteElement = () => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_DELETE_ELEMENT',
      vweId: selectedElement.vweId,
    });
    setSelectedElement(null);
    setIsInspectorOpen(false);
    showToast('Öğe silindi');
  };

  const handleDuplicateElement = () => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_DUPLICATE_ELEMENT',
      vweId: selectedElement.vweId,
    });
    showToast('Öğe kopyalandı ve çoğaltıldı');
  };

  const handleMoveElement = (direction: 'up' | 'down') => {
    if (!selectedElement) return;
    sendIframeMessage({
      type: 'VWE_MOVE_ELEMENT',
      vweId: selectedElement.vweId,
      direction,
    });
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans select-none relative">
      {/* If no project is loaded yet: Show the Clean White Centered Upload View */}
      {!hasLoadedProject ? (
        <UploadHero
          onFileUpload={handleFileUpload}
          onLoadSample={handleLoadSample}
        />
      ) : (
        /* Once a file is loaded: Full-Screen Visual Website Preview & On-Click Visual Inspector */
        <div className="w-full h-full flex flex-col overflow-hidden">
          {/* Sleek Light Header */}
          <Header
            files={files}
            viewport={viewport}
            setViewport={setViewport}
            onFileUpload={handleFileUpload}
            onLoadSample={handleLoadSample}
            onExportZip={handleExportZip}
            onExportHtml={handleExportHtml}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            activeHtmlName={activeHtmlFile?.name || 'index.html'}
            onResetToUpload={() => setHasLoadedProject(false)}
            historyIndex={historyIndex}
          />

          {/* Main Full-Screen Preview Area */}
          <div className="flex-1 w-full h-full flex overflow-hidden relative">
            {/* Live Visual Preview Frame taking the entire space */}
            <div className="flex-1 h-full w-full">
              <PreviewFrame
                htmlContent={previewHtml}
                viewport={viewport}
                selectedElement={selectedElement}
                onElementSelect={(el) => {
                  setSelectedElement(el);
                  // Don't auto-open full inspector immediately - user gets gentle floating toolbar first!
                }}
                onElementDeselect={() => {
                  setSelectedElement(null);
                  setIsInspectorOpen(false);
                }}
                onDocumentChange={handleDocumentChange}
                iframeRef={iframeRef}
                iframeKey={iframeKey}
                onReload={() => refreshPreview(files, activeHtmlPath, false)}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            </div>

            {/* Non-intrusive Sweet Floating Action Bar for Selected Element */}
            {selectedElement && (
              <FloatingElementBar
                element={selectedElement}
                onDuplicate={handleDuplicateElement}
                onDelete={handleDeleteElement}
                onMove={handleMoveElement}
                onOpenInspector={() => setIsInspectorOpen((prev) => !prev)}
                isInspectorOpen={isInspectorOpen}
                canUndo={canUndo}
                onUndo={handleUndo}
                onDeselect={() => {
                  setSelectedElement(null);
                  setIsInspectorOpen(false);
                  sendIframeMessage({ type: 'VWE_DESELECT' });
                }}
              />
            )}

            {/* Visual Inspector Drawer (Only opens when user clicks 'Stili Düzenle' on floating bar) */}
            {selectedElement && isInspectorOpen && (
              <>
                {/* Desktop: Right floating drawer */}
                <div className="hidden md:block w-84 lg:w-96 h-full shrink-0 z-30 shadow-2xl">
                  <VisualInspector
                    element={selectedElement}
                    onUpdateStyle={handleUpdateStyle}
                    onUpdateText={handleUpdateText}
                    onUpdateInnerHTML={handleUpdateInnerHTML}
                    onUpdateClasses={handleUpdateClasses}
                    onUpdateAttribute={handleUpdateAttribute}
                    onDeleteElement={handleDeleteElement}
                    onDuplicateElement={handleDuplicateElement}
                    onMoveElement={handleMoveElement}
                    onClose={() => setIsInspectorOpen(false)}
                    allClassNames={allClassNames}
                    files={files}
                    onExecuteScript={handleExecuteScript}
                    onOpenFileInEditor={handleOpenFileInEditor}
                  />
                </div>

                {/* Mobile: Bottom sliding drawer that cleanly fits the mobile screen while preview is visible above */}
                <div className="md:hidden fixed inset-x-0 bottom-0 h-[68vh] max-h-[70vh] z-50 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
                  <div
                    onClick={() => setIsInspectorOpen(false)}
                    className="py-2.5 flex justify-center items-center cursor-pointer border-b border-slate-100 bg-slate-50/70"
                    title="Paneli Kapat"
                  >
                    <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <VisualInspector
                      element={selectedElement}
                      onUpdateStyle={handleUpdateStyle}
                      onUpdateText={handleUpdateText}
                      onUpdateInnerHTML={handleUpdateInnerHTML}
                      onUpdateClasses={handleUpdateClasses}
                      onUpdateAttribute={handleUpdateAttribute}
                      onDeleteElement={handleDeleteElement}
                      onDuplicateElement={handleDuplicateElement}
                      onMoveElement={handleMoveElement}
                      onClose={() => setIsInspectorOpen(false)}
                      allClassNames={allClassNames}
                      files={files}
                      onExecuteScript={handleExecuteScript}
                      onOpenFileInEditor={handleOpenFileInEditor}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
