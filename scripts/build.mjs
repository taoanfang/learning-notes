import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import hljs from "highlight.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "docs");
const config = JSON.parse(fs.readFileSync(path.join(root, "content", "courses.json"), "utf8"));
const owner = "Mingjv Li";
const homepage = "https://taoanfang.github.io/";
const siteUrl = `${homepage}learning-notes/`;
const projectUrl = `${homepage}project/deepseek-ocr-reproduction.html`;
const cvUrl = `${homepage}cv.html`;
const generatedAt = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Singapore",
}).format(new Date());

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language }).value}</code></pre>`;
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
})
  .use(anchor, {
    slugify(value) {
      return value
        .trim()
        .toLowerCase()
        .replace(/[`~!@#$%^&*()+=[\]{};:'",.<>/?\\|]/g, "")
        .replace(/\s+/g, "-");
    },
  })
  .use(mark)
  .use(taskLists, { enabled: false });

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const stripTags = (value = "") =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~=|]/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const readingTime = (text) => {
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const latin = (text.replace(/[\u3400-\u9fff]/g, " ").match(/[A-Za-z0-9_]+/g) || []).length;
  return Math.max(1, Math.ceil(cjk / 360 + latin / 220));
};

const coverImage = (course) => {
  if (!course.cover?.source) return "";
  if (course.cover.kind !== "image" && course.cover.kind !== "external-image") return "";
  return `assets/images/${course.id}/${encodeURI(path.basename(course.cover.source))}`;
};

const courseGroups = {
  cs61b: [
    { title: "Java language foundations", from: 1, to: 10 },
    { title: "Core data structures", from: 11, to: 18 },
    { title: "Complexity and trees", from: 19, to: 20 },
  ],
  python: [
    { title: "Language and control flow", from: 1, to: 5 },
    { title: "Objects, files, and iteration", from: 6, to: 9 },
    { title: "Data analysis tools", from: 10, to: 12 },
  ],
  cs229: [
    { title: "Supervised learning foundations", from: 1, to: 5 },
    { title: "Margins, duality, and kernels", from: 6, to: 7 },
  ],
};

const noteRecords = [];
for (const course of config.courses) {
  course.notes.forEach((note, index) => {
    note.order = index + 1;
    note.course = course;
    note.href = `${course.id}/${note.slug}.html`;
    note.markdown = fs
      .readFileSync(path.join(root, "notes", course.id, `${note.slug}.md`), "utf8")
      .replace(/\r\n/g, "\n");
    note.plain = stripTags(note.markdown).slice(0, 1300);
    note.minutes = readingTime(note.plain);
    noteRecords.push(note);
  });
}

function icon(name, size = 18) {
  return `<i data-lucide="${name}" width="${size}" height="${size}" aria-hidden="true"></i>`;
}

function siteHeader(rootPrefix = "") {
  return `<header class="site-header">
    <div class="header-inner">
      <a class="brand" href="${rootPrefix}index.html" aria-label="Back to notes index">
        <span class="brand-mark">ML</span>
        <span class="brand-text">${owner} · Notes</span>
      </a>
      <button class="menu-button" type="button" data-menu-toggle aria-label="Open navigation" aria-expanded="false">
        ${icon("menu", 20)}
      </button>
      <nav class="site-nav" aria-label="Notes navigation">
        <a href="${homepage}">Home</a>
        <a href="${projectUrl}">Project</a>
        <a class="is-current" href="${rootPrefix}index.html">Notes</a>
        <a href="${cvUrl}">CV</a>
      </nav>
      <div class="header-actions">
        <button class="search-trigger" type="button" data-search-open aria-label="Search notes">
          ${icon("search", 17)}
          <span>Search notes</span>
          <kbd>/</kbd>
        </button>
        <button class="icon-button" type="button" data-theme-toggle aria-label="Toggle color theme">
          ${icon("sun-moon", 18)}
        </button>
        <a class="icon-button" href="https://github.com/taoanfang" target="_blank" rel="noopener" aria-label="Open GitHub profile">
          ${icon("github", 18)}
        </a>
      </div>
    </div>
  </header>`;
}

