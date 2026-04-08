import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/drew0/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = './temporary screenshots';
if (!existsSync(screenshotDir)) mkdirSync(screenshotDir);

const existing = existsSync(screenshotDir)
  ? readdirSync(screenshotDir).filter(f => f.endsWith('.png'))
  : [];
const nums = existing
  .map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? '0'))
  .filter(n => !isNaN(n));
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;
const outputPath = join(screenshotDir, filename);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/drew0/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto(url, { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
