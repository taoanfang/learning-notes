const root = document.body.dataset.root || "";
const searchDialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");
const searchMeta = document.querySelector("[data-search-meta]");
let searchIndexPromise;

window.lucide?.createIcons();

function getSearchIndex() {
  searchIndexPromise ??= fetch(`${root}assets/search-index.json`).then((response) => {
    if (!response.ok) throw new Error("Search index failed to load");
    return response.json();
  });
  return searchIndexPromise;
}

function scoreItem(item, terms) {
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();
  const text = item.text.toLowerCase();
  return terms.reduce((score, term) => {
    if (title.includes(term)) score += 8;
    if (summary.includes(term)) score += 4;
    if (text.includes(term)) score += 1;
    return score;
  }, 0);
}

async function renderSearch(query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    searchMeta.textContent = "Start typing to search";
    searchResults.innerHTML = "";
    return;
  }
  const index = await getSearchIndex();
  const matches = index
    .map((item) => ({ item, score: scoreItem(item, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  searchMeta.textContent = matches.length
    ? `${matches.length} matching note${matches.length === 1 ? "" : "s"}`
    : "No matching notes";
  searchResults.innerHTML = matches
    .map(
      ({ item }) => `<a class="search-result" href="${root}${item.href}">
        <span>${item.course}</span>
        <strong>${item.title}</strong>
        <small>${item.summary}</small>
      </a>`,
    )
    .join("");
}

function openSearch() {
  if (!searchDialog?.showModal) return;
  if (!searchDialog.open) searchDialog.showModal();
  requestAnimationFrame(() => searchInput?.focus());
}

document.querySelectorAll("[data-search-open]").forEach((button) => {
  button.addEventListener("click", openSearch);
});

document.querySelector("[data-search-close]")?.addEventListener("click", () => searchDialog.close());
searchDialog?.addEventListener("click", (event) => {
  if (event.target === searchDialog) searchDialog.close();
});
searchInput?.addEventListener("input", (event) => {
  renderSearch(event.target.value).catch(() => {
    searchMeta.textContent = "Search index failed to load";
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    openSearch();
  }
  if (event.key === "Escape" && searchDialog?.open) searchDialog.close();
});

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("notes-theme", next);
});

const menuButton = document.querySelector("[data-menu-toggle]");
menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelector("[data-course-nav-toggle]")?.addEventListener("click", () => {
  document.body.classList.toggle("course-nav-open");
});

document.querySelectorAll(".article-body pre").forEach((pre) => {
  const button = document.createElement("button");
  button.className = "copy-code";
  button.type = "button";
  button.setAttribute("aria-label", "Copy code");
  button.innerHTML = '<i data-lucide="copy" width="15" height="15"></i><span>Copy</span>';
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(pre.querySelector("code")?.textContent || "");
    button.querySelector("span").textContent = "Copied";
    setTimeout(() => {
      button.querySelector("span").textContent = "Copy";
    }, 1400);
  });
  pre.append(button);
});
window.lucide?.createIcons();

if (window.renderMathInElement) {
  renderMathInElement(document.querySelector(".article-body") || document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
    strict: false,
  });
}

const progress = document.querySelector("[data-reading-progress]");
if (progress) {
  const updateProgress = () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, doc.scrollTop / total) : 0})`;
  };
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

const tocLinks = [...document.querySelectorAll(".toc-sidebar a")];
const tocHeadings = tocLinks
  .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
  .filter(Boolean);
if (tocHeadings.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      tocLinks.forEach((link) => link.classList.remove("is-active"));
      tocLinks.find((link) => link.hash === `#${visible[0].target.id}`)?.classList.add("is-active");
    },
    { rootMargin: "-10% 0px -75% 0px" },
  );
  tocHeadings.forEach((heading) => observer.observe(heading));
}

const prefetchSearch = () => getSearchIndex().catch(() => {});
if ("requestIdleCallback" in window) {
  window.requestIdleCallback(prefetchSearch, { timeout: 2500 });
} else {
  window.setTimeout(prefetchSearch, 1200);
}

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
