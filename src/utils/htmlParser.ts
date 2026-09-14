import { ProjectFile, ParsedElementInfo, CssRuleItem, DomTreeNode } from '../types';

/**
 * Extracts all CSS classes and rules from project files (CSS files and HTML style tags)
 */
export function extractClassesAndRules(files: ProjectFile[]): {
  allClassNames: string[];
  rules: CssRuleItem[];
} {
  const classSet = new Set<string>();
  const rules: CssRuleItem[] = [];

  // Extract from CSS files
  for (const file of files) {
    if (file.type === 'css') {
      parseCssText(file.content, file.name, classSet, rules);
    } else if (file.type === 'html') {
      // Find style tags in HTML
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      let match;
      while ((match = styleRegex.exec(file.content)) !== null) {
        parseCssText(match[1], `${file.name} (inline)`, classSet, rules);
      }

      // Also extract classes directly used in HTML elements
      const classAttrRegex = /class\s*=\s*["']([^"']+)["']/gi;
      let classMatch;
      while ((classMatch = classAttrRegex.exec(file.content)) !== null) {
        const classes = classMatch[1].split(/\s+/).filter(Boolean);
        for (const cls of classes) {
          classSet.add(cls);
        }
      }
    }
  }

  return {
    allClassNames: Array.from(classSet).sort(),
    rules,
  };
}

function parseCssText(
  cssText: string,
  fileName: string,
  classSet: Set<string>,
  rulesList: CssRuleItem[]
) {
  // Remove comments
  const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // Extract classes with regex: .([a-zA-Z0-9_-]+)
  const classSelectorRegex = /\.([a-zA-Z0-9_-]+)/g;
  let classMatch;
  while ((classMatch = classSelectorRegex.exec(cleanCss)) !== null) {
    const cls = classMatch[1];
    // Ignore pure numeric or pseudo-classes
    if (!/^\d+$/.test(cls)) {
      classSet.add(cls);
    }
  }

  // Parse rules blocks: selector { declarations }
  const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match;
  while ((match = ruleRegex.exec(cleanCss)) !== null) {
    const selector = match[1].trim();
    if (selector.startsWith('@')) continue; // Skip media/keyframes for simplicity in rule list

    const declsStr = match[2].trim();
    const declarations: Record<string, string> = {};
    declsStr.split(';').forEach((propLine) => {
      const colonIdx = propLine.indexOf(':');
      if (colonIdx !== -1) {
        const prop = propLine.slice(0, colonIdx).trim();
        const val = propLine.slice(colonIdx + 1).trim();
        if (prop && val) {
          declarations[prop] = val;
        }
      }
    });

    if (Object.keys(declarations).length > 0) {
      rulesList.push({
        selector,
        declarations,
        file: fileName,
      });
    }
  }
}

/**
 * Normalizes relative path resolution against an HTML or CSS directory
 */
