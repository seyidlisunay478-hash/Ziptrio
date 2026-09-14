import { ProjectFile, Language } from '../types';
import { TEMPLATE_TRANSLATIONS } from './sampleTranslations';

export interface SampleProject {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
}

const COMMON_STARTUP_CSS = `/* NexusTech Modern Stylesheet */
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary-color: #0f172a;
  --bg-light: #f8fafc;
  --text-dark: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  background-color: var(--bg-light);
  color: var(--text-dark);
  line-height: 1.6;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.header {
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  color: var(--secondary-color);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--primary-color);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  padding: 10px 20px;
  font-size: 15px;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #f1f5f9;
  color: var(--secondary-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-large {
  padding: 14px 28px;
  font-size: 16px;
}

.btn-white {
  background: #ffffff;
  color: var(--primary-color);
}

/* Hero */
.hero-section {
  padding: 80px 0 60px;
  text-align: center;
  background: radial-gradient(circle at top, #eff6ff 0%, #f8fafc 70%);
}

.badge {
  display: inline-block;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--secondary-color);
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 650px;
  margin: 0 auto 30px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
}

.counter-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 14px;
}

/* Features */
.features-section {
  padding: 80px 0;
}

.section-heading {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--secondary-color);
  margin-bottom: 12px;
}

.section-desc {
  color: var(--text-muted);
  font-size: 16px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--card-bg);
  padding: 36px 28px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.08);
}

.feature-card.featured {
  border-color: var(--primary-color);
  box-shadow: 0 8px 20px -6px rgba(37, 99, 235, 0.15);
}

.card-icon {
  font-size: 34px;
  margin-bottom: 18px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.card-text {
  color: var(--text-muted);
  font-size: 15px;
}

/* CTA */
.cta-section {
  padding: 70px 0;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: #ffffff;
  text-align: center;
}

.cta-title {
  font-size: 34px;
  font-weight: 800;
  margin-bottom: 12px;
}

.cta-desc {
  font-size: 17px;
  opacity: 0.9;
  margin-bottom: 28px;
}

/* Footer */
.footer {
  background: #0f172a;
  color: #94a3b8;
  padding: 30px 0;
  font-size: 14px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
}

.footer-link:hover {
  color: #ffffff;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  .nav-menu {
    display: none;
  }
  .hero-actions {
    flex-direction: column;
  }
  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}`;

const COMMON_STARTUP_JS = `// Interactive button logic for demo
let clickCount = 0;
const counterEl = document.getElementById('click-counter');
const mainBtn = document.getElementById('main-demo-btn');
const headerBtn = document.getElementById('cta-header-btn');

function increment() {
  clickCount++;
  if (counterEl) {
    counterEl.textContent = clickCount;
  }
}

if (mainBtn) {
  mainBtn.addEventListener('click', increment);
}
if (headerBtn) {
  headerBtn.addEventListener('click', increment);
}
console.log('NexusTech scripts loaded successfully.');`;

