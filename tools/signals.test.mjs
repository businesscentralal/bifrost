import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {signalErrors} from './lib/signals.mjs';

const schema = JSON.parse(readFileSync(new URL('../data/apps.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({allErrors: true, strict: true});
addFormats(ajv);
const validate = ajv.compile(schema);

const reason = {en: 'Found {count} locations', is: 'Fann {count} staðsetningar'};
const app = (signals) => ({
  appId: '47acac54-3873-496f-9e88-157f36413e89', name: 'Bifrost Test', publisher: 'Origo', summary: 'A test app.',
  domains: ['inventory'], foundationMinVersion: '28.0.0.0', status: 'available',
  links: {appSource: null, docs: null, repository: null, support: null, logo: 'static/img/apps/warehouse.png'},
  ...(signals === undefined ? {} : {signals}),
});
const doc = (signals) => ({$schema: 'x', apps: [app(signals)]});
const ok = (signals) => assert.equal(validate(doc(signals)), true, JSON.stringify(validate.errors));
const bad = (signals) => assert.equal(validate(doc(signals)), false);

test('accepts an app without signals and a full valid signal', () => {
  ok(undefined);
  ok([{tableId: 14, filters: [{fieldNo: 5732, value: true}, {fieldNo: 10, min: 1, max: 4}], minCount: 2, reason, requiresApp: '3099ffc7-4cf7-4df6-9b96-7e4bc2bb587c'}]);
});

test('refuses malformed signals', () => {
  bad([{tableId: '14', reason}]);
  bad([{tableId: 14}]);
  bad([{tableId: 14, reason: {en: 'Found {count}'}}]);
  bad([{tableId: 14, reason, minCount: 0}]);
  bad([{tableId: 14, reason, minCount: 1.5}]);
  bad([{tableId: 14, reason, requiresApp: 'not-a-guid'}]);
  bad([{tableId: 14, reason, extra: 1}]);
  bad([{tableId: 14, reason, filters: [{fieldNo: 1}]}]);
  bad([{tableId: 14, reason, filters: [{fieldNo: 1, value: 'a', min: 1}]}]);
  bad([{tableId: 14, reason, filters: [1, 2, 3, 4].map((fieldNo) => ({fieldNo, value: 1}))}]);
  bad([{tableId: 14, reason, filters: [{value: 1}]}]);
});

test('cross-field rules', () => {
  const s = (tableId, extra = {}) => ({tableId, reason, ...extra});
  assert.deepEqual(signalErrors(doc([s(1), s(2)]).apps), []);
  assert.match(signalErrors(doc([1, 2, 3, 4, 5, 6].map((n) => s(n))).apps)[0], /at most 5/);
  assert.match(signalErrors(doc([s(1), s(1)]).apps)[0], /repeats tableId 1/);
  assert.deepEqual(signalErrors(doc([s(1), s(1, {filters: [{fieldNo: 2, value: 'IS'}]})]).apps), []);
  assert.match(signalErrors(doc([s(1, {reason: {en: 'x {count}', is: ' '}})]).apps)[0], /reason\.is is missing/);
  assert.match(signalErrors(doc([s(1, {reason: {en: 'no placeholder', is: 'x {count}'}})]).apps)[0], /reason\.en lacks/);
  const many = Array.from({length: 13}, (_, i) => ({...app([1, 2, 3, 4, 5].map((n) => s(n))), appId: String(i)}));
  assert.match(signalErrors(many).pop(), /65 signals in total/);
});
