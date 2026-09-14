import { Language } from '../types';

export interface Translations {
  // General
  appName: string;
  visualBadge: string;
  preview: string;
  loading: string;

  // Header
  homeTooltip: string;
  undo: string;
  redo: string;
  undoTooltip: string;
  redoTooltip: string;
  newFile: string;
  newFileTooltip: string;
  samples: string;
  samplesTooltip: string;
  samplesHeader: string;
  desktop: string;
  desktopTooltip: string;
  tablet: string;
  tabletTooltip: string;
  mobile: string;
  mobileTooltip: string;
  download: string;
  downloadMenuTitle: string;
  downloadZip: string;
  downloadZipDesc: string;
  downloadHtml: string;
  downloadHtmlDesc: string;
  uploadFile: string;
  language: string;
  langTr: string;
  langUs: string;

  // Upload Hero
  heroTitle: string;
  heroSubtitle: string;
  selectFileBtn: string;
  dropText: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  starterTemplates: string;

  // Preview Frame
  clickInstruction: string;
  interactiveModeOn: string;
  interactiveModeOff: string;
  interactiveBadge: string;
  editBadge: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  reloadPreview: string;
  addNewElement: string;
  inspectCode: string;

  // Floating Element Bar
  moveUp: string;
  moveDown: string;
  duplicate: string;
  delete: string;
  editElement: string;
  insertElement: string;
  selectParent: string;
  deselect: string;

  // Visual Inspector
  inspectorTitle: string;
  tabStyle: string;
  tabContent: string;
  tabClasses: string;
  tabAttributes: string;
  tabJavascript: string;
  jsEventsTitle: string;
  jsScriptsTitle: string;
  jsConsoleTitle: string;
  runJsBtn: string;
  addEventHandlerBtn: string;

  sectionTypography: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: string;
  textAlign: string;
  textColor: string;
  sectionBackground: string;
  backgroundColor: string;
  sectionSpacing: string;
  padding: string;
  margin: string;
  sectionBorders: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  sectionEffects: string;
  opacity: string;
  boxShadow: string;
  shadowNone: string;
  shadowSmall: string;
  shadowMedium: string;
  shadowLarge: string;
  sectionContent: string;
  editLiveText: string;
  sectionImage: string;
  imageSrc: string;
  sectionLink: string;
  linkHref: string;
  linkTarget: string;
  sectionClasses: string;
  addClassPlaceholder: string;
  addClassBtn: string;

  // Color Picker Control
  transparent: string;
  colorSpectrum: string;
  slideInstruction: string;
  vibrantColors: string;
  neutralColors: string;
  pastelColors: string;
  showAll: string;
  showLess: string;
  openColorPalette: string;
  eyedropperTooltip: string;
  transparentTooltip: string;
  hexPlaceholder: string;

  // File Explorer
  tabFiles: string;
  tabTree: string;
  searchDomPlaceholder: string;
  catHtml: string;
  catCss: string;
  catJs: string;
  catImages: string;
  catOther: string;
  editCodeBtn: string;
  activeBadge: string;

  // Code View
  codeEditorTitle: string;
  saveAndApply: string;
  copyCode: string;
  codeCopied: string;
  closeModal: string;

  // Add Element Modal
  addModalTitle: string;
  selectTypeLabel: string;
  contentLabel: string;
  classesLabel: string;
  insertBtn: string;
  cancelBtn: string;
  presetH1: string;
  presetH2: string;
  presetP: string;
  presetBtn: string;
  presetLink: string;
  presetBadge: string;
  presetImg: string;
  presetCard: string;
  presetHr: string;

  // Mobile Bottom Nav
  navPreview: string;
  navEdit: string;
  navFiles: string;
  navClasses: string;
  navCode: string;

  // Classes Catalog
  catalogTitle: string;
  searchClassesPlaceholder: string;

  // Feedback & Toasts
  toastUndo: string;
  toastRedo: string;
  toastDeleted: string;
  toastDuplicated: string;
  toastMoved: string;
  toastAdded: string;
  toastUploaded: string;
  toastSampleLoaded: string;
  toastCodeApplied: string;
  toastZipReady: string;
  toastHtmlReady: string;
  toastLangChanged: string;
}

