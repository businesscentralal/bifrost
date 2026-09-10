/**
 * Writes one thin agent skill per Bifröst app.
 *
 *   node tools/generate-app-skills.mjs
 *
 * The core skill (static/skills/bifrost-bc-integration/) describes the API
 * itself. Each app then adds message types of its own, and those are already
 * documented page by page under docs/<app>/reference/message-types/, generated
 * from the app's own help codeunits.
 *
 * Rather than copy that catalogue into a skill file — where it would rot the
 * moment a message type is added — each app skill is an index: front matter an
 * agent can match on, when to load it, the rules that are specific to the app,
 * and the list of pages with the path to fetch. The list is read off disk, so
 * regenerating the message-type docs and rerunning this script keeps the two in
 * step.
 *
 * The app's route segment appears in exactly ONE place in each generated file,
 * the `Reference base` line. A rename of the public apps is expected; when it
 * comes, only the `id` in apps.ts and that one line change.
 */
import {readFile, readdir, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** apps.ts is the single source of truth for the family; read it rather than restate it. */
async function readApps() {
  const source = await readFile(path.join(root, 'apps.ts'), 'utf8');
  const list = source.slice(source.indexOf('export const apps'), source.indexOf('/** Cross-app'));
  return [...list.matchAll(/\{id: '([^']+)', title: '([^']+)', appName: '([^']+)'/g)].map(
    ([, id, title, appName]) => ({id, title, appName}),
  );
}

/** Front matter of a docs page, as far as this script needs it. */
async function frontMatter(file) {
  const text = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n');
  const block = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  const field = (name) => block.match(new RegExp(`^${name}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1] ?? '';
  return {title: field('title'), description: field('description')};
}

/**
 * Per-app text that cannot be derived from the docs: when an agent should reach
 * for this app, and the rules that bite in this app specifically. Everything
 * else on the page is generated.
 */
const notes = {
  foundation: {
    when: [
      'you need the exact request and response contract of a Foundation message type — the core skill explains the API and the patterns, these pages give the field-by-field contract of one type;',
      'you are checking whether a message type exists at all before calling it;',
      'you need the setup, secret store, licensing, event or field-restriction reference for the kernel.',
    ],
    rules: [
      'Foundation is the kernel. Every other app in the family depends on it, so its message types are available in every environment that runs any Bifröst app.',
      'Read [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) first. These pages are contracts, not explanations — the envelope, the error order and the field-name rules are in the core skill and are not repeated here.',
    ],
  },
  iceland: {
    when: [
      'the task involves an Icelandic statutory requirement — national registry lookups, the Icelandic chart of accounts, capital income tax, VAT reporting, payroll files or bank claim formats;',
      'a company number (kennitala) has to be validated or resolved to a customer, vendor or contact.',
    ],
    rules: [
      'A kennitala is not a number. Keep it as text — leading zeros are significant and the checksum digit is part of the value.',
      'Icelandic amounts settle in ISK, which has no minor unit. Do not assume two decimals when formatting or rounding.',
    ],
  },
  'iceland-treasury': {
    when: [
      'money moves: claims, payments, direct debits, card transactions, account statements or bank balances against an Icelandic bank;',
      'the task names Landsbankinn, Arion banki, Íslandsbanki, Kvika or the savings banks (Sparisjóðir).',
    ],
    rules: [
      'Each bank is its own message-type family with its own contract. `Landsbankinn.*` and `Arionbanki.*` are not interchangeable, even where the operation reads the same.',
      'These message types move real money and create real claims. Never call a create, send, alter or delete type against a production environment to find out what it does — read the page first.',
      'Bank credentials live in the Bifröst secret store, configured in Business Central. Never pass a certificate, key or password through a message payload, a command line or a log.',
    ],
  },
  'iceland-docex': {
    when: [
      'a document has to leave or enter Business Central electronically — Peppol/BIS 3.0, an e-invoice, an e-receipt or an electronic order;',
      'the task names a document exchange service provider.',
    ],
    rules: [
      'A document exchange is asynchronous end to end. A successful send means the provider accepted the document, not that the recipient did — poll for the delivery state.',
      'Documents carry attachments as base64 inside the payload. Watch the request size limit and use the provider-specific compression types where they exist.',
    ],
  },
  'language-models': {
    when: [
      'a step needs a language model completion inside a playbook, a scheduled task or an integration — that is `LLM.Prompt.Complete`;',
      'you are configuring chat providers or language models for Business Central.',
    ],
    rules: [
      '`LLM.Prompt.Complete` is a one-shot completion: no tools, no bootstrap, no conversation state. If the task needs tools or memory, it belongs in the interactive chat, not in a message type.',
      'API keys are held per user or per language model inside Business Central. Never put a provider key in a message payload.',
      'The model provider is configured in Business Central, not chosen by the caller. Do not hard-code a provider name in integration code.',
    ],
  },
  attachments: {
    when: [
      'a file has to be read from or written to Azure Blob Storage, an Azure File Share or SharePoint through Business Central;',
      'a document attachment has to be offloaded out of the database into storage, or restored from it.',
    ],
    rules: [
      'A large file goes up in chunks, not in one payload. Use the chunked upload session (begin, append, commit, abort) rather than fighting the per-request limit.',
      'Attachments holds no credentials of its own. It references a Business Central file account registered by a connector app; if the account is missing, the fix is in Business Central, not in the call.',
      'Offloading changes where content lives, not what it is. An offloaded attachment still opens normally in the client — do not "restore" one just to read it.',
    ],
  },
  orchestrator: {
    when: [
      'work has to run on a schedule, be retried, or be supervised — Job Queue entries;',
      'several message types have to run in sequence with the output of one feeding the next — a playbook.',
    ],
    rules: [
      'A playbook is declarative. Data moves between steps through the shared workspace using `@path` references; do not try to pass values by constructing the next request yourself.',
      'A scheduled playbook runs under the Job Queue, which means it runs as a background session with its own permissions. Test it as that user, not as yourself.',
      'Every run is logged as an instance with a per-step record of the request, the response and a workspace snapshot. Read the instance before re-running a failed playbook.',
    ],
  },
  timesheets: {
    when: [
      'time entries have to move between Clockify and Business Central — into Job Journal lines or into Time Sheets;',
      'the task drives the Time Sheet lifecycle, or manages Clockify clients, projects, tasks or tags from Business Central.',
    ],
    rules: [
      'The sync deduplicates. Re-running an import does not create duplicates — an entry that changed produces a correction, not a second line. Do not build your own deduplication on top.',
      'Links between a Business Central record and a Clockify object are never deleted, only marked reversed. Treat a reversed link as history, not as an absence.',
      'The Clockify API key lives in IsolatedStorage at company scope. It is never a field value and never appears in a request log.',
    ],
  },
  'subscription-billing': {
    when: [
      'recurring revenue has to be billed — contracts, billing proposals, billing documents or subscription analysis;',
      'a contract has to be previewed before it is invoiced.',
    ],
    rules: [
      'Preview before you create. The proposal and preview message types exist so that a billing run can be inspected before it produces documents.',
      'A billing run is not idempotent. Creating documents twice from the same proposal bills the customer twice.',
    ],
  },
};

const apps = await readApps();
const written = [];

for (const app of apps) {
  const note = notes[app.id];
  if (!note) throw new Error(`no notes for app "${app.id}" — add them to tools/generate-app-skills.mjs`);

  const refDir = path.join(root, 'docs', app.id, 'reference');
  const mtDir = path.join(refDir, 'message-types');

  const messageTypes = [];
  for (const file of (await readdir(mtDir)).filter((f) => f.endsWith('.md')).sort()) {
    const {title} = await frontMatter(path.join(mtDir, file));
    messageTypes.push({name: title || file.replace(/\.md$/, ''), slug: file.replace(/\.md$/, '')});
  }
  messageTypes.sort((a, b) => a.name.localeCompare(b.name, 'en'));

  const otherPages = [];
  for (const file of (await readdir(refDir, {withFileTypes: true}))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()) {
    const {title, description} = await frontMatter(path.join(refDir, file));
    otherPages.push({title, description, slug: file.replace(/\.md$/, '')});
  }

  const {description} = await frontMatter(path.join(root, 'docs', app.id, 'index.md'));

  // Grouped by the first segment of the message type name, which is how the
  // apps are actually organised: Storage.*, Orchestrator.*, Landsbankinn.* …
  const groups = new Map();
  for (const type of messageTypes) {
    const family = type.name.split('.')[0];
    if (!groups.has(family)) groups.set(family, []);
    groups.get(family).push(type);
  }

  const families = [...groups.keys()].sort((a, b) => groups.get(b).length - groups.get(a).length);

  const lines = [
    '---',
    `name: bifrost-${app.id}`,
    'description: >',
    ...wrap(
      `Message types added to the Bifröst API by ${app.appName}. ${description} ` +
        `Load alongside bifrost-bc-integration, which carries the API itself; this skill is the ` +
        `index of what ${app.title} adds — ${messageTypes.length} ` +
        `${messageTypes.length === 1 ? 'message type' : 'message types'} across ` +
        `${families.length} ${families.length === 1 ? 'family' : 'families'} ` +
        `(${families.map((f) => `${f}.*`).join(', ')}).`,
      92,
    ).map((line) => `  ${line}`),
    'license: MIT',
    'metadata:',
    '  version: 1.0.0',
    `  updated: ${new Date().toISOString().slice(0, 10)}`,
    `  app: ${app.appName}`,
    `  messageTypes: ${messageTypes.length}`,
    '  source: https://github.com/businesscentralal/bifrost',
    '---',
    '',
    `# ${app.title} message types`,
    '',
    description,
    '',
    '---',
    '',
    '## When to load this skill',
    '',
    'Load it together with the core skill when:',
    '',
    ...note.when.map((item) => `- ${item}`),
    '',
    `It does not describe the API itself. The envelope, the endpoints, the error order, ` +
      `pagination and \`tableView\` are in [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) ` +
      `and are not repeated here.`,
    '',
    '---',
    '',
    '## Hard rules',
    '',
    ...note.rules.map((item) => `- ${item}`),
    '- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.',
    '- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.',
    '- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.',
    '',
    '---',
    '',
    '## Reference pages',
    '',
    `**Reference base:** \`../../${app.id}/reference/\` — every path below is relative to it.`,
    '',
    'Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.',
    'From the deployed site the same paths resolve against this file’s own URL.',
    '',
  ];

  for (const family of families) {
    const types = groups.get(family);
    lines.push(`### \`${family}.*\` (${types.length})`, '');
    lines.push('| Message type | Page |', '| --- | --- |');
    for (const type of types) lines.push(`| \`${type.name}\` | \`message-types/${type.slug}/\` |`);
    lines.push('');
  }

  if (otherPages.length) {
    lines.push('### Other reference pages', '', '| Page | Path |', '| --- | --- |');
    for (const page of otherPages) lines.push(`| ${page.title} | \`${page.slug}/\` |`);
    lines.push('');
  }

  lines.push(
    '---',
    '',
    '## Related skills',
    '',
    '- [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) — the API itself. Always load this one.',
    ...apps
      .filter((other) => other.id !== app.id)
      .map((other) => `- [bifrost-${other.id}](../bifrost-${other.id}/SKILL.md) — ${other.appName}`),
    '',
  );

  const target = path.join(root, 'static', 'skills', `bifrost-${app.id}`, 'SKILL.md');
  await mkdir(path.dirname(target), {recursive: true});
  const content = `${lines.join('\n')}`;
  await writeFile(target, content, 'utf8');
  written.push({app: app.id, types: messageTypes.length, bytes: content.length});
}

for (const row of written) {
  console.log(`bifrost-${row.app}`.padEnd(32) + `${String(row.types).padStart(4)} message types  ${String(row.bytes).padStart(7)} bytes`);
}
console.log(`\ngenerate-app-skills: ${written.length} skill file(s).`);

/** Soft-wraps a paragraph for YAML block scalars, which are read by humans too. */
function wrap(text, width) {
  const out = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > width) {
      out.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) out.push(line);
  return out;
}
