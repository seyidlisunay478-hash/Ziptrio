import JSZip from 'jszip';
import { ProjectFile, FileType } from '../types';

export function getFileType(filePath: string): { type: FileType; isBinary: boolean } {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';

  if (['html', 'htm'].includes(ext)) {
    return { type: 'html', isBinary: false };
  }
  if (['css'].includes(ext)) {
    return { type: 'css', isBinary: false };
  }
  if (['js', 'mjs', 'jsx', 'ts', 'tsx'].includes(ext)) {
    return { type: 'js', isBinary: false };
  }
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif'].includes(ext)) {
    return { type: 'image', isBinary: true };
  }
  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
    return { type: 'font', isBinary: true };
  }
  return { type: 'other', isBinary: false };
}

export async function parseUploadedFile(file: File): Promise<ProjectFile[]> {
  const fileName = file.name;
  const isZip = fileName.toLowerCase().endsWith('.zip');

  if (!isZip) {
    // Single HTML or text file
    const content = await file.text();
    const { type, isBinary } = getFileType(fileName);
    return [
      {
        name: fileName,
        path: fileName,
        content: content,
        isBinary: isBinary,
        type: type === 'other' ? 'html' : type,
        size: file.size,
      },
    ];
  }

  // Handle ZIP file
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const projectFiles: ProjectFile[] = [];

  const rawEntries = Object.entries(loadedZip.files);

  // Filter out system files, hidden Mac files, and directory entries
  const validEntries = rawEntries.filter(([relativePath, zipEntry]) => {
    const name = relativePath.split('/').pop() || '';
    return (
      !zipEntry.dir &&
      !relativePath.endsWith('/') &&
      !relativePath.includes('__MACOSX') &&
      !name.startsWith('._') &&
      name !== '.DS_Store' &&
      name !== 'Thumbs.db'
    );
  });

  // Detect if all files share a common root directory (e.g. "template-master/...")
  let commonPrefix = '';
  if (validEntries.length > 0) {
    const firstPath = validEntries[0][0];
    const slashIdx = firstPath.indexOf('/');
    if (slashIdx !== -1) {
      const candidate = firstPath.slice(0, slashIdx + 1);
      const allShare = validEntries.every(([p]) => p.startsWith(candidate));
      if (allShare) {
        commonPrefix = candidate;
      }
    }
  }

  for (const [rawPath, zipEntry] of validEntries) {
    // Strip common top-level folder if all files were nested inside it
    const relativePath = commonPrefix ? rawPath.slice(commonPrefix.length) : rawPath;
    if (!relativePath) continue;

    const { type, isBinary } = getFileType(relativePath);
    const fileNameOnly = relativePath.split('/').pop() || relativePath;

    if (isBinary) {
      const blob = await zipEntry.async('blob');
      const blobUrl = URL.createObjectURL(blob);
      const base64 = await zipEntry.async('base64');
      const mime = getMimeType(fileNameOnly);
      const dataUrl = `data:${mime};base64,${base64}`;

      projectFiles.push({
        name: fileNameOnly,
        path: relativePath,
        content: dataUrl, // used for src replacement and CSS url()
        isBinary: true,
        type: type,
        blobUrl: blobUrl,
        size: blob.size,
      });
    } else {
      const text = await zipEntry.async('text');
      projectFiles.push({
        name: fileNameOnly,
        path: relativePath,
        content: text,
        isBinary: false,
        type: type,
        size: text.length,
      });
    }
  }

  // Ensure there is at least one HTML file
  // Sort so index.html comes first, followed by other HTML files, then CSS, JS, etc.
  projectFiles.sort((a, b) => {
    const aPath = a.path.toLowerCase();
    const bPath = b.path.toLowerCase();
    if (aPath === 'index.html') return -1;
    if (bPath === 'index.html') return 1;
    if (aPath.endsWith('/index.html')) return -1;
    if (bPath.endsWith('/index.html')) return 1;
    if (a.type === 'html' && b.type !== 'html') return -1;
    if (b.type === 'html' && a.type !== 'html') return 1;
    return a.path.localeCompare(b.path);
  });

  return projectFiles;
}

export function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    case 'ico':
      return 'image/x-icon';
    case 'html':
    case 'htm':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

export async function exportProjectAsZip(files: ProjectFile[], zipFileName = 'edited-website.zip'): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    if (file.isBinary) {
      // Content is dataUrl e.g. "data:image/png;base64,..."
      if (file.content.startsWith('data:')) {
        const base64Data = file.content.split(',')[1];
        zip.file(file.path, base64Data, { base64: true });
      } else {
        zip.file(file.path, file.content);
      }
    } else {
      zip.file(file.path, file.content);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