export function normalizeRelativePath(baseDir: string, relativePath: string): string {
  const clean = relativePath.split('#')[0].split('?')[0].trim();
  if (
    !clean ||
    clean.startsWith('data:') ||
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('//') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // If path starts with '/', treat as root of archive
  if (clean.startsWith('/')) {
    return clean.replace(/^\/+/, '');
  }

  const stack = baseDir.split('/').filter(Boolean);
  const parts = clean.split('/');

  for (const part of parts) {
    if (part === '.' || part === '') {
      continue;
    } else if (part === '..') {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }

  return stack.join('/');
}

/**
 * Searches for a file in the project matching a reference path
 */
export function findProjectFile(
  refPath: string,
  contextFilePath: string,
  files: ProjectFile[]
): ProjectFile | undefined {
  if (
    !refPath ||
    refPath.startsWith('data:') ||
    refPath.startsWith('http://') ||
    refPath.startsWith('https://') ||
    refPath.startsWith('//') ||
    refPath.startsWith('blob:') ||
    refPath.startsWith('mailto:') ||
    refPath.startsWith('tel:') ||
    refPath.startsWith('javascript:') ||
    refPath.startsWith('#')
  ) {
    return undefined;
  }

  const cleanRef = refPath.split('#')[0].split('?')[0].trim();
  const contextDir = contextFilePath.includes('/')
    ? contextFilePath.slice(0, contextFilePath.lastIndexOf('/'))
    : '';

  const normalized = normalizeRelativePath(contextDir, cleanRef).toLowerCase();
  const rawClean = cleanRef.replace(/^\.?\/+/, '').toLowerCase();
  const fileNameOnly = cleanRef.split('/').pop()?.toLowerCase() || '';

  // 1. Exact normalized path match
  let found = files.find((f) => f.path.toLowerCase() === normalized);
  if (found) return found;

  // 2. Clean raw path match
  found = files.find((f) => f.path.toLowerCase() === rawClean);
  if (found) return found;

  // 3. Suffix match (e.g. ref is "css/style.css", zip entry is "theme/css/style.css")
  found = files.find(
    (f) =>
      f.path.toLowerCase().endsWith('/' + rawClean) ||
      f.path.toLowerCase().endsWith('/' + normalized)
  );
  if (found) return found;

  // 4. Exact filename match as fallback
  found = files.find((f) => f.name.toLowerCase() === fileNameOnly);
  if (found) return found;

  return undefined;
}

/**
 * Resolves url(...) references inside CSS text with data URLs or blob URLs from project files
 */
export function resolveCssUrls(
  cssContent: string,
  cssFilePath: string,
  files: ProjectFile[]
): string {
  return cssContent.replace(
    /url\(\s*(['"]?)(.*?)\1\s*\)/gi,
    (fullMatch, _quote, rawUrl) => {
      const trimmed = (rawUrl || '').trim();
      if (
        !trimmed ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('//') ||
        trimmed.startsWith('blob:') ||
        trimmed.startsWith('#')
      ) {
        return fullMatch;
      }

      const asset = findProjectFile(trimmed, cssFilePath, files);
      if (asset && asset.content) {
        return `url("${asset.content}")`;
      }
      return fullMatch;
    }
  );
}

/**
 * Prepares the HTML to be loaded in the sandbox iframe:
 * - Inlines CSS files so styles render immediately and resolves CSS url()
 * - Replaces relative asset paths (images, fonts, scripts) with data URLs / blob URLs
 * - Handles internal navigation between HTML files in the zip
 * - Injects the Visual Web Editor (VWE) inspector client script
 */
export function preparePreviewHtml(
  htmlContent: string,
  files: ProjectFile[],
  currentHtmlPath = 'index.html'
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // 1. Resolve CSS links: replace <link rel="stylesheet" href="..."> with inline <style>
  const linkElements = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
  for (const link of linkElements) {
    const href = link.getAttribute('href');
    if (href) {
      const cssFile = findProjectFile(href, currentHtmlPath, files);
      if (cssFile) {
        const styleTag = doc.createElement('style');
        styleTag.setAttribute('data-vwe-inlined-from', href);
        styleTag.textContent = resolveCssUrls(cssFile.content, cssFile.path, files);
        link.parentNode?.replaceChild(styleTag, link);
      }
    }
  }

  // 2. Resolve url() inside existing inline <style> tags
  const existingStyles = Array.from(doc.querySelectorAll('style:not([data-vwe-inlined-from])'));
  for (const styleTag of existingStyles) {
    if (styleTag.textContent) {
      styleTag.textContent = resolveCssUrls(styleTag.textContent, currentHtmlPath, files);
    }
  }

  // 3. Resolve inline style="..." attributes containing url(...)
  const elementsWithStyle = Array.from(doc.querySelectorAll('[style*="url("]'));
  for (const el of elementsWithStyle) {
    const inlineStyle = el.getAttribute('style');
    if (inlineStyle) {
      el.setAttribute('style', resolveCssUrls(inlineStyle, currentHtmlPath, files));
    }
  }

  // 4. Resolve image and media sources: <img src="...">, <source src/srcset="...">, <video src="...">, <audio src="...">
  const mediaElements = Array.from(doc.querySelectorAll('img, source, image, video, audio'));
  for (const el of mediaElements) {
    const src = el.getAttribute('src') || el.getAttribute('xlink:href');
    if (src && !src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
      const assetFile = findProjectFile(src, currentHtmlPath, files);
      if (assetFile) {
        if (el.tagName.toLowerCase() === 'image') {
          el.setAttribute('href', assetFile.content);
        } else {
          el.setAttribute('src', assetFile.content);
        }
        el.setAttribute('data-vwe-original-src', src);
      }
    }

    // Handle poster for video
    const poster = el.getAttribute('poster');
    if (poster && !poster.startsWith('data:') && !poster.startsWith('http://') && !poster.startsWith('https://')) {
      const posterFile = findProjectFile(poster, currentHtmlPath, files);
      if (posterFile) {
        el.setAttribute('poster', posterFile.content);
      }
    }
  }

  // 5. Resolve icons / favicons in <head>
  const iconLinks = Array.from(doc.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'));
  for (const iconLink of iconLinks) {
    const href = iconLink.getAttribute('href');
    if (href && !href.startsWith('data:') && !href.startsWith('http://') && !href.startsWith('https://')) {
      const iconFile = findProjectFile(href, currentHtmlPath, files);
      if (iconFile) {
        iconLink.setAttribute('href', iconFile.content);
      }
    }
  }

  // 6. Resolve scripts: <script src="...">
  const scriptElements = Array.from(doc.querySelectorAll('script[src]'));
  for (const s of scriptElements) {
    const src = s.getAttribute('src');
    if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
      const jsFile = findProjectFile(src, currentHtmlPath, files);
      if (jsFile) {
        s.removeAttribute('src');
        s.setAttribute('data-vwe-inlined-script', src);
        s.textContent = `
try {
${jsFile.content}
} catch (e) {
  console.warn('Script [${src}] error:', e);
}
`;
      }
    }
  }

  // 7. Assign unique data-vwe-id to every body element for direct referencing
  let counter = 1;
  const walk = (node: Element) => {
    node.setAttribute('data-vwe-id', `vwe-${counter++}`);
    for (const child of Array.from(node.children)) {
      walk(child);
    }
  };
  if (doc.body) {
    walk(doc.body);
  }

  // 5. Injected inspector script
  const inspectorScript = `
<style id="vwe-inspector-styles">
  /* Smooth scrolling and touch support for preview website */
  html {
    scroll-behavior: smooth !important;
    height: auto !important;
    min-height: 100% !important;
  }
  body {
    min-height: 100vh !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  /* Cute modern scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.6);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.5);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.8);
  }

  /* Inspector highlight box & tooltip */
  #vwe-hover-box {
    position: fixed;
    pointer-events: none;
    border: 2px dashed #6366f1;
    background-color: rgba(99, 102, 241, 0.08);
    z-index: 999999;
    display: none;
    transition: all 0.05s ease-out;
    border-radius: 6px;
  }
  #vwe-hover-tag {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 0;
    background: #6366f1;
    color: #ffffff;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);
  }
  #vwe-selected-box {
    position: fixed;
    pointer-events: none;
    border: 2px solid #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2), 0 8px 16px -2px rgba(79, 70, 229, 0.15);
    background-color: rgba(79, 70, 229, 0.04);
    z-index: 999998;
    display: none;
    border-radius: 8px;
    transition: all 0.05s ease-out;
  }
  #vwe-selected-tag {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 0;
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    color: #ffffff;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 9999px;
    white-space: nowrap;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.35);
  }
  .vwe-prevent-pointer {
    cursor: default !important;
  }
</style>

<div id="vwe-hover-box"><span id="vwe-hover-tag"></span></div>
<div id="vwe-selected-box"><span id="vwe-selected-tag"></span></div>

<script id="vwe-inspector-script">
(function() {
  var selectedEl = null;
  var hoverEl = null;
  var isInspectorActive = true;

  var hoverBox = document.getElementById('vwe-hover-box');
  var hoverTag = document.getElementById('vwe-hover-tag');
  var selectedBox = document.getElementById('vwe-selected-box');
  var selectedTag = document.getElementById('vwe-selected-tag');

  function updateHoverBox(el) {
    if (!el || el === document.body || el === document.documentElement || el.id && el.id.startsWith('vwe-')) {
      hoverBox.style.display = 'none';
      return;
    }
    var rect = el.getBoundingClientRect();
    hoverBox.style.top = rect.top + 'px';
    hoverBox.style.left = rect.left + 'px';
    hoverBox.style.width = rect.width + 'px';
    hoverBox.style.height = rect.height + 'px';
    hoverBox.style.display = 'block';

    var tagText = el.tagName.toLowerCase();
    if (el.id) tagText += '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      var firstClass = el.className.split(' ').filter(Boolean)[0];
      if (firstClass) tagText += '.' + firstClass;
    }
    hoverTag.textContent = tagText;
  }

  function updateSelectedBox(el) {
    if (!el || el === document.body || el === document.documentElement) {
      selectedBox.style.display = 'none';
      return;
    }
    var rect = el.getBoundingClientRect();
    selectedBox.style.top = rect.top + 'px';
    selectedBox.style.left = rect.left + 'px';
    selectedBox.style.width = rect.width + 'px';
    selectedBox.style.height = rect.height + 'px';
    selectedBox.style.display = 'block';

    var tagText = el.tagName.toLowerCase();
    if (el.id) tagText += '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      var classes = el.className.split(' ').filter(Boolean).slice(0, 2).join('.');
      if (classes) tagText += '.' + classes;
    }
    selectedTag.textContent = tagText;
  }

  function serializeElement(el) {
    var vweId = el.getAttribute('data-vwe-id') || '';
    var cs = window.getComputedStyle(el);

    // Breadcrumb path
    var path = [];
    var curr = el;
    while (curr && curr !== document.documentElement && curr !== document) {
      if (!curr.id || !curr.id.startsWith('vwe-')) {
        path.unshift({
          vweId: curr.getAttribute('data-vwe-id') || '',
          tag: curr.tagName.toLowerCase(),
          classes: (typeof curr.className === 'string' ? curr.className : '').trim(),
          id: curr.id || ''
        });
      }
      curr = curr.parentElement;
    }

    // Attributes
    var attrs = {};
    var jsEvents = {};
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (!attr.name.startsWith('data-vwe-')) {
        attrs[attr.name] = attr.value;
        var lowerName = attr.name.toLowerCase();
        if (lowerName.startsWith('on') || lowerName.startsWith('data-action') || lowerName.startsWith('data-click')) {
          jsEvents[lowerName] = attr.value;
        }
      }
    }

    // Inline style
    var inline = {};
    for (var j = 0; j < el.style.length; j++) {
      var propName = el.style[j];
      inline[propName] = el.style.getPropertyValue(propName);
    }

    var rect = el.getBoundingClientRect();

    return {
      vweId: vweId,
      tagName: el.tagName,
      idAttr: el.id || '',
      classList: Array.from(el.classList || []),
      attributes: attrs,
      jsEvents: jsEvents,
      textContent: el.textContent ? el.textContent.trim() : '',
      innerHTML: el.innerHTML || '',
      outerHTML: el.outerHTML || '',
      computedStyle: {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        textAlign: cs.textAlign,
        lineHeight: cs.lineHeight,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
        marginTop: cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        marginLeft: cs.marginLeft,
        width: cs.width,
        height: cs.height,
        display: cs.display,
        flexDirection: cs.flexDirection,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems,
        gap: cs.gap,
        borderRadius: cs.borderRadius,
        borderWidth: cs.borderWidth,
        borderStyle: cs.borderStyle,
        borderColor: cs.borderColor,
        boxShadow: cs.boxShadow,
        opacity: cs.opacity
      },
      inlineStyle: inline,
      path: path,
      rect: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      }
    };
  }

  // Mousemove handler for hover highlight
  document.addEventListener('mousemove', function(e) {
    if (!isInspectorActive) return;
    var target = e.target;
    if (target && target.closest && !target.closest('#vwe-hover-box') && !target.closest('#vwe-selected-box')) {
      if (target !== hoverEl) {
        hoverEl = target;
        updateHoverBox(hoverEl);
      }
    }
  }, true);

  // Mouseout
  document.addEventListener('mouseout', function(e) {
    if (e.relatedTarget === null) {
      hoverBox.style.display = 'none';
      hoverEl = null;
    }
  }, true);

  // Click handler to select element or navigate in live mode
  document.addEventListener('click', function(e) {
    if (!isInspectorActive) {
      // In Live Mode: Intercept internal navigation links (e.g. href="about.html")
      var link = e.target && e.target.closest ? e.target.closest('a') : null;
      if (link) {
        var href = link.getAttribute('href');
        if (
          href &&
          !href.startsWith('#') &&
          !href.startsWith('http://') &&
          !href.startsWith('https://') &&
          !href.startsWith('//') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          !href.startsWith('javascript:')
        ) {
          e.preventDefault();
          e.stopPropagation();
          window.parent.postMessage({ type: 'VWE_NAVIGATE_PAGE', href: href }, '*');
          return;
        }
      }
      return;
    }

    var target = e.target;
    if (target && target.id && target.id.startsWith('vwe-')) return;

    e.preventDefault();
    e.stopPropagation();

    selectedEl = target;
    updateSelectedBox(selectedEl);
    hoverBox.style.display = 'none';

    var data = serializeElement(selectedEl);
    window.parent.postMessage({ type: 'VWE_ELEMENT_SELECTED', data: data }, '*');
  }, true);

  // Scroll / resize: update position
  window.addEventListener('scroll', function() {
    if (selectedEl) updateSelectedBox(selectedEl);
    if (hoverEl) updateHoverBox(hoverEl);
  }, true);
  window.addEventListener('resize', function() {
    if (selectedEl) updateSelectedBox(selectedEl);
    if (hoverEl) updateHoverBox(hoverEl);
  }, true);

  // Message listener from parent
  window.addEventListener('message', function(event) {
    var msg = event.data;
    if (!msg || typeof msg !== 'object') return;

    function getTarget() {
      if (msg.vweId) {
        return document.querySelector('[data-vwe-id="' + msg.vweId + '"]');
      }
      return selectedEl;
    }

    switch (msg.type) {
      case 'VWE_SELECT_BY_ID': {
        var el = document.querySelector('[data-vwe-id="' + msg.vweId + '"]');
        if (el) {
          selectedEl = el;
          updateSelectedBox(selectedEl);
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          var data = serializeElement(selectedEl);
          window.parent.postMessage({ type: 'VWE_ELEMENT_SELECTED', data: data }, '*');
        }
        break;
      }
      case 'VWE_UPDATE_STYLE': {
        var target = getTarget();
        if (target) {
          target.style[msg.property] = msg.value;
          updateSelectedBox(target);
          notifyDocumentChanged();
        }
        break;
      }
      case 'VWE_UPDATE_TEXT': {
        var target = getTarget();
        if (target) {
          target.textContent = msg.text;
          updateSelectedBox(target);
          notifyDocumentChanged();
        }
        break;
      }
      case 'VWE_UPDATE_INNER_HTML': {
        var target = getTarget();
        if (target) {
          target.innerHTML = msg.html;
          // Re-stamp IDs for any new children
          var count = 1000 + Math.floor(Math.random() * 5000);
          target.querySelectorAll('*').forEach(function(child) {
            if (!child.hasAttribute('data-vwe-id')) {
              child.setAttribute('data-vwe-id', 'vwe-' + (count++));
            }
          });
          updateSelectedBox(target);
          notifyDocumentChanged();
        }
        break;
      }
      case 'VWE_UPDATE_CLASSES': {
        var target = getTarget();
        if (target) {
          target.className = msg.classes;
          updateSelectedBox(target);
          notifyDocumentChanged();
        }
        break;
      }
      case 'VWE_UPDATE_ATTRIBUTE': {
        var target = getTarget();
        if (target) {
          if (msg.value === null || msg.value === '') {
            target.removeAttribute(msg.name);
          } else {
            target.setAttribute(msg.name, msg.value);
          }
          updateSelectedBox(target);
          notifyDocumentChanged();
        }
        break;
      }
      case 'VWE_DELETE_ELEMENT': {
        var target = getTarget();
        if (target && target.parentNode && target !== document.body) {
          var parent = target.parentNode;
          parent.removeChild(target);
          selectedBox.style.display = 'none';
          hoverBox.style.display = 'none';
          selectedEl = null;
          notifyDocumentChanged();
          window.parent.postMessage({ type: 'VWE_ELEMENT_DESELECTED' }, '*');
        }
        break;
      }
      case 'VWE_DUPLICATE_ELEMENT': {
        var target = getTarget();
        if (target && target.parentNode && target !== document.body) {
          var clone = target.cloneNode(true);
          var newId = 'vwe-' + Math.floor(Math.random() * 100000);
          clone.setAttribute('data-vwe-id', newId);
          clone.querySelectorAll('*').forEach(function(c) {
            c.setAttribute('data-vwe-id', 'vwe-' + Math.floor(Math.random() * 100000));
          });
          target.parentNode.insertBefore(clone, target.nextSibling);
          selectedEl = clone;
          updateSelectedBox(selectedEl);
          notifyDocumentChanged();
          var data = serializeElement(selectedEl);
          window.parent.postMessage({ type: 'VWE_ELEMENT_SELECTED', data: data }, '*');
        }
        break;
      }
      case 'VWE_MOVE_ELEMENT': {
        var target = getTarget();
        if (target && target.parentNode && target !== document.body) {
          var parent = target.parentNode;
          if (msg.direction === 'up') {
            var prev = target.previousElementSibling;
            if (prev) parent.insertBefore(target, prev);
          } else if (msg.direction === 'down') {
            var next = target.nextElementSibling;
            if (next) parent.insertBefore(next, target);
          }
          updateSelectedBox(target);
          notifyDocumentChanged();
        }
        break;
      }
      case 'VWE_INSERT_CHILD': {
        var target = getTarget() || document.body;
        var newEl = document.createElement(msg.tag || 'div');
        newEl.setAttribute('data-vwe-id', 'vwe-' + Math.floor(Math.random() * 100000));
        if (msg.className) newEl.className = msg.className;
        if (msg.text) newEl.textContent = msg.text;
        if (msg.tag === 'img') {
          newEl.setAttribute('src', msg.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop');
          newEl.setAttribute('alt', 'Image');
        }
        target.appendChild(newEl);
        selectedEl = newEl;
        updateSelectedBox(selectedEl);
        notifyDocumentChanged();
        var data = serializeElement(selectedEl);
        window.parent.postMessage({ type: 'VWE_ELEMENT_SELECTED', data: data }, '*');
        break;
      }
      case 'VWE_SET_INSPECTOR_ACTIVE': {
        isInspectorActive = !!msg.active;
        if (!isInspectorActive) {
          hoverBox.style.display = 'none';
          selectedBox.style.display = 'none';
        }
        break;
      }
      case 'VWE_SCROLL_PAGE': {
        if (msg.direction === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (msg.direction === 'bottom') {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        } else if (msg.direction === 'down') {
          window.scrollBy({ top: 450, behavior: 'smooth' });
        } else if (msg.direction === 'up') {
          window.scrollBy({ top: -450, behavior: 'smooth' });
        }
        break;
      }
      case 'VWE_EXECUTE_SCRIPT':
      case 'VWE_RUN_JAVASCRIPT_ON_ELEMENT': {
        var target = getTarget();
        if (target) {
          try {
            var fn = new Function('element', msg.code);
            var result = fn.call(target, target);
            updateSelectedBox(target);
            notifyDocumentChanged();
            var data = serializeElement(target);
            window.parent.postMessage({
              type: 'VWE_SCRIPT_RESULT',
              success: true,
              result: typeof result !== 'undefined' ? String(result) : 'OK',
              elementData: data
            }, '*');
          } catch (err) {
            window.parent.postMessage({
              type: 'VWE_SCRIPT_RESULT',
              success: false,
              error: err && err.message ? err.message : String(err)
            }, '*');
          }
        }
        break;
      }
      case 'VWE_DESELECT': {
        selectedEl = null;
        if (selectedBox) selectedBox.style.display = 'none';
        if (hoverBox) hoverBox.style.display = 'none';
        break;
      }
    }
  });

  function notifyDocumentChanged() {
    // Collect cleaned HTML
    var clone = document.documentElement.cloneNode(true);
    // Remove inspector elements
    var hoverB = clone.querySelector('#vwe-hover-box');
    if (hoverB) hoverB.remove();
    var selB = clone.querySelector('#vwe-selected-box');
    if (selB) selB.remove();
    var insStyle = clone.querySelector('#vwe-inspector-styles');
    if (insStyle) insStyle.remove();
    var insScript = clone.querySelector('#vwe-inspector-script');
    if (insScript) insScript.remove();

    // Restore inlined CSS links back to <link rel="stylesheet" href="...">
    var inlinedStyles = clone.querySelectorAll('style[data-vwe-inlined-from]');
    for (var sIdx = 0; sIdx < inlinedStyles.length; sIdx++) {
      var sNode = inlinedStyles[sIdx];
      var origHref = sNode.getAttribute('data-vwe-inlined-from');
      var linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'stylesheet');
      linkTag.setAttribute('href', origHref);
      if (sNode.parentNode) {
        sNode.parentNode.replaceChild(linkTag, sNode);
      }
    }

    // Restore inlined scripts back to <script src="...">
    var inlinedScripts = clone.querySelectorAll('script[data-vwe-inlined-script]');
    for (var scIdx = 0; scIdx < inlinedScripts.length; scIdx++) {
      var scNode = inlinedScripts[scIdx];
      var origSrc = scNode.getAttribute('data-vwe-inlined-script');
      var scriptTag = document.createElement('script');
      scriptTag.setAttribute('src', origSrc);
      if (scNode.parentNode) {
        scNode.parentNode.replaceChild(scriptTag, scNode);
      }
    }

    // Remove data-vwe-id attributes and restore original src
    var all = clone.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      all[i].removeAttribute('data-vwe-id');
      // Restore original src if exists
      if (all[i].hasAttribute('data-vwe-original-src')) {
        all[i].setAttribute('src', all[i].getAttribute('data-vwe-original-src'));
        all[i].removeAttribute('data-vwe-original-src');
      }
    }

    var cleanHtml = '<!DOCTYPE html>\\n' + clone.outerHTML;
    window.parent.postMessage({ type: 'VWE_DOCUMENT_CHANGED', cleanHtml: cleanHtml }, '*');
  }

  // Keyboard shortcut listener inside iframe: forwards Undo/Redo & Escape to parent window
  window.addEventListener('keydown', function(e) {
    var tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
      return;
    }
    if (e.key === 'Escape') {
      selectedEl = null;
      if (selectedBox) selectedBox.style.display = 'none';
      if (hoverBox) hoverBox.style.display = 'none';
      window.parent.postMessage({ type: 'VWE_ELEMENT_DESELECTED' }, '*');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        window.parent.postMessage({ type: 'VWE_KEY_SHORTCUT', action: 'redo' }, '*');
      } else {
        window.parent.postMessage({ type: 'VWE_KEY_SHORTCUT', action: 'undo' }, '*');
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      window.parent.postMessage({ type: 'VWE_KEY_SHORTCUT', action: 'redo' }, '*');
    }
  }, true);

  // Initial ready ping
  window.parent.postMessage({ type: 'VWE_IFRAME_READY' }, '*');
})();
</script>
`;

  // Insert inspector elements right before </body>
  const bodyContent = doc.body.innerHTML;
  doc.body.innerHTML = bodyContent + inspectorScript;

  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

/**
 * Builds a hierarchical DOM tree structure from an HTML string for the file tree / document navigator
 */
export function buildDomTree(htmlContent: string): DomTreeNode | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    if (!doc.body) return null;

    let counter = 1;

    function buildNode(el: Element): DomTreeNode {
      const vweId = el.getAttribute('data-vwe-id') || `tree-${counter++}`;
      const textPreview = el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE
        ? (el.textContent?.trim().slice(0, 30) || '')
        : '';

      const children: DomTreeNode[] = [];
      for (const child of Array.from(el.children)) {
        if (!child.id?.startsWith('vwe-') && !child.classList.contains('vwe-ignore')) {
          children.push(buildNode(child));
        }
      }

      return {
        vweId,
        tagName: el.tagName.toLowerCase(),
        idAttr: el.id || '',
        classList: Array.from(el.classList || []),
        textPreview,
        children,
      };
    }

    return buildNode(doc.body);
  } catch {
    return null;
  }
}

/**
 * Clean up HTML for final export or code editor
 */
export function cleanHtmlForExport(rawHtml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Remove inspector boxes, styles, scripts
    doc.querySelector('#vwe-hover-box')?.remove();
    doc.querySelector('#vwe-selected-box')?.remove();
    doc.querySelector('#vwe-inspector-styles')?.remove();
    doc.querySelector('#vwe-inspector-script')?.remove();

    // Remove data-vwe-* attributes
    const elements = Array.from(doc.querySelectorAll('*'));
    for (const el of elements) {
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];
        if (attr.name.startsWith('data-vwe-')) {
          if (attr.name === 'data-vwe-original-src') {
            el.setAttribute('src', attr.value);
          }
          el.removeAttribute(attr.name);
        }
      }
    }

    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  } catch {
    return rawHtml;
  }
}
