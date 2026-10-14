import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const source = readFileSync(new URL('./check-docs.mjs', import.meta.url), 'utf8');
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 16);
const protectedNames = [
  'd94df5d992169251', 'a046c4f0a310ac2f', 'a0a446ad370b830c', '17214a07d5b7578b',
  '4e335a9a47a11647', '3381590a4e4bd9ff', 'a6ad3891ba67c714', '63874763be005259',
  'e3fb45974f88dc34', '6f3e4d7fd1f5e471', 'b0dd3a2d68522b2d', '2756636f5ac88609', '90a45c6dcbb66d38',
  '9a91356d3b648e62',
];
const protectedRoutes = [
  '9eb5c59d70089e53', '97a37556dc257040', 'b25920b5f0013a9f', '3930e671c9e40dee',
  '11376b7e2acf0c93', 'dc0d200aaebbf548', 'b11a85b296a90afc',
];

// Run the actual CLI against isolated content; fixtures never enter the public docs tree.
function check(content, file = 'docs/attachments/fixture.md', checker = source) {
  const root = mkdtempSync(path.join(tmpdir(), 'bifrost-ip-boundary-'));
  try {
    mkdirSync(path.join(root, 'tools'), {recursive: true});
    writeFileSync(path.join(root, 'tools/check-docs.mjs'), checker);
    mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
    writeFileSync(path.join(root, file), content);
    const result = spawnSync(process.execPath, [path.join(root, 'tools/check-docs.mjs')], {encoding: 'utf8'});
    assert.equal(result.error, undefined);
    return {status: result.status, output: result.stdout + result.stderr};
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
}

test('Attachments names are allowed in English and Icelandic content, case insensitively', () => {
  for (const file of ['docs/attachments/fixture.md', 'help/attachments/fixture.md',
    'i18n/is-IS/docusaurus-plugin-content-docs-attachments/current/fixture.md',
    'i18n/is-IS/docusaurus-plugin-content-docs-help-attachments/current/fixture.md']) {
    assert.equal(check('Bifrost Attachments · Bifröst Attachments · ATTACHMENTS', file).status, 0, file);
  }
});

test('Attachments docs and help links are allowed', () => {
  assert.equal(check('[Overview](/attachments/) [Setup](/help/attachments/storage-setup/)').status, 0);
});

test('the complete unpublished hash inventory is retained', () => {
  const values = (name) => [...source.match(new RegExp('const ' + name + ' = new Set\\((\\[[\\s\\S]*?\\])\\);'))[1].matchAll(/'([a-f0-9]{16})'/g)].map((m) => m[1]);
  assert.deepEqual(values('UNPUBLISHED_NAME_HASHES'), protectedNames);
  assert.deepEqual(values('UNPUBLISHED_ROUTE_HASHES'), protectedRoutes);
});


test('the documentation exception is limited to Attachments names and route', () => {
  const names = source.match(/const DOCUMENTATION_NAME_EXCEPTIONS = new Set\(\s*(\[[\s\S]*?\])\.map\(shortHash\),?\s*\);/)[1];
  const routes = source.match(/const DOCUMENTATION_ROUTE_EXCEPTIONS = new Set\((\[[^\n]+\])\);/)[1];
  assert.deepEqual([...names.matchAll(/'([^']+)'/g)].map((m) => m[1]), ['attachments', 'bifrost attachments']);
  assert.deepEqual([...routes.matchAll(/shortHash\('([^']+)'\)/g)].map((m) => m[1]), ['attachments']);
});

test('every other unpublished name still blocks a line that also mentions Attachments', () => {
  const exceptions = new Set(['attachments', 'bifrost attachments'].map(hash));
  for (const protectedHash of protectedNames.filter((h) => !exceptions.has(h))) {
    // Substitute a synthetic name to exercise hashed matching without disclosing private app names.
    const checker = source.replace("'" + protectedHash + "'", "'" + hash('unpublished fixture') + "'");
    const result = check('Bifröst Attachments and Unpublished Fixture', undefined, checker);
    assert.equal(result.status, 1, protectedHash);
    assert.match(result.output, /\[unpublished app\]/);
  }
});

test('every other unpublished route still blocks docs and help links alongside Attachments', () => {
  for (const protectedHash of protectedRoutes.filter((h) => h !== hash('attachments'))) {
    const checker = source.replace("'" + protectedHash + "'", "'" + hash('unpublished-fixture') + "'");
    for (const prefix of ['', 'help/']) {
      const result = check('[Attachments](/attachments/) [Other](/' + prefix + 'unpublished-fixture/page/)', undefined, checker);
      assert.equal(result.status, 1, protectedHash + prefix);
      assert.match(result.output, /\[unpublished app\]/);
    }
  }
});

test('Attachments pages still reject infrastructure vocabulary', () => {
  const result = check('Bifröst Attachments uses Key Vault');
  assert.equal(result.status, 1);
  assert.match(result.output, /\[Key Vault\]/);
});

test('Attachments pages still reject message-type names', () => {
  const result = check('Bifröst Attachments: Private.Entity.Read');
  assert.equal(result.status, 1);
  assert.match(result.output, /\[message type name\]/);
});

test('Attachments help must not acquire an index page', () => {
  const result = check('Bifröst Attachments', 'help/attachments/index.md');
  assert.equal(result.status, 1);
  assert.match(result.output, /\[help index page\]/);
});
