import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

// 1. Ensure 404.html exists in dist for GitHub Pages SPA direct route refreshes
const indexHtmlPath = path.join(distDir, 'index.html');
const notFoundHtmlPath = path.join(distDir, '404.html');
if (fs.existsSync(indexHtmlPath)) {
  fs.copyFileSync(indexHtmlPath, notFoundHtmlPath);
  console.log('✓ Created dist/404.html for GitHub Pages direct route refreshes');
}

// 2. Ensure CNAME exists in dist for custom domain khanelectrics.in
const publicCname = path.join(publicDir, 'CNAME');
const rootCname = path.join(rootDir, 'CNAME');
const distCname = path.join(distDir, 'CNAME');

if (fs.existsSync(rootCname) && !fs.existsSync(publicCname)) {
  fs.copyFileSync(rootCname, publicCname);
}
if (fs.existsSync(publicCname)) {
  fs.copyFileSync(publicCname, distCname);
  console.log('✓ Verified dist/CNAME for custom domain khanelectrics.in');
}
