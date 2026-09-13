import React, { useState } from 'react';
import {
  FileCode,
  FileSpreadsheet,
  FileImage,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Search,
  Hash,
  Sparkles,
  Layers,
  Code2,
  FileText,
} from 'lucide-react';
import { ProjectFile, DomTreeNode } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface FileExplorerProps {
  files: ProjectFile[];
  activeHtmlPath: string;
  onSelectHtmlFile: (path: string) => void;
  onOpenFileCode: (file: ProjectFile) => void;
  domTree: DomTreeNode | null;
  selectedVweId: string | null;
  onSelectDomNode: (vweId: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeHtmlPath,
  onSelectHtmlFile,
  onOpenFileCode,
  domTree,
  selectedVweId,
  onSelectDomNode,
}) => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'files' | 'tree'>('files');
  const [treeSearch, setTreeSearch] = useState('');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'html':
        return <FileCode className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'css':
        return <FileSpreadsheet className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'js':
        return <Code2 className="w-4 h-4 text-yellow-400 shrink-0" />;
      case 'image':
        return <FileImage className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <aside className="w-full h-full bg-slate-900 border-r border-slate-800 flex flex-col select-none text-slate-300">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeTab === 'files'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.files} ({files.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeTab === 'tree'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t.domTree}</span>
        </button>
      </div>

      {/* Files List View */}
      {activeTab === 'files' && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{lang === 'us' ? 'Project Documents' : 'Proje Belgeleri'}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {files.filter((f) => f.type === 'html').length} HTML
            </span>
          </div>

          {files.map((file) => {
            const isCurrentHtml = file.path === activeHtmlPath;
            return (
              <div
                key={file.path}
                onClick={() => {
                  if (file.type === 'html') {
                    onSelectHtmlFile(file.path);
                  } else {
                    onOpenFileCode(file);
                  }
                }}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition ${
                  isCurrentHtml
                    ? 'bg-blue-600/15 border border-blue-500/30 text-white font-medium'
                    : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                }`}
                title={file.path}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  {getFileIcon(file.type)}
                  <span className="truncate">{file.path}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {isCurrentHtml && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
                      {lang === 'us' ? 'Active' : 'Aktif'}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DOM Tree View */}
      {activeTab === 'tree' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Search box for elements */}
          <div className="p-2 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                placeholder={lang === 'us' ? 'Search tag or class (e.g. h1, btn)...' : 'Tag veya sınıf ara (örn. h1, btn)...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {domTree ? (
              <DomTreeNodeItem
                node={domTree}
                depth={0}
                selectedVweId={selectedVweId}
                onSelect={onSelectDomNode}
                searchFilter={treeSearch.toLowerCase()}
              />
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                {lang === 'us' ? 'Loading DOM tree...' : 'Ağaç yapısı yükleniyor...'}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

interface DomTreeNodeItemProps {
  node: DomTreeNode;
  depth: number;
  selectedVweId: string | null;
  onSelect: (vweId: string) => void;
  searchFilter: string;
}

const DomTreeNodeItem: React.FC<DomTreeNodeItemProps> = ({
  node,
  depth,
  selectedVweId,
  onSelect,
  searchFilter,
}) => {
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedVweId === node.vweId;

  const matchesSearch = !searchFilter
    ? true
    : node.tagName.includes(searchFilter) ||
      node.classList.some((c) => c.toLowerCase().includes(searchFilter)) ||
      node.idAttr.toLowerCase().includes(searchFilter);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        onClick={() => onSelect(node.vweId)}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        className={`flex items-center gap-1.5 py-1 pr-2 rounded text-xs cursor-pointer group transition ${
          isSelected
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'hover:bg-slate-800 text-slate-300'
        } ${!matchesSearch ? 'opacity-40' : ''}`}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-0.5 hover:bg-slate-700/50 rounded cursor-pointer"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Tag Name Badge */}
        <span
          className={`font-mono text-[11px] font-bold uppercase ${
            isSelected ? 'text-white' : 'text-blue-400'
          }`}
        >
          &lt;{node.tagName}&gt;
        </span>

        {/* ID attribute */}
        {node.idAttr && (
          <span
            className={`font-mono text-[10px] ${
              isSelected ? 'text-amber-200' : 'text-amber-400'
            }`}
          >
            #{node.idAttr}
          </span>
        )}

        {/* Classes */}
        {node.classList.length > 0 && (
          <span
            className={`font-mono text-[10px] truncate max-w-[100px] ${
              isSelected ? 'text-indigo-200' : 'text-slate-400'
            }`}
          >
            .{node.classList.slice(0, 2).join('.')}
          </span>
        )}

        {/* Short text snippet */}
        {node.textPreview && (
          <span
            className={`truncate text-[10px] italic ml-1 ${
              isSelected ? 'text-blue-100' : 'text-slate-400'
            }`}
          >
            "{node.textPreview}"
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <DomTreeNodeItem
              key={child.vweId}
              node={child}
              depth={depth + 1}
              selectedVweId={selectedVweId}
              onSelect={onSelect}
              searchFilter={searchFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
};
