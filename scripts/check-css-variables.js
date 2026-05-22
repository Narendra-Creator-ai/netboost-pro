#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse tailwind.config.cjs for CSS variables
const tailwindConfigPath = path.join(__dirname, '../tailwind.config.cjs');
const indexCssPath = path.join(__dirname, '../src/index.css');

if (!fs.existsSync(tailwindConfigPath) || !fs.existsSync(indexCssPath)) {
  console.log('✅ CSS variables check skipped (files not found)');
  process.exit(0);
}

const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
const indexCss = fs.readFileSync(indexCssPath, 'utf-8');

// Extract all var(--variable-name) patterns from tailwind config
const varPattern = /var\(--([a-zA-Z0-9\-]+)\)/g;
const referencedVars = new Set();
let match;

while ((match = varPattern.exec(tailwindConfig)) !== null) {
  referencedVars.add(`--${match[1]}`);
}

// Extract all defined CSS variables from index.css
const cssVarPattern = /(--[a-zA-Z0-9\-]+)\s*:/g;
const definedVars = new Set();

while ((match = cssVarPattern.exec(indexCss)) !== null) {
  definedVars.add(match[1]);
}

// Find undefined variables
const undefinedVars = Array.from(referencedVars).filter(v => !definedVars.has(v));

if (undefinedVars.length > 0) {
  console.error('❌ Undefined CSS variables found in tailwind.config.cjs:');
  undefinedVars.forEach(v => console.error(`   ${v}`));
  console.error('\nAdd these variables to src/index.css');
  process.exit(1);
} else {
  console.log('✅ All CSS variables in tailwind.config.cjs are defined');
  process.exit(0);
}