const BASE_TR: Translations = {
  appName: 'ZipTrio',
  visualBadge: 'Görsel',
  preview: 'Önizleme',
  loading: 'Yükleniyor...',

  homeTooltip: 'Ana yükleme ekranına dön',
  undo: 'Geri Al',
  redo: 'İleri Al',
  undoTooltip: 'Yapılan Değişikliği Geri Al (Ctrl + Z)',
  redoTooltip: 'Geri Alınan Değişikliği İleri Al (Ctrl + Y)',
  newFile: 'Yeni Dosya',
  newFileTooltip: 'Yeni HTML veya ZIP dosyası yükle',
  samples: 'Örnekler',
  samplesTooltip: 'Hazır örnek web siteleri',
  samplesHeader: 'Hazır Siteler',
  desktop: 'Masaüstü',
  desktopTooltip: 'Masaüstü Tam Ekran',
  tablet: 'Tablet',
  tabletTooltip: 'Tablet Görünümü',
  mobile: 'Mobil',
  mobileTooltip: 'Mobil Görünüm',
  download: 'İndir',
  downloadMenuTitle: 'Düzenlenen Dosyaları İndir',
  downloadZip: 'ZIP Olarak İndir',
  downloadZipDesc: 'Tüm dosyalar, stiller ve JS',
  downloadHtml: 'HTML Olarak İndir',
  downloadHtmlDesc: 'Düzenlenmiş',
  uploadFile: 'Dosya Yükle',
  language: 'Dil',
  langTr: 'Türkçe',
  langUs: 'English',

  heroTitle: 'Web Sitenizi Yükleyin & Görsel Olarak Düzenleyin',
  heroSubtitle:
    'Tek bir HTML dosyası veya içinde stiller, JavaScript ve resimler bulunan ZIP arşivi yükleyin. Kod görmeden sitenizi tam ekran canlı inceleyin, dilediğiniz öğeye dokunun, stilleri değiştirin, taşıyın ve indirin.',
  selectFileBtn: 'HTML veya ZIP Dosyası Seçin',
  dropText: 'veya dosyanızı bu kutunun içine sürükleyip bırakın',
  feature1: 'Tam ekran kodsuz görsel önizleme',
  feature2: 'Rahat gezinme ve tam sayfa kaydırma',
  feature3: 'Öğe seçme, kopyalama ve silme',
  feature4: 'Düzenlenmiş ZIP / HTML indirme',
  starterTemplates: 'Veya hazır şablon sitelerle hemen deneyin:',

  clickInstruction: 'Düzenlemek istediğiniz herhangi bir öğeye (başlık, buton, resim vb.) tıklayın.',
  interactiveModeOn: 'Canlı Etkileşim Modu (Linkler & Butonlar Açık)',
  interactiveModeOff: 'Görsel Düzenleme Modu (Tıkla ve Düzenle)',
  interactiveBadge: 'Etkileşim',
  editBadge: 'Düzenle',
  zoomIn: 'Yakınlaştır',
  zoomOut: 'Uzaklaştır',
  resetZoom: 'Varsayılan',
  reloadPreview: 'Önizlemeyi Yenile',
  addNewElement: 'Yeni Öğe Ekle',
  inspectCode: 'Kaynak Kod',

  moveUp: 'Yukarı Taşı',
  moveDown: 'Aşağı Taşı',
  duplicate: 'Çoğalt',
  delete: 'Sil',
  editElement: 'Düzenle',
  insertElement: 'Öğe Ekle',
  selectParent: 'Üst Öğe',
  deselect: 'Seçimi Kaldır',

  inspectorTitle: 'Görsel Düzenleyici',
  tabStyle: 'Görsel CSS & Renkler',
  tabContent: 'İçerik & Yazı',
  tabClasses: 'Sınıflar',
  tabAttributes: 'Öznitelikler',
  tabJavascript: 'JavaScript (JS)',
  jsEventsTitle: 'Öğe Olay Tetikleyicileri (Event Listeners)',
  jsScriptsTitle: 'Arka Plandaki JavaScript Kodları',
  jsConsoleTitle: 'Canlı JS Konsolu & Kod Testi',
  runJsBtn: 'Öğede Canlı Çalıştır',
  addEventHandlerBtn: 'Yeni Olay Ekle',

  sectionTypography: 'Metin & Tipografi',
  fontFamily: 'Yazı Tipi',
  fontSize: 'Boyut',
  lineHeight: 'Satır Yüksekliği',
  letterSpacing: 'Harf Aralığı',
  fontWeight: 'Kalınlık',
  textAlign: 'Hizalama',
  textColor: 'Yazı Rengi',
  sectionBackground: 'Arka Plan Stili',
  backgroundColor: 'Arka Plan Rengi',
  sectionSpacing: 'Boşluklar (Padding & Margin)',
  padding: 'İç Boşluk (Padding)',
  margin: 'Dış Boşluk (Margin)',
  sectionBorders: 'Kenarlık & Yuvarlaklık',
  borderRadius: 'Köşe Yuvarlama',
  borderWidth: 'Kenarlık Kalınlığı',
  borderColor: 'Kenarlık Rengi',
  sectionEffects: 'Efektler & Görünürlük',
  opacity: 'Opaklık',
  boxShadow: 'Gölge',
  shadowNone: 'Yok',
  shadowSmall: 'Hafif',
  shadowMedium: 'Orta',
  shadowLarge: 'Büyük',
  sectionContent: 'Metin İçeriği',
  editLiveText: 'Canlı Metni Değiştirin:',
  sectionImage: 'Görsel Özellikleri',
  imageSrc: 'Görsel URL veya Yolu (src):',
  sectionLink: 'Bağlantı Özellikleri',
  linkHref: 'Hedef URL (href):',
  linkTarget: 'Yeni Sekmede Aç (_blank)',
  sectionClasses: 'Mevcut CSS Sınıfları',
  addClassPlaceholder: 'Yeni sınıf adı (örn: shadow-lg)...',
  addClassBtn: 'Ekle',

  transparent: 'Saydam',
  colorSpectrum: 'Canlı Renk Tayfı',
  slideInstruction: 'Kaydırarak Seç',
  vibrantColors: 'Canlı Renkler',
  neutralColors: 'Nötr & Gri',
  pastelColors: 'Pastel',
  showAll: 'Tümü',
  showLess: 'Daha Az',
  openColorPalette: 'Detaylı Renk Seçicisini Aç',
  eyedropperTooltip: 'Ekrandan Renk Çek (Damla Aracı)',
  transparentTooltip: 'Saydam (Arka planı kaldır)',
  hexPlaceholder: 'HEX kodu örn: 3B82F6',

  tabFiles: 'Dosyalar',
  tabTree: 'DOM Ağacı',
  searchDomPlaceholder: 'Etiket veya sınıf ara...',
  catHtml: 'HTML Sayfaları',
  catCss: 'CSS Stilleri',
  catJs: 'JavaScript Dosyaları',
  catImages: 'Görseller & Medya',
  catOther: 'Diğer Dosyalar',
  editCodeBtn: 'Kodu Düzenle',
  activeBadge: 'Aktif',

  codeEditorTitle: 'Kod Düzenleyici',
  saveAndApply: 'Değişiklikleri Kaydet & Canlı Uygula',
  copyCode: 'Kodu Kopyala',
  codeCopied: 'Kopyalandı!',
  closeModal: 'Kapat',

  addModalTitle: 'Sayfaya Yeni Öğe Ekle',
  selectTypeLabel: 'Eklenecek Öğe Türü',
  contentLabel: 'İçerik Metni',
  classesLabel: 'CSS Sınıfları (İsteğe Bağlı)',
  insertBtn: 'Öğeyi Ekle',
  cancelBtn: 'İptal',
  presetH1: 'Büyük Başlık (H1)',
  presetH2: 'Alt Başlık (H2)',
  presetP: 'Paragraf Metni',
  presetBtn: 'Etkileşimli Buton',
  presetLink: 'Bağlantı (Link)',
  presetBadge: 'Vurgu Rozeti',
  presetImg: 'Görsel (Image)',
  presetCard: 'Bilgi Kartı (Div)',
  presetHr: 'Ayırıcı Çizgi (Hr)',

  navPreview: 'Önizleme',
  navEdit: 'Düzenle',
  navFiles: 'Dosyalar',
  navClasses: 'Sınıflar',
  navCode: 'Kod',

  catalogTitle: 'CSS Sınıf Kitaplığı',
  searchClassesPlaceholder: 'Sınıf ara...',

  toastUndo: 'Geri alındı',
  toastRedo: 'İleri alındı',
  toastDeleted: 'Öğe başarıyla silindi',
  toastDuplicated: 'Öğe çoğaltıldı',
  toastMoved: 'Öğe konumu güncellendi',
  toastAdded: 'Yeni öğe sayfaya eklendi',
  toastUploaded: 'Dosya başarıyla yüklendi',
  toastSampleLoaded: 'Örnek şablon yüklendi',
  toastCodeApplied: 'Kod değişiklikleri canlı uygulandı',
  toastZipReady: 'ZIP arşivi indiriliyor...',
  toastHtmlReady: 'HTML dosyası indirildi',
  toastLangChanged: 'Dil güncellendi',
};

