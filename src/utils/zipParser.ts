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

  const fileEntries = Object.entries(loadedZip.files);

  for (const [relativePath, zipEntry] of fileEntries) {
    // Skip directories and system files like __MACOSX or .DS_Store
    if (zipEntry.dir || relativePath.includes('__MACOSX') || relativePath.includes('.DS_Store')) {
      continue;
    }

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
        content: dataUrl, // used for src replacement
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
  // Sort so index.html comes first
  projectFiles.sort((a, b) => {
    if (a.path.toLowerCase() === 'index.html') return -1;
    if (b.path.toLowerCase() === 'index.html') return 1;
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
