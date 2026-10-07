#!/usr/bin/env node
/**
 * Checks the published site after a deploy: every page of the agreed structure answers, in both
 * languages, with the right title and without Docusaurus' "did not load properly" (wrong baseUrl)
 * screen; the old github.io addresses still lead to the new domain; llms.txt and apps.json answer.
 *
 * Run after GitHub has deployed main:   npm run check:live
 * Another address:                      SITE=https://example.org npm run check:live
 */
const SITE = (process.env.SITE ?? 'https://docs.bifrost.origo.is').replace(/\/$/, '');
const OLD = 'https://businesscentralal.github.io/bifrost';

const pages = [
  ['', 'Bifröst'],
  ['setup/', 'Set it up'],
  ['setup/get-the-app/', 'Get the app'],
  ['setup/business-central/', 'Set up Business Central'],
  ['setup/consent/', 'Consent once'],
  ['setup/data-setup/', 'Set up your data'],
  ['setup/first-call/', 'Check it and invite your users'],
  ['setup/pick-your-assistant/', 'Pick your assistant'],
  ['setup/connect-your-ai/', 'Connect your assistant'],
  ['setup/first-question/', 'Ask your first question'],
  ['try-it-out/', 'Try it out'],
  ['documentation/how-it-works/', 'How Bifröst works'],
  ['documentation/end-customers/users/', 'Using Bifröst'],
  ['documentation/end-customers/administrators/', 'Running Bifröst'],
  ['documentation/end-customers/permissions/', 'Permission sets'],
  ['documentation/end-customers/data-access/', 'agents read and change'],
  ['documentation/end-customers/developers/', 'developers'],
  ['price/', 'Price'],
  ['licensing/', 'Licensing'],
  ['licensing/eula/', 'Terms of Use'],
  ['licensing/privacy/', 'Privacy'],
  ['foundation/', 'Foundation'],
  ['apps/', 'Apps'],
];

let failed = 0;
async function check(url, expect, label = url) {
  try {
    const res = await fetch(url, {redirect: 'follow'});
    const html = await res.text();
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) ?? [])[1] ?? '';
    const broken = /did not load properly|baseUrl configuration/i.test(html);
    const wrongBase = /href="\/bifrost\//.test(html) && !SITE.endsWith('/bifrost');
    const ok = res.ok && !broken && !wrongBase && (!expect || title.toLowerCase().includes(expect.toLowerCase()) || html.includes(expect));
    if (!ok) failed++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${res.status} ${label}${title ? `  "${title}"` : ''}${broken ? '  (did not load: baseUrl)' : ''}${wrongBase ? '  (links still /bifrost/)' : ''}${res.url !== url ? `  → ${res.url}` : ''}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ---  ${label}  ${e.message}`);
  }
}

console.log(`Checking ${SITE}\n`);
for (const locale of ['en-us', 'is-is']) {
  for (const [path, title] of pages) {
    // Icelandic titles differ; for is-is only status and the baseUrl problems are checked.
    await check(`${SITE}/${locale}/${path}`, locale === 'en-us' ? title : undefined);
  }
}
console.log('');
await check(`${SITE}/`, undefined, `${SITE}/ (root)`);
await check(`${SITE}/llms.txt`, 'Bifröst');
await check(`${SITE}/apps.json`, 'foundation');
await check(`${SITE}/en-us/documentation/`, undefined, 'old /documentation/ (redirect to How it works)');
await check(`${OLD}/en-us/setup/`, undefined, 'old github.io address (forwarding)');

console.log(`\ncheck-live: ${failed} failed.`);
process.exit(failed ? 1 : 0);