function searchDialog(rootPrefix = "") {
  return `<dialog class="search-dialog" data-search-dialog>
    <div class="search-shell">
      <div class="search-field">
        ${icon("search", 20)}
        <input type="search" placeholder="Search concepts, courses, or code" aria-label="Search notes" data-search-input autocomplete="off">
        <button class="icon-button" type="button" data-search-close aria-label="Close search">${icon("x", 18)}</button>
      </div>
      <div class="search-meta" data-search-meta>Start typing to search</div>
      <div class="search-results" data-search-results></div>
    </div>
  </dialog>`;
}

function siteFooter(rootPrefix = "") {
  return `<footer class="site-footer">
    <div class="footer-inner">
      <div>
        <strong>${owner}</strong>
        <p>Course notes · Supporting archive for the personal homepage</p>
      </div>
      <div class="footer-meta">
        <a href="${homepage}">Personal homepage</a>
        <a href="${projectUrl}">Project</a>
        <a href="${cvUrl}">CV</a>
        <span>Updated ${escapeHtml(generatedAt)}</span>
      </div>
    </div>
  </footer>`;
}

function pageShell({ title, description, rootPrefix, bodyClass, content }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${owner}">
  <meta name="color-scheme" content="light dark">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(`${title} · ${owner} Notes`)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${siteUrl}">
  <title>${escapeHtml(`${title} · ${owner} Notes`)}</title>
  <link rel="icon" href="${rootPrefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${rootPrefix}assets/vendor/katex.min.css">
  <link rel="stylesheet" href="${rootPrefix}assets/styles.css">
  <script>
    (() => {
      const saved = localStorage.getItem("notes-theme");
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.dataset.theme = saved || (dark ? "dark" : "light");
    })();
  </script>
</head>
<body class="${bodyClass}" data-root="${rootPrefix}">
  <a class="skip-link" href="#main-content">跳到正文</a>
  ${siteHeader(rootPrefix)}
  ${content}
  ${siteFooter(rootPrefix)}
  ${searchDialog(rootPrefix)}
  <script src="${rootPrefix}assets/vendor/lucide.min.js"></script>
  <script src="${rootPrefix}assets/vendor/katex.min.js"></script>
  <script src="${rootPrefix}assets/vendor/auto-render.min.js"></script>
  <script src="${rootPrefix}assets/app.js"></script>
</body>
</html>`;
}

function courseCard(course, rootPrefix = "") {
  const cover = coverImage(course);
  const visual = cover
    ? `<div class="course-visual course-visual-image"><img src="${rootPrefix}${cover}" alt="${escapeHtml(course.cover.alt || course.title)}" loading="eager"></div>`
    : `<div class="course-visual course-visual-code"><div class="code-dots"><i></i><i></i><i></i></div><pre><code>${escapeHtml(course.cover?.code || "")}</code></pre></div>`;
  return `<article class="course-card accent-${course.accent}">
    ${visual}
    <div class="course-card-body">
      <div class="course-kicker"><span>${escapeHtml(course.eyebrow)}</span><span>${course.notes.length} notes</span></div>
      <h2><a href="${rootPrefix}${course.id}/index.html">${escapeHtml(course.title)}</a></h2>
      <p class="course-subtitle">${escapeHtml(course.subtitle)}</p>
      <p class="course-description">${escapeHtml(course.description)}</p>
      <a class="text-link" href="${rootPrefix}${course.id}/index.html">Open course ${icon("arrow-up-right", 16)}</a>
    </div>
  </article>`;
}

function noteGroups(course) {
  return courseGroups[course.id] || [{ title: "All notes", from: 1, to: course.notes.length }];
}

function notesHome() {
  const totalMinutes = noteRecords.reduce((sum, note) => sum + note.minutes, 0);
  const cards = config.courses.map((course) => courseCard(course)).join("");
  const content = `<main id="main-content" class="notes-library-page">
    <header class="notes-library-hero">
      <div class="notes-library-inner">
        <a class="back-link" href="${homepage}">${icon("arrow-left", 15)} Back to personal homepage</a>
        <p class="eyebrow">Supporting Archive · ${noteRecords.length} Notes</p>
        <h1>Learning Notes</h1>
        <p>Course notes are a supporting study record for the personal homepage. They are separate from the project and CV pages.</p>
        <div class="notes-library-meta">
          <span>${config.courses.length} courses</span>
          <span>${noteRecords.length} notes</span>
          <span>${totalMinutes} min reading</span>
          <button class="search-trigger compact" type="button" data-search-open>${icon("search", 16)} Search notes</button>
        </div>
      </div>
    </header>
    <section class="course-section notes-library-content"><div class="course-grid">${cards}</div></section>
  </main>`;
  return pageShell({
    title: "Learning Notes",
    description: "Supporting course notes in data structures, Python, and machine learning.",
    rootPrefix: "",
    bodyClass: "notes-library-page",
    content,
  });
}

function coursePage(course) {
  const groups = noteGroups(course)
    .map((group) => {
      const notes = course.notes.filter((note) => note.order >= group.from && note.order <= group.to);
      return `<section class="course-group">
        <h2>${escapeHtml(group.title)}</h2>
        <div class="note-list">${notes
          .map(
            (note) => `<a class="note-row" href="${note.slug}.html">
              <span class="note-number">${String(note.order).padStart(2, "0")}</span>
              <span class="note-main"><strong>${escapeHtml(note.title)}</strong><small>${escapeHtml(note.summary)}</small></span>
              <span class="note-time">${note.minutes} min</span>
              ${icon("arrow-right", 17)}
            </a>`,
          )
          .join("")}</div>
      </section>`;
    })
    .join("");
  const minutes = course.notes.reduce((sum, note) => sum + note.minutes, 0);
  const content = `<main id="main-content" class="course-page accent-${course.accent}">
    <header class="page-hero course-hero">
      <div class="page-hero-inner">
        <div>
          <a class="back-link" href="../index.html">${icon("arrow-left", 15)} All notes</a>
          <p class="eyebrow">${escapeHtml(course.eyebrow)}</p>
          <h1>${escapeHtml(course.title)}</h1>
          <p class="page-subtitle">${escapeHtml(course.subtitle)}</p>
          <p class="page-intro">${escapeHtml(course.description)}</p>
        </div>
        <div class="course-summary">
          <span><strong>${course.notes.length}</strong> notes</span>
          <span><strong>${minutes}</strong> min</span>
          <button class="search-trigger compact" type="button" data-search-open>${icon("search", 16)} Search notes</button>
        </div>
      </div>
    </header>
    <div class="course-content">${groups}</div>
  </main>`;
  return pageShell({
    title: `${course.title} · ${course.subtitle}`,
    description: course.description,
    rootPrefix: "../",
    bodyClass: `course-index-page accent-${course.accent}`,
    content,
  });
}

function notePage(note, course) {
  let markdown = note.markdown.replace(/^#\s+.+\n+/, "").replace(/\(\.\.\/\.\.\/docs\/assets\//g, "(../assets/");
  const env = {};
  const tokens = md.parse(markdown, env);
  const headings = tokens
    .filter((token) => token.type === "heading_open" && Number(token.tag.slice(1)) <= 3)
    .map((token) => {
      const inline = tokens[tokens.indexOf(token) + 1];
      return {
        level: Number(token.tag.slice(1)),
        id: token.attrGet("id"),
        text: stripTags(inline?.content || "")
          .replace(/\$[^$]+\$/g, "")
          .replace(/\\\([^)]*\\\)/g, "")
          .trim(),
      };
    });
  const html = md.renderer.render(tokens, md.options, env);
  const toc = headings
    .filter((heading) => heading.level === 2 || heading.level === 3)
    .map((heading) => `<a class="toc-level-${heading.level}" href="#${escapeHtml(heading.id)}">${escapeHtml(heading.text)}</a>`)
    .join("");
  const previous = course.notes[note.order - 2];
  const next = course.notes[note.order];
  const group = noteGroups(course).find((item) => note.order >= item.from && note.order <= item.to);
  const sidebar = course.notes
    .map(
      (item) => `<a class="${item.slug === note.slug ? "is-current" : ""}" href="${item.slug}.html">
        <span>${String(item.order).padStart(2, "0")}</span>${escapeHtml(item.title)}
      </a>`,
    )
    .join("");
  const prevNext = `<nav class="prev-next" aria-label="Adjacent notes">
    ${
      previous
        ? `<a class="prev" href="${previous.slug}.html"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a>`
        : `<a class="prev disabled"><span>Previous</span><strong>First note</strong></a>`
    }
    ${
      next
        ? `<a class="next" href="${next.slug}.html"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>`
        : `<a class="next disabled"><span>Next</span><strong>End of course</strong></a>`
    }
  </nav>`;
  const content = `<div class="reading-progress" data-reading-progress></div>
  <main id="main-content" class="note-page accent-${course.accent}">
    <div class="note-layout">
      <aside class="course-sidebar" data-course-sidebar>
        <div class="sidebar-heading"><a href="index.html">${escapeHtml(course.title)}</a><span>${escapeHtml(course.subtitle)}</span></div>
        <nav aria-label="Course notes">${sidebar}</nav>
      </aside>
      <article class="note-article">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="${homepage}">Home</a><span>/</span><a href="../index.html">Notes</a><span>/</span><a href="index.html">${escapeHtml(course.title)}</a><span>/</span><span>${escapeHtml(group?.title || "Course")}</span>
        </nav>
        <header class="note-hero">
          <p class="eyebrow">${escapeHtml(course.title)} · ${escapeHtml(group?.title || "Course notes")}</p>
          <h1>${escapeHtml(note.title)}</h1>
          <p class="note-summary">${escapeHtml(note.summary)}</p>
          <div class="note-meta">
            <span>${icon("clock-3", 15)} ${note.minutes} min</span>
            <span>${note.order} / ${course.notes.length}</span>
            <button type="button" data-course-nav-toggle>${icon("list", 15)} Course notes</button>
          </div>
        </header>
        <div class="article-body">${html}</div>
        ${prevNext}
      </article>
      <aside class="toc-sidebar"><strong>On this page</strong><nav aria-label="On this page">${toc || '<span class="muted">Short note</span>'}</nav></aside>
    </div>
  </main>`;
  return pageShell({
    title: note.title,
    description: note.summary,
    rootPrefix: "../",
    bodyClass: `note-detail-page accent-${course.accent}`,
    content,
  });
}

function writeFile(relativePath, content) {
  const target = path.join(output, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function copyStaticAssets() {
  fs.cpSync(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
  fs.mkdirSync(path.join(output, "assets", "vendor", "fonts"), { recursive: true });
  fs.copyFileSync(path.join(root, "node_modules", "lucide", "dist", "umd", "lucide.min.js"), path.join(output, "assets", "vendor", "lucide.min.js"));
  fs.copyFileSync(path.join(root, "node_modules", "katex", "dist", "katex.min.js"), path.join(output, "assets", "vendor", "katex.min.js"));
  fs.copyFileSync(path.join(root, "node_modules", "katex", "dist", "contrib", "auto-render.min.js"), path.join(output, "assets", "vendor", "auto-render.min.js"));
  fs.copyFileSync(path.join(root, "node_modules", "katex", "dist", "katex.min.css"), path.join(output, "assets", "vendor", "katex.min.css"));
  fs.cpSync(path.join(root, "node_modules", "katex", "dist", "fonts"), path.join(output, "assets", "vendor", "fonts"), { recursive: true });
}

const searchIndex = noteRecords.map((note) => ({
  title: note.title,
  course: note.course.title,
  summary: note.summary,
  href: note.href,
  text: note.plain,
}));

copyStaticAssets();
writeFile("index.html", notesHome());
for (const course of config.courses) {
  writeFile(`${course.id}/index.html`, coursePage(course));
  for (const note of course.notes) {
    writeFile(`${course.id}/${note.slug}.html`, notePage(note, course));
  }
}
writeFile("assets/search-index.json", JSON.stringify(searchIndex));
writeFile(".nojekyll", "");

console.log(`Built ${noteRecords.length} note pages in docs`);
