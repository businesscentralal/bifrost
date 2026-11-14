import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyReleasedCopy, releasedCopyErrors} from './lib/versions-file.mjs';

const entry = () => ({
  schemaVersion: 1,
  updated: '2026-10-31',
  apps: [
    {
      appId: '7505e808-6e52-4b96-a328-82573391297a',
      name: 'Bifrost Foundation',
      version: '28.0.10.632',
      released: '2026-10-28',
      releaseNotes: 'https://docs.bifrost.origo.is/en-us/foundation/release-notes',
      brief: 'Bifrost bridge foundation for Business Central',
      description: 'Existing description.',
    },
  ],
});

const appJson = {
  id: '7505e808-6e52-4b96-a328-82573391297a',
  brief: 'Bifröst Iceland - Icelandic message types',
  description: 'Copied exactly, including punctuation.',
};

test('a complete entry passes and schemaVersion 1 is required', () => {
  assert.deepEqual(releasedCopyErrors(entry()), []);
  const broken = entry();
  broken.schemaVersion = 2;
  assert.match(releasedCopyErrors(broken).join('\n'), /schemaVersion must stay 1/);
});

test('brief and description must be present and non-empty on every entry', () => {
  const missing = entry();
  delete missing.apps[0].brief;
  missing.apps[0].description = '   ';
  const errors = releasedCopyErrors(missing).join('\n');
  assert.match(errors, /brief must be a non-empty string/);
  assert.match(errors, /description must be a non-empty string/);
});

test('applyReleasedCopy copies app.json text exactly and refuses an unlisted app', () => {
  const data = entry();
  const updated = applyReleasedCopy(data, appJson, {updated: '2026-11-02'});
  assert.equal(updated.brief, appJson.brief);
  assert.equal(updated.description, appJson.description);
  assert.equal(updated.version, '28.0.10.632');
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.updated, '2026-11-02');
  assert.equal(data.apps.length, 1);
  assert.throws(
    () => applyReleasedCopy(data, {...appJson, id: '11111111-1111-1111-1111-111111111111', brief: 'x', description: 'y'}),
    /refusing to add an unreleased app/,
  );
});

test('applyReleasedCopy can set the released package version without adding apps', () => {
  const data = entry();
  applyReleasedCopy(data, appJson, {version: '28.0.11.1', released: '2026-11-02', updated: '2026-11-02'});
  assert.equal(data.apps[0].version, '28.0.11.1');
  assert.equal(data.apps[0].released, '2026-11-02');
  assert.equal(data.apps.length, 1);
  assert.throws(() => applyReleasedCopy(data, appJson, {version: '28.0'}), /four-part/);
});
