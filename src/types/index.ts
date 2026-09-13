export type FileType = 'html' | 'css' | 'js' | 'image' | 'font' | 'other';

export interface ProjectFile {
  name: string;
  path: string; // relative path e.g. "index.html", "css/style.css"
  content: string; // text content for code or base64/dataUrl for binary
  isBinary: boolean;
  type: FileType;
  blobUrl?: string;
  size: number;
}

export interface ParsedElementInfo {
  vweId: string;
  tagName: string;
  idAttr: string;
  classList: string[];
  attributes: Record<string, string>;
  textContent: string;
  innerHTML: string;
  outerHTML: string;
  computedStyle: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    textAlign: string;
    lineHeight: string;
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    width: string;
    height: string;
    display: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    borderRadius: string;
    borderWidth: string;
    borderStyle: string;
    borderColor: string;
    boxShadow: string;
    opacity: string;
  };
  inlineStyle: Record<string, string>;
  path: {
    vweId: string;
    tag: string;
    classes: string;
    id: string;
  }[];
  rect?: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export interface DomTreeNode {
  vweId: string;
  tagName: string;
  idAttr: string;
  classList: string[];
  textPreview: string;
  children: DomTreeNode[];
}

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export type Language = 'tr' | 'us';

export interface CssRuleItem {
  selector: string;
  declarations: Record<string, string>;
  file: string;
}

export type ActiveMobileTab = 'preview' | 'inspector' | 'files' | 'code' | 'classes';
