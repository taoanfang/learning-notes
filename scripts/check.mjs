import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docs = path.join(root, "docs");
const work = path.join(root, "work");
const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:4175";
const browserPath =
  process.env.BROWSER_PATH ||
  (fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe");

fs.mkdirSync(work, { recursive: true });
const failures = [];

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => failures.push(error.message));

async function inspect(url, screenshot, katex = false) {
  await page.goto(`${baseUrl}${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(700);
  if (katex) await page.waitForFunction(() => document.querySelectorAll(".katex").length > 0);
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    brokenImages: [...document.images].filter((image) => image.complete && !image.naturalWidth).map((image) => image.src),
    headings: document.querySelectorAll("h1").length,
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 1) failures.push(`${url} overflows horizontally`);
  if (metrics.brokenImages.length) failures.push(`${url} has broken images: ${metrics.brokenImages.join(", ")}`);
  if (metrics.headings !== 1) failures.push(`${url} should have one h1, found ${metrics.headings}`);
  await page.screenshot({ path: path.join(work, screenshot) });
}

await inspect("/", "notes-home.png");
await inspect("/cs61b/", "notes-course.png");
await inspect("/cs229/01-linear-regression.html", "notes-detail.png", true);

await page.setViewportSize({ width: 390, height: 844 });
await inspect("/", "notes-home-mobile.png");
await inspect("/python/10-numpy-matplotlib.html", "notes-detail-mobile.png");

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Checked notes pages at desktop and mobile sizes.");
}
