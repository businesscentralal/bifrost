#!/usr/bin/env node
/**
 * Guards the site structure agreed on 07.10.2026 (see bifrost-support/DOCUMENTATION-RULES.md):
 *
 *   Menu:      Set it up · Try it out · How it works · Price · Licensing | Apps
 *   Set it up: Overview · For your company (steps 1–5) · For each user (steps 1–3)
 *   How it works: How Bifröst works · Users · Administrators (+ its topics) · Developers
 *
 * It fails (exit 1) when the structure changes: a menu item added, removed or moved, a page of the
 * agreed structure missing in English or Icelandic, the "By role" level or the Guides overview
 * coming back, "message type" on a customer page, or "licence" spelled the British way. It warns
 * (exit 0) when a fact that has one owner page is written out somewhere else, so drift is visible
 * before it is a problem.
 *
 * Changing the structure on purpose is fine: change it here in the same pull request, so the change
 * is visible and reviewed. Run: npm run check:structure
 */
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';

const errors = [];
const warnings = [];
const read = (p) => readFileSync(p, 'utf8');
const IS = (section) => `i18n/is-IS/docusaurus-plugin-content-docs-${section}/current`;

// 1. The menu, left to right.
const menu = ['Set it up', 'Try it out', 'How it works', 'Price', 'Licensing'];
const config = read('docusaurus.config.ts');
const navbar = config.slice(config.indexOf('navbar:'), config.indexOf('footer:'));
const leftLabels = [...navbar.matchAll(/label:\s*buildLocale === 'is-IS' \? '[^']*' : '([^']+)'[^}]*position: 'left'/g)].map((m) => m[1]);
if (leftLabels.join(' | ') !== menu.join(' | ')) {
  errors.push(`Menu (left) is "${leftLabels.join(' | ')}", agreed: "${menu.join(' | ')}" (docusaurus.config.ts navbar).`);
}

// 2. The pages of the agreed structure, in both languages.
const pages = {
  setup: ['index.md', 'company/_category_.json', 'company/get-the-app.md', 'company/business-central.md',
    'company/consent.md', 'company/data-setup.md', 'company/first-call.md', 'users/_category_.json',
    'users/pick-your-assistant.md', 'users/connect-your-ai.md', 'users/first-question.md'],
  documentation: ['how-it-works.md', 'users.md', 'developers.md', 'administrators/_category_.json',
    'administrators/administrators.md', 'administrators/permissions.md', 'administrators/data-access.md'],
};
for (const [section, files] of Object.entries(pages)) {
  for (const file of files) {
    if (!existsSync(`docs/${section}/${file}`)) errors.push(`Missing page: docs/${section}/${file}`);
    if (file.endsWith('.md') && !existsSync(`${IS(section)}/${file}`)) {
      errors.push(`Missing Icelandic page: ${IS(section)}/${file}`);
    }
  }
}
const label = (p) => (existsSync(p) ? JSON.parse(read(p)).label : undefined);
if (label('docs/setup/company/_category_.json') !== 'For your company') errors.push('Set it up: the first group must be "For your company".');
if (label('docs/setup/users/_category_.json') !== 'For each user') errors.push('Set it up: the second group must be "For each user".');
if (label('docs/documentation/administrators/_category_.json') !== 'Administrators') errors.push('How it works: the Administrators group is missing or renamed.');

// 3. What must not come back.
for (const gone of ['docs/documentation/index.md', 'docs/documentation/end-customers', 'docs/setup/connect-your-ai.md']) {
  if (existsSync(gone)) errors.push(`Removed on purpose, now back: ${gone} (the "By role" level, the Guides overview or the mixed setup page).`);
}

// 4. Words. Customer pages say "domain" and "operation"; "message type" is for developers.
function mdFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? mdFiles(p) : p.endsWith('.md') ? [p] : [];
  });
}
const customerPages = [...mdFiles('docs/setup'), ...mdFiles('docs/try-it-out'),
  'docs/documentation/users.md', ...mdFiles('docs/documentation/administrators')];
for (const p of customerPages) {
  const lines = read(p).split('\n');
  lines.forEach((line, i) => {
    if (/message types?\b/i.test(line) && !/`[A-Z][\w.]+`/.test(line)) {
      warnings.push(`${p}:${i + 1}: "message type" on a customer page; say "operation" (developers excepted).`);
    }
  });
}
for (const p of mdFiles('docs').filter((f) => !f.endsWith('eula.md'))) {
  read(p).split('\n').forEach((line, i) => {
    const text = line.replace(/\{#[^}]+\}/g, '');
    if (/\blicence\b/i.test(text)) errors.push(`${p}:${i + 1}: "licence"; write "license".`);
  });
}

// 5. One owner per fact: warn when an owned fact is written out on another page.
const owned = [
  {fact: 'sandbox rate-limit numbers', re: /\b(5,000|10,000|50,000|100,000)\b.*(24 hours|per day)/i, owner: 'docs/licensing/rate-limits.md'},
  {fact: 'trial size', re: /1,000 user messages and 1,000 app/i, owner: 'docs/setup/company/business-central.md'},
  {fact: 'the posting gate list', re: /BIFROST FA Post ori.*BIFROST Job Post ori/, owner: 'docs/documentation/administrators/permissions.md'},
  {fact: 'Field Access types None and Bypass', re: /\*\*Bypass\*\*/, owner: 'docs/documentation/administrators/data-access.md'},
];
for (const {fact, re, owner} of owned) {
  for (const p of mdFiles('docs')) {
    if (p.replace(/\\/g, '/') === owner) continue;
    read(p).split('\n').forEach((line, i) => {
      if (re.test(line)) warnings.push(`${p}:${i + 1}: ${fact} is owned by ${owner}; link there instead.`);
    });
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`check-structure: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