const BASE_AZ: Translations = {
  ...BASE_TR,
  appName: 'ZipTrio',
  visualBadge: 'Vizual',
  preview: 'Önizləmə',
  loading: 'Yüklənir...',

  homeTooltip: 'Əsas yükləmə ekranına qayıt',
  undo: 'Geri Al',
  redo: 'İrəli Al',
  undoTooltip: 'Dəyişikliyi Geri Al (Ctrl + Z)',
  redoTooltip: 'Dəyişikliyi İrəli Al (Ctrl + Y)',
  newFile: 'Yeni Fayl',
  newFileTooltip: 'Yeni HTML və ya ZIP faylı yüklə',
  samples: 'Nümunələr',
  samplesTooltip: 'Hazır veb-sayt şablonları',
  samplesHeader: 'Hazır Saytlar',
  desktop: 'Masaüstü',
  desktopTooltip: 'Masaüstü Tam Ekran',
  tablet: 'Planşet',
  tabletTooltip: 'Planşet Görünüşü',
  mobile: 'Mobil',
  mobileTooltip: 'Mobil Görünüş',
  download: 'Yüklə',
  downloadMenuTitle: 'Redaktə Edilmiş Faylları Yüklə',
  downloadZip: 'ZIP Kimi Yüklə',
  downloadZipDesc: 'Bütün fayllar, stillər və JS',
  downloadHtml: 'HTML Kimi Yüklə',
  downloadHtmlDesc: 'Redaktə edilmiş tək fayl',
  uploadFile: 'Fayl Yüklə',
  language: 'Dil',
  langTr: 'Türkcə',
  langUs: 'İngiliscə',

  heroTitle: 'Veb Saytınızı Yükləyin & Vizual Olaraq Redaktə Edin',
  heroSubtitle:
    'Tək bir HTML faylı və ya içində stillər, JavaScript və şəkillər olan ZIP arxivi yükləyin. Kod görmədən saytınızı canlı önizləyin, istədiyiniz elementə toxunun, stilləri dəyişdirin, daşıyın və endirin.',
  selectFileBtn: 'HTML və ya ZIP Faylı Seçin',
  dropText: 'və ya faylınızı bu qutuya sürükləyib buraxın',
  feature1: 'Tam ekran kodsuz vizual önizləmə',
  feature2: 'Rahat naviqasiya və tam səhifə sürüşdürmə',
  feature3: 'Element seçimi, kopyalama və silmə',
  feature4: 'Redaktə edilmiş ZIP / HTML endirmə',
  starterTemplates: 'Və ya hazır şablon saytlarla dərhal sınayın:',

  clickInstruction: 'Redaktə etmək istədiyiniz hər hansı bir elementə (başlıq, düymə, şəkil və s.) klikləyin.',
  interactiveModeOn: 'Canlı İnteraktiv Rejim (Keçidlər & Düymələr Aktiv)',
  interactiveModeOff: 'Vizual Redaktə Rejimi (Kliklə və Redaktə Et)',
  interactiveBadge: 'İnteraktiv',
  editBadge: 'Redaktə',
  zoomIn: 'Böyüt',
  zoomOut: 'Kiçilt',
  resetZoom: 'Varsayılan',
  reloadPreview: 'Önizləməni Yenilə',
  addNewElement: 'Yeni Element Əlavə Et',
  inspectCode: 'Mənbə Kodu',

  moveUp: 'Yuxarı Daşı',
  moveDown: 'Aşağı Daşı',
  duplicate: 'Kopyala',
  delete: 'Sil',
  editElement: 'Redaktə Et',
  insertElement: 'Element Əlavə Et',
  selectParent: 'Üst Element',
  deselect: 'Seçimi Ləğv Et',

  inspectorTitle: 'Vizual Redaktor',
  tabStyle: 'Vizual CSS & Rənglər',
  tabContent: 'Məzmun & Yazı',
  tabClasses: 'Siniflər',
  tabAttributes: 'Atributlar',
  tabJavascript: 'JavaScript (JS)',
  jsEventsTitle: 'Element Hadisələri (Event Listeners)',
  jsScriptsTitle: 'Arxa Plandakı JavaScript Kodları',
  jsConsoleTitle: 'Canlı JS Konsolu & Kod Sınağı',
  runJsBtn: 'Elementdə Canlı İşlət',
  addEventHandlerBtn: 'Yeni Hadisə Əlavə Et',

  sectionTypography: 'Mətn & Tipoqrafiya',
  fontFamily: 'Şrift',
  fontSize: 'Ölçü',
  lineHeight: 'Sətir Hündürlüyü',
  letterSpacing: 'Hərf Aralığı',
  fontWeight: 'Qalınlıq',
  textAlign: 'Düzləndirmə',
  textColor: 'Mətn Rəngi',
  sectionBackground: 'Arxa Plan Stili',
  backgroundColor: 'Arxa Plan Rəngi',
  sectionSpacing: 'Boşluqlar (Padding & Margin)',
  padding: 'Daxili Boşluq (Padding)',
  margin: 'Xarici Boşluq (Margin)',
  sectionBorders: 'Kənarlıq & Bucaqlar',
  borderRadius: 'Künc Yuvarlaqlığı',
  borderWidth: 'Kənarlıq Qalınlığı',
  borderColor: 'Kənarlıq Rəngi',
  sectionEffects: 'Effektlər & Görünüş',
  opacity: 'Şəffaflıq',
  boxShadow: 'Kölgə',
  shadowNone: 'Yoxdur',
  shadowSmall: 'Zəif',
  shadowMedium: 'Orta',
  shadowLarge: 'Böyük',
  sectionContent: 'Mətn Məzmunu',
  editLiveText: 'Canlı Mətni Dəyişdirin:',
  sectionImage: 'Şəkil Xüsusiyyətləri',
  imageSrc: 'Şəkil URL və ya Yolu (src):',
  sectionLink: 'Keçid Xüsusiyyətləri',
  linkHref: 'Hədəf URL (href):',
  linkTarget: 'Yeni Vərəqdə Aç (_blank)',
  sectionClasses: 'Mövcud CSS Sinifləri',
  addClassPlaceholder: 'Yeni sinif adı (məs: shadow-lg)...',
  addClassBtn: 'Əlavə Et',

  transparent: 'Şəffaf',
  colorSpectrum: 'Rəng Spektri',
  slideInstruction: 'Sürüşdürərək Seçin',
  vibrantColors: 'Canlı Rənglər',
  neutralColors: 'Neytral & Boz',
  pastelColors: 'Pastel',
  showAll: 'Hamısı',
  showLess: 'Daha Az',
  openColorPalette: 'Rəng Palitrasını Aç',
  eyedropperTooltip: 'Ekrandan Rəng Götür (Pipetka)',
  transparentTooltip: 'Şəffaf (Arxa planı sil)',
  hexPlaceholder: 'HEX kodu məs: 3B82F6',

  tabFiles: 'Fayllar',
  tabTree: 'DOM Ağacı',
  searchDomPlaceholder: 'Teq və ya sinif axtar...',
  catHtml: 'HTML Səhifələri',
  catCss: 'CSS Stilləri',
  catJs: 'JavaScript Faylları',
  catImages: 'Şəkillər & Media',
  catOther: 'Digər Fayllar',
  editCodeBtn: 'Kodu Redaktə Et',
  activeBadge: 'Aktiv',

  codeEditorTitle: 'Kod Redaktoru',
  saveAndApply: 'Yadda Saxla & Canlı Tətbiq Et',
  copyCode: 'Kodu Kopyala',
  codeCopied: 'Kopyalandı!',
  closeModal: 'Bağla',

  addModalTitle: 'Səhifəyə Yeni Element Əlavə Et',
  selectTypeLabel: 'Əlavə Ediləcək Element Növü',
  contentLabel: 'Məzmun Mətni',
  classesLabel: 'CSS Sinifləri (İstəyə görə)',
  insertBtn: 'Elementi Əlavə Et',
  cancelBtn: 'Ləğv Et',
  presetH1: 'Böyük Başlıq (H1)',
  presetH2: 'Alt Başlıq (H2)',
  presetP: 'Paraqraf Mətni',
  presetBtn: 'İnteraktiv Düymə',
  presetLink: 'Keçid (Link)',
  presetBadge: 'Vurğu Nişanı',
  presetImg: 'Şəkil (Image)',
  presetCard: 'Məlumat Kartı (Div)',
  presetHr: 'Ayırıcı Xətt (Hr)',

  navPreview: 'Önizləmə',
  navEdit: 'Redaktə',
  navFiles: 'Fayllar',
  navClasses: 'Siniflər',
  navCode: 'Kod',

  catalogTitle: 'CSS Sinif Kitabxanası',
  searchClassesPlaceholder: 'Sinif axtar...',

  toastUndo: 'Geri alındı',
  toastRedo: 'İrəli alındı',
  toastDeleted: 'Element uğurla silindi',
  toastDuplicated: 'Element nüsxələndi',
  toastMoved: 'Element mövqeyi yeniləndi',
  toastAdded: 'Yeni element səhifəyə əlavə edildi',
  toastUploaded: 'Fayl uğurla yükləndi',
  toastSampleLoaded: 'Nümunə şablon yükləndi',
  toastCodeApplied: 'Kod dəyişiklikləri canlı tətbiq edildi',
  toastZipReady: 'ZIP arxivi endirilir...',
  toastHtmlReady: 'HTML faylı endirildi',
  toastLangChanged: 'Dil Azərbaycan dilinə dəyişdirildi',
};