export function getSampleProjects(lang: Language = 'tr'): SampleProject[] {
  const bundle = TEMPLATE_TRANSLATIONS[lang] || TEMPLATE_TRANSLATIONS['tr'];
  const t1 = bundle.startup;
  const t2 = bundle.portfolio;
  const isRtl = lang === 'ar' || lang === 'he';
  const dirAttr = isRtl ? ' dir="rtl"' : '';

  const startupHtml = `<!DOCTYPE html>
<html lang="${lang}"${dirAttr}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t1.pageTitle}</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Header / Navigation -->
  <header class="header">
    <div class="container nav-wrapper">
      <a href="#" class="logo">⚡ NexusTech</a>
      <nav class="nav-menu">
        <a href="#features" class="nav-link">${t1.navFeatures}</a>
        <a href="#pricing" class="nav-link">${t1.navPricing}</a>
        <a href="#about" class="nav-link">${t1.navAbout}</a>
        <button id="cta-header-btn" class="btn btn-primary">${t1.navCta}</button>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container hero-content">
      <span class="badge">${t1.badge}</span>
      <h1 class="hero-title">${t1.heroTitle}</h1>
      <p class="hero-subtitle">${t1.heroSubtitle}</p>
      <div class="hero-actions">
        <button id="main-demo-btn" class="btn btn-primary btn-large">${t1.tryFree}</button>
        <button class="btn btn-secondary btn-large">${t1.liveDemo}</button>
      </div>
      <div class="counter-box">
        <span>${t1.clickCounter}: </span>
        <strong id="click-counter">0</strong>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="features-section">
    <div class="container">
      <div class="section-heading">
        <h2 class="section-title">${t1.whyTitle}</h2>
        <p class="section-desc">${t1.whySubtitle}</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="card-icon">⚡</div>
          <h3 class="card-title">${t1.f1Title}</h3>
          <p class="card-text">${t1.f1Desc}</p>
        </div>

        <div class="feature-card featured">
          <div class="card-icon">🛡️</div>
          <h3 class="card-title">${t1.f2Title}</h3>
          <p class="card-text">${t1.f2Desc}</p>
        </div>

        <div class="feature-card">
          <div class="card-icon">📊</div>
          <h3 class="card-title">${t1.f3Title}</h3>
          <p class="card-text">${t1.f3Desc}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Call to Action Banner -->
  <section class="cta-section">
    <div class="container cta-container">
      <h2 class="cta-title">${t1.ctaTitle}</h2>
      <p class="cta-desc">${t1.ctaDesc}</p>
      <button class="btn btn-white btn-large">${t1.createAccount}</button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-content">
      <p class="copyright">${t1.copyright}</p>
      <div class="footer-links">
        <a href="#" class="footer-link">${t1.privacy}</a>
        <a href="#" class="footer-link">${t1.terms}</a>
        <a href="#" class="footer-link">${t1.contact}</a>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>`;

  const portfolioHtml = `<!DOCTYPE html>
<html lang="${lang}"${dirAttr}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t2.pageTitle}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, system-ui, sans-serif; }
    body { background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .avatar-box { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4); }
    .name { font-size: 36px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
    .role { color: #38bdf8; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .bio { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 36px; }
    .section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 10px; }
    .project-card { background: #1e293b; border-radius: 12px; padding: 22px; margin-bottom: 20px; border: 1px solid #334155; transition: transform 0.2s; }
    .project-card:hover { transform: translateY(-3px); }
    .project-title { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
    .project-tags { display: flex; gap: 8px; margin: 12px 0; }
    .tag { background: #334155; color: #cbd5e1; font-size: 12px; padding: 4px 10px; border-radius: 20px; }
    .project-desc { color: #94a3b8; font-size: 14px; }
    .contact-btn { display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar-box">🎨</div>
    <h1 class="name">${t2.authorName}</h1>
    <p class="role">${t2.role}</p>
    <p class="bio">${t2.bio}</p>

    <h2 class="section-title">${t2.projectsTitle}</h2>
    
    <div class="project-card">
      <h3 class="project-title">${t2.p1Title}</h3>
      <div class="project-tags">
        ${t2.p1Tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="project-desc">${t2.p1Desc}</p>
    </div>

    <div class="project-card">
      <h3 class="project-title">${t2.p2Title}</h3>
      <div class="project-tags">
        ${t2.p2Tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="project-desc">${t2.p2Desc}</p>
    </div>

    <a href="#" class="contact-btn">${t2.contactBtn}</a>
  </div>
</body>
</html>`;

  return [
    {
      id: 'startup',
      name: t1.name,
      description: t1.description,
      files: [
        {
          name: 'index.html',
          path: 'index.html',
          type: 'html',
          isBinary: false,
          size: startupHtml.length,
          content: startupHtml,
        },
        {
          name: 'style.css',
          path: 'css/style.css',
          type: 'css',
          isBinary: false,
          size: COMMON_STARTUP_CSS.length,
          content: COMMON_STARTUP_CSS,
        },
        {
          name: 'main.js',
          path: 'js/main.js',
          type: 'js',
          isBinary: false,
          size: COMMON_STARTUP_JS.length,
          content: COMMON_STARTUP_JS,
        },
      ],
    },
    {
      id: 'portfolio',
      name: t2.name,
      description: t2.description,
      files: [
        {
          name: 'index.html',
          path: 'index.html',
          type: 'html',
          isBinary: false,
          size: portfolioHtml.length,
          content: portfolioHtml,
        },
      ],
    },
  ];
}

// Backward compatibility export with default Turkish language
export const SAMPLE_PROJECTS: SampleProject[] = getSampleProjects('tr');
