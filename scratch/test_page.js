import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = fs.existsSync("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe")
  ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const logs = [];
  const errors = [];

  page.on('console', msg => logs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));

  console.log('Navigating to http://localhost:8081/3d-experience...');
  await page.goto('http://localhost:8081/3d-experience', { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait 4 seconds for model loading and rendering
  await new Promise(r => setTimeout(r, 4000));

  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    return {
      width: canvas.width,
      height: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight,
      isWebGL: !!canvas.getContext('webgl2') || !!canvas.getContext('webgl')
    };
  });

  console.log('Canvas element info:', canvasInfo);
  console.log('Total console logs count:', logs.length);
  console.log('Total page errors count:', errors.length);

  const screenshotPath = path.resolve('scratch/final_page_render.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
}

main().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