const BASE_EN: Translations = {
  appName: 'ZipTrio',
  visualBadge: 'Visual',
  preview: 'Preview',
  loading: 'Loading...',

  homeTooltip: 'Return to upload screen',
  undo: 'Undo',
  redo: 'Redo',
  undoTooltip: 'Undo last change (Ctrl + Z)',
  redoTooltip: 'Redo last change (Ctrl + Y)',
  newFile: 'New File',
  newFileTooltip: 'Upload a new HTML or ZIP file',
  samples: 'Samples',
  samplesTooltip: 'Pre-made website templates',
  samplesHeader: 'Ready-made Sites',
  desktop: 'Desktop',
  desktopTooltip: 'Desktop Full-Screen',
  tablet: 'Tablet',
  tabletTooltip: 'Tablet Viewport',
  mobile: 'Mobile',
  mobileTooltip: 'Mobile Viewport',
  download: 'Export',
  downloadMenuTitle: 'Export Edited Project',
  downloadZip: 'Download as ZIP',
  downloadZipDesc: 'All files, stylesheets and JS',
  downloadHtml: 'Download as HTML',
  downloadHtmlDesc: 'Standalone modified file',
  uploadFile: 'Upload File',
  language: 'Language',
  langTr: 'Türkçe',
  langUs: 'English',

  heroTitle: 'Upload Your Website & Edit It Visually',
  heroSubtitle:
    'Drop a single HTML file or a complete ZIP archive with CSS, JavaScript, and assets. Inspect your website live without reading code, click any element, edit styles, tweak text, and export.',
  selectFileBtn: 'Select HTML or ZIP File',
  dropText: 'or drag and drop your file into this box',
  feature1: 'Full-screen no-code visual preview',
  feature2: 'Effortless scrolling and navigation',
  feature3: 'Element inspect, duplicate and delete',
  feature4: 'Instant ZIP / HTML project export',
  starterTemplates: 'Or experiment immediately with ready templates:',

  clickInstruction: 'Click any element (headline, button, image, container) to edit it visually.',
  interactiveModeOn: 'Live Interaction Mode (Links & Buttons Active)',
  interactiveModeOff: 'Visual Editing Mode (Click to Inspect)',
  interactiveBadge: 'Interactive',
  editBadge: 'Inspect',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  resetZoom: 'Reset Zoom',
  reloadPreview: 'Reload Preview',
  addNewElement: 'Add New Element',
  inspectCode: 'Source Code',

  moveUp: 'Move Up',
  moveDown: 'Move Down',
  duplicate: 'Duplicate',
  delete: 'Delete',
  editElement: 'Edit',
  insertElement: 'Add Element',
  selectParent: 'Parent Element',
  deselect: 'Deselect',

  inspectorTitle: 'Visual Inspector',
  tabStyle: 'CSS & Colors',
  tabContent: 'Content & Text',
  tabClasses: 'Classes',
  tabAttributes: 'Attributes',
  tabJavascript: 'JavaScript (JS)',
  jsEventsTitle: 'Attached Event Handlers (Listeners)',
  jsScriptsTitle: 'Scripts Targeting This Element',
  jsConsoleTitle: 'Live JS Console & Sandbox',
  runJsBtn: 'Run on Element',
  addEventHandlerBtn: 'Add Event Handler',

  sectionTypography: 'Typography & Style',
  fontFamily: 'Font Family',
  fontSize: 'Font Size',
  lineHeight: 'Line Height',
  letterSpacing: 'Letter Spacing',
  fontWeight: 'Font Weight',
  textAlign: 'Text Align',
  textColor: 'Text Color',
  sectionBackground: 'Background Style',
  backgroundColor: 'Background Color',
  sectionSpacing: 'Spacing (Padding & Margin)',
  padding: 'Padding',
  margin: 'Margin',
  sectionBorders: 'Borders & Radius',
  borderRadius: 'Border Radius',
  borderWidth: 'Border Width',
  borderColor: 'Border Color',
  sectionEffects: 'Effects & Opacity',
  opacity: 'Opacity',
  boxShadow: 'Shadow',
  shadowNone: 'None',
  shadowSmall: 'Subtle',
  shadowMedium: 'Medium',
  shadowLarge: 'Large',
  sectionContent: 'Text Content',
  editLiveText: 'Modify Live Text:',
  sectionImage: 'Image Properties',
  imageSrc: 'Image URL or Path (src):',
  sectionLink: 'Link Properties',
  linkHref: 'Target URL (href):',
  linkTarget: 'Open in new tab (_blank)',
  sectionClasses: 'Active CSS Classes',
  addClassPlaceholder: 'New class name (e.g. shadow-lg)...',
  addClassBtn: 'Add',

  transparent: 'Transparent',
  colorSpectrum: 'Color Spectrum',
  slideInstruction: 'Slide to Select',
  vibrantColors: 'Vibrant Colors',
  neutralColors: 'Neutrals & Grays',
  pastelColors: 'Pastels',
  showAll: 'Show All',
  showLess: 'Show Less',
  openColorPalette: 'Open Color Palette',
  eyedropperTooltip: 'Pick color from screen (Eyedropper)',
  transparentTooltip: 'Make transparent',
  hexPlaceholder: 'HEX code e.g. 3B82F6',

  tabFiles: 'Files',
  tabTree: 'DOM Tree',
  searchDomPlaceholder: 'Search tag or class...',
  catHtml: 'HTML Pages',
  catCss: 'CSS Styles',
  catJs: 'JavaScript Files',
  catImages: 'Images & Media',
  catOther: 'Other Files',
  editCodeBtn: 'Edit Code',
  activeBadge: 'Active',

  codeEditorTitle: 'Code Editor',
  saveAndApply: 'Save & Apply Live Changes',
  copyCode: 'Copy Code',
  codeCopied: 'Copied!',
  closeModal: 'Close',

  addModalTitle: 'Insert New Element',
  selectTypeLabel: 'Element Type to Insert',
  contentLabel: 'Text Content',
  classesLabel: 'CSS Classes (Optional)',
  insertBtn: 'Insert Element',
  cancelBtn: 'Cancel',
  presetH1: 'Main Heading (H1)',
  presetH2: 'Section Heading (H2)',
  presetP: 'Paragraph (P)',
  presetBtn: 'Interactive Button',
  presetLink: 'Link (A)',
  presetBadge: 'Badge Tag',
  presetImg: 'Image (Img)',
  presetCard: 'Card Container (Div)',
  presetHr: 'Horizontal Divider (Hr)',

  navPreview: 'Preview',
  navEdit: 'Edit',
  navFiles: 'Files',
  navClasses: 'Classes',
  navCode: 'Code',

  catalogTitle: 'CSS Class Catalog',
  searchClassesPlaceholder: 'Search class...',

  toastUndo: 'Change undone',
  toastRedo: 'Change redone',
  toastDeleted: 'Element deleted',
  toastDuplicated: 'Element cloned',
  toastMoved: 'Element position updated',
  toastAdded: 'New element added to page',
  toastUploaded: 'Project loaded successfully',
  toastSampleLoaded: 'Template project loaded',
  toastCodeApplied: 'Code modifications applied live',
  toastZipReady: 'Preparing ZIP download...',
  toastHtmlReady: 'HTML file exported',
  toastLangChanged: 'Language updated',
};

// Localized helper to create translations for any of the 28 languages
function createLang(baseOverrides: Partial<Translations>): Translations {
  return { ...BASE_EN, ...baseOverrides };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  tr: BASE_TR,
  az: BASE_AZ,
  en: BASE_EN,
  us: BASE_EN,

  // German
  de: createLang({
    visualBadge: 'Visuell',
    preview: 'Vorschau',
    loading: 'Wird geladen...',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    newFile: 'Neue Datei',
    samples: 'Vorlagen',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobil',
    download: 'Exportieren',
    downloadZip: 'Als ZIP herunterladen',
    downloadHtml: 'Als HTML herunterladen',
    heroTitle: 'Website hochladen & visuell bearbeiten',
    heroSubtitle: 'Laden Sie HTML oder ein ZIP-Archiv hoch und passen Sie Ihre Website live und ohne Programmierkenntnisse an.',
    selectFileBtn: 'HTML- oder ZIP-Datei wählen',
    tabStyle: 'CSS & Farben',
    tabClasses: 'Klassen',
    tabAttributes: 'Attribute',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'Event-Handler & Listener',
    jsScriptsTitle: 'Zugehörige JavaScript-Dateien',
    jsConsoleTitle: 'Live JS-Konsole',
    runJsBtn: 'Auf Element ausführen',
    addEventHandlerBtn: 'Event hinzufügen',
    toastDeleted: 'Element gelöscht',
    toastDuplicated: 'Element dupliziert',
    toastMoved: 'Position geändert',
    toastUploaded: 'Projekt erfolgreich geladen',
    toastLangChanged: 'Sprache auf Deutsch aktualisiert',
  }),

  // French
  fr: createLang({
    visualBadge: 'Visuel',
    preview: 'Aperçu',
    loading: 'Chargement...',
    undo: 'Annuler',
    redo: 'Rétablir',
    newFile: 'Nouveau fichier',
    samples: 'Exemples',
    desktop: 'Bureau',
    tablet: 'Tablette',
    mobile: 'Mobile',
    download: 'Exporter',
    downloadZip: 'Télécharger en ZIP',
    downloadHtml: 'Télécharger en HTML',
    heroTitle: 'Téléversez votre site & modifiez-le visuellement',
    heroSubtitle: 'Glissez un fichier HTML ou une archive ZIP complète. Modifiez les styles en direct sans coder.',
    selectFileBtn: 'Choisir un fichier HTML ou ZIP',
    tabStyle: 'CSS & Couleurs',
    tabClasses: 'Classes',
    tabAttributes: 'Attributs',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'Gestionnaires d’événements',
    jsScriptsTitle: 'Scripts ciblant cet élément',
    jsConsoleTitle: 'Console JS en direct',
    runJsBtn: 'Exécuter sur l’élément',
    addEventHandlerBtn: 'Ajouter un événement',
    toastDeleted: 'Élément supprimé',
    toastDuplicated: 'Élément dupliqué',
    toastMoved: 'Position mise à jour',
    toastUploaded: 'Projet chargé avec succès',
    toastLangChanged: 'Langue mise à jour en Français',
  }),

  // Spanish
  es: createLang({
    visualBadge: 'Visual',
    preview: 'Vista previa',
    loading: 'Cargando...',
    undo: 'Deshacer',
    redo: 'Rehacer',
    newFile: 'Nuevo archivo',
    samples: 'Plantillas',
    desktop: 'Escritorio',
    tablet: 'Tableta',
    mobile: 'Móvil',
    download: 'Exportar',
    downloadZip: 'Descargar ZIP',
    downloadHtml: 'Descargar HTML',
    heroTitle: 'Sube tu sitio web y edítalo visualmente',
    heroSubtitle: 'Arrastra un archivo HTML o un archivo ZIP completo con estilos y JS. Edita cualquier elemento en vivo.',
    selectFileBtn: 'Seleccionar archivo HTML o ZIP',
    tabStyle: 'CSS y Colores',
    tabClasses: 'Clases',
    tabAttributes: 'Atributos',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'Manejadores de eventos (Listeners)',
    jsScriptsTitle: 'Scripts vinculados a este elemento',
    jsConsoleTitle: 'Consola JS en vivo',
    runJsBtn: 'Ejecutar en el elemento',
    addEventHandlerBtn: 'Añadir evento',
    toastDeleted: 'Elemento eliminado',
    toastDuplicated: 'Elemento duplicado',
    toastMoved: 'Posición actualizada',
    toastUploaded: 'Proyecto cargado exitosamente',
    toastLangChanged: 'Idioma actualizado a Español',
  }),

  // Italian
  it: createLang({
    visualBadge: 'Visuale',
    preview: 'Anteprima',
    loading: 'Caricamento...',
    undo: 'Annulla',
    redo: 'Ripeti',
    newFile: 'Nuovo file',
    samples: 'Modelli',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    download: 'Esporta',
    downloadZip: 'Scarica ZIP',
    downloadHtml: 'Scarica HTML',
    heroTitle: 'Carica il tuo sito e modificalo visivamente',
    heroSubtitle: 'Carica file HTML o ZIP completo. Modifica stili, testi e codice senza toccare i file originali.',
    selectFileBtn: 'Seleziona file HTML o ZIP',
    tabStyle: 'CSS & Colori',
    tabClasses: 'Classi',
    tabAttributes: 'Attributi',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'Gestori eventi (Event Listeners)',
    jsScriptsTitle: 'Script associati a questo elemento',
    jsConsoleTitle: 'Console JS live',
    runJsBtn: 'Esegui su elemento',
    addEventHandlerBtn: 'Aggiungi evento',
    toastDeleted: 'Elemento eliminato',
    toastLangChanged: 'Lingua aggiornata in Italiano',
  }),

  // Portuguese
  pt: createLang({
    visualBadge: 'Visual',
    preview: 'Prévia',
    loading: 'Carregando...',
    undo: 'Desfazer',
    redo: 'Refazer',
    newFile: 'Novo arquivo',
    samples: 'Modelos',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Celular',
    download: 'Exportar',
    downloadZip: 'Baixar como ZIP',
    downloadHtml: 'Baixar como HTML',
    heroTitle: 'Envie seu site e edite visualmente',
    heroSubtitle: 'Arraste um arquivo HTML ou ZIP. Personalize estilos, cores e JavaScript em tempo real.',
    selectFileBtn: 'Selecionar arquivo HTML ou ZIP',
    tabStyle: 'CSS e Cores',
    tabClasses: 'Classes',
    tabAttributes: 'Atributos',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'Manipuladores de Eventos',
    jsScriptsTitle: 'Scripts vinculados a este elemento',
    jsConsoleTitle: 'Console JS ao vivo',
    runJsBtn: 'Executar no elemento',
    addEventHandlerBtn: 'Adicionar evento',
    toastDeleted: 'Elemento excluído',
    toastLangChanged: 'Idioma alterado para Português',
  }),

  // Russian
  ru: createLang({
    visualBadge: 'Визуальный',
    preview: 'Предпросмотр',
    loading: 'Загрузка...',
    undo: 'Назад',
    redo: 'Вперед',
    newFile: 'Новый файл',
    samples: 'Шаблоны',
    desktop: 'ПК',
    tablet: 'Планшет',
    mobile: 'Телефон',
    download: 'Скачать',
    downloadZip: 'Скачать ZIP архив',
    downloadHtml: 'Скачать HTML',
    heroTitle: 'Загрузите сайт и редактируйте его визуально',
    heroSubtitle: 'Загрузите HTML или ZIP архив со стилями и скриптами. Кликайте по элементам и редактируйте прямо в браузере.',
    selectFileBtn: 'Выбрать файл HTML или ZIP',
    tabStyle: 'CSS и Цвета',
    tabClasses: 'Классы',
    tabAttributes: 'Атрибуты',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'Обработчики событий (Events)',
    jsScriptsTitle: 'Скрипты, привязанные к элементу',
    jsConsoleTitle: 'Live JS Консоль',
    runJsBtn: 'Выполнить для элемента',
    addEventHandlerBtn: 'Добавить событие',
    toastDeleted: 'Элемент удален',
    toastLangChanged: 'Язык изменен на Русский',
  }),

  // Arabic
  ar: createLang({
    visualBadge: 'مرئي',
    preview: 'معاينة',
    loading: 'جاري التحميل...',
    undo: 'تراجع',
    redo: 'إعادة',
    newFile: 'ملف جديد',
    samples: 'نماذج',
    desktop: 'حاسوب',
    tablet: 'جهاز لوحي',
    mobile: 'هاتف',
    download: 'تصدير',
    downloadZip: 'تحميل كملف ZIP',
    downloadHtml: 'تحميل كملف HTML',
    heroTitle: 'ارفع موقعك وقم بتعديله مرئياً',
    heroSubtitle: 'ارفع ملف HTML أو أرشيف ZIP مع الأنماط والجافاسكربت. انقر على أي عنصر وقم بتعديله مباشرة.',
    selectFileBtn: 'اختر ملف HTML أو ZIP',
    tabStyle: 'CSS والألوان',
    tabClasses: 'الفئات (Classes)',
    tabAttributes: 'الخصائص (Attributes)',
    tabJavascript: 'جافاسكربت (JS)',
    jsEventsTitle: 'أحداث العنصر (Event Handlers)',
    jsScriptsTitle: 'البرمجيات المرتبطة بهذا العنصر',
    jsConsoleTitle: 'منصة اختبار JS المباشرة',
    runJsBtn: 'تشغيل على العنصر',
    addEventHandlerBtn: 'إضافة حدث جديد',
    toastDeleted: 'تم حذف العنصر بنجاح',
    toastLangChanged: 'تم تغيير اللغة إلى العربية',
  }),

  // Japanese
  ja: createLang({
    visualBadge: 'ビジュアル',
    preview: 'プレビュー',
    loading: '読み込み中...',
    undo: '元に戻す',
    redo: 'やり直す',
    newFile: '新規ファイル',
    samples: 'サンプル',
    desktop: 'デスクトップ',
    tablet: 'タブレット',
    mobile: 'モバイル',
    download: 'エクスポート',
    downloadZip: 'ZIPでダウンロード',
    downloadHtml: 'HTMLでダウンロード',
    heroTitle: 'Webサイトをアップロードして視覚的に編集',
    heroSubtitle: 'HTMLファイルまたはZIPアーカイブをアップロード。コードを見ずにクリックでスタイルやJSを直接編集。',
    selectFileBtn: 'HTMLまたはZIPを選択',
    tabStyle: 'CSS & カラー',
    tabClasses: 'クラス',
    tabAttributes: '属性',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: 'イベントリスナー',
    jsScriptsTitle: 'この要素を参照するスクリプト',
    jsConsoleTitle: 'ライブJSコンソール',
    runJsBtn: '要素上で実行',
    addEventHandlerBtn: 'イベント追加',
    toastDeleted: '要素を削除しました',
    toastLangChanged: '言語を日本語に変更しました',
  }),

  // Korean
  ko: createLang({
    visualBadge: '시각적',
    preview: '미리보기',
    loading: '로딩 중...',
    undo: '실행 취소',
    redo: '다시 실행',
    newFile: '새 파일',
    samples: '샘플',
    desktop: '데스크톱',
    tablet: '태블릿',
    mobile: '모바일',
    download: '내보내기',
    downloadZip: 'ZIP 다운로드',
    downloadHtml: 'HTML 다운로드',
    heroTitle: '웹사이트를 업로드하고 시각적으로 편집하세요',
    heroSubtitle: 'HTML 또는 ZIP 파일을 업로드하여 클릭 한 번으로 스타일과 자바스크립트를 실시간 편집하세요.',
    selectFileBtn: 'HTML 또는 ZIP 파일 선택',
    tabStyle: 'CSS 및 색상',
    tabClasses: '클래스',
    tabAttributes: '속성',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: '이벤트 리스너',
    jsScriptsTitle: '이 요소 관련 스크립트',
    jsConsoleTitle: '실시간 JS 콘솔',
    runJsBtn: '요소에서 실행',
    addEventHandlerBtn: '이벤트 추가',
    toastDeleted: '요소가 삭제되었습니다',
    toastLangChanged: '언어가 한국어로 변경되었습니다',
  }),

  // Chinese
  zh: createLang({
    visualBadge: '可视化',
    preview: '预览',
    loading: '加载中...',
    undo: '撤销',
    redo: '重做',
    newFile: '新文件',
    samples: '范例模板',
    desktop: '桌面端',
    tablet: '平板',
    mobile: '手机端',
    download: '导出',
    downloadZip: '下载 ZIP 压缩包',
    downloadHtml: '下载 HTML 文件',
    heroTitle: '上传网站并进行可视化编辑',
    heroSubtitle: '上传单个 HTML 或包含样式与 JS 的 ZIP 压缩包。无需看代码，点击元素即可实时编辑样式与脚本。',
    selectFileBtn: '选择 HTML 或 ZIP 文件',
    tabStyle: 'CSS 与颜色',
    tabClasses: '类名',
    tabAttributes: '属性',
    tabJavascript: 'JavaScript (JS)',
    jsEventsTitle: '事件监听器 (Events)',
    jsScriptsTitle: '关联此元素的脚本',
    jsConsoleTitle: '实时 JS 控制台',
    runJsBtn: '在当前元素运行',
    addEventHandlerBtn: '添加事件',
    toastDeleted: '元素已删除',
    toastLangChanged: '语言已切换为中文',
  }),

  // Dutch
  nl: createLang({
    visualBadge: 'Visueel',
    preview: 'Voorbeeld',
    download: 'Exporteren',
    heroTitle: 'Upload uw website en bewerk visueel',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Taal bijgewerkt naar Nederlands',
  }),

  // Polish
  pl: createLang({
    visualBadge: 'Wizualny',
    preview: 'Podgląd',
    download: 'Eksportuj',
    heroTitle: 'Prześlij stronę i edytuj wizualnie',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Zmieniono język na Polski',
  }),

  // Ukrainian
  uk: createLang({
    visualBadge: 'Візуальний',
    preview: 'Перегляд',
    download: 'Експорт',
    heroTitle: 'Завантажте сайт та редагуйте візуально',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Мову змінено на Українську',
  }),

  // Swedish
  sv: createLang({
    visualBadge: 'Visuell',
    preview: 'Förhandsvisning',
    download: 'Exportera',
    heroTitle: 'Ladda upp din webbplats och redigera visuellt',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Språket har ändrats till Svenska',
  }),

  // Norwegian
  no: createLang({
    visualBadge: 'Visuell',
    preview: 'Forhåndsvisning',
    download: 'Eksporter',
    heroTitle: 'Last opp nettstedet ditt og rediger visuelt',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Språk endret til Norsk',
  }),

  // Danish
  da: createLang({
    visualBadge: 'Visuel',
    preview: 'Forhåndsvisning',
    download: 'Eksporter',
    heroTitle: 'Upload din hjemmeside og rediger visuelt',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Sprog ændret til Dansk',
  }),

  // Finnish
  fi: createLang({
    visualBadge: 'Visuaalinen',
    preview: 'Esikatselu',
    download: 'Vie',
    heroTitle: 'Lataa verkkosivustosi ja muokkaa visuaalisesti',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Kieli vaihdettu Suomeksi',
  }),

  // Greek
  el: createLang({
    visualBadge: 'Οπτικό',
    preview: 'Προεπισκόπηση',
    download: 'Εξαγωγή',
    heroTitle: 'Ανεβάστε τον ιστότοπό σας και επεξεργαστείτε οπτικά',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Η γλώσσα άλλαξε σε Ελληνικά',
  }),

  // Czech
  cs: createLang({
    visualBadge: 'Vizuální',
    preview: 'Náhled',
    download: 'Exportovat',
    heroTitle: 'Nahrajte svůj web a upravujte jej vizuálně',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Jazyk změněn na Češtinu',
  }),

  // Romanian
  ro: createLang({
    visualBadge: 'Vizual',
    preview: 'Previzualizare',
    download: 'Exportă',
    heroTitle: 'Încărcați site-ul și editați-l vizual',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Limba a fost schimbată în Română',
  }),

  // Hungarian
  hu: createLang({
    visualBadge: 'Vizuális',
    preview: 'Előnézet',
    download: 'Exportálás',
    heroTitle: 'Töltse fel weboldalát és szerkessze vizuálisan',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Nyelv módosítva Magyarra',
  }),

  // Hindi
  hi: createLang({
    visualBadge: 'विजुअल',
    preview: 'पूर्वावलोकन',
    download: 'निर्यात करें',
    heroTitle: 'अपनी वेबसाइट अपलोड करें और लाइव संपादित करें',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'भाषा हिन्दी में बदल दी गई है',
  }),

  // Indonesian
  id: createLang({
    visualBadge: 'Visual',
    preview: 'Pratinjau',
    download: 'Ekspor',
    heroTitle: 'Unggah situs web Anda dan edit secara visual',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Bahasa diubah ke Bahasa Indonesia',
  }),

  // Vietnamese
  vi: createLang({
    visualBadge: 'Trực quan',
    preview: 'Xem trước',
    download: 'Xuất tệp',
    heroTitle: 'Tải lên trang web của bạn và chỉnh sửa trực quan',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'Đã chuyển đổi sang Tiếng Việt',
  }),

  // Hebrew
  he: createLang({
    visualBadge: 'חזותי',
    preview: 'תצוגה מקדימה',
    download: 'ייצוא',
    heroTitle: 'העלה את האתר שלך וערוך אותו בצורה ויזואלית',
    tabJavascript: 'JavaScript (JS)',
    toastLangChanged: 'השפה שונתה לעברית',
  }),
};
