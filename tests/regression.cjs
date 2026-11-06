/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness loads TypeScript without adding a runtime dependency. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  if (name.startsWith('@/')) name = path.join(__dirname, '../src', name.slice(2));
  return resolve.call(this, name, ...args);
};
require.extensions['.ts'] = function (module, file) {
  module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText, file);
};
const storage = new Map();
global.localStorage = { getItem: (k) => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v), removeItem: (k) => storage.delete(k) };
const { useAppStore } = require('../src/stores/app-store.ts');
const { todayKey, localDateTime } = require('../src/lib/utils.ts');
const { filterByRange, stressSeries } = require('../src/lib/stats.ts');
const store = () => useAppStore.getState();
store().addCheckIn({ date: todayKey(), emotion: 'sereno', intensity: 5 });
const exported = store().exportData();
assert.equal(store().importData(exported).ok, true, 'own export must import');
for (const bad of ['null', '{}', '[]', '{', JSON.stringify({ ...JSON.parse(exported), diary: 'bad' }), JSON.stringify({ ...JSON.parse(exported), preferences: { ...store().preferences, goals: null } }), JSON.stringify({ ...JSON.parse(exported), version: 2 })]) {
  const before = store().exportData();
  assert.equal(store().importData(bad).ok, false);
  assert.deepEqual(JSON.parse(store().exportData()).checkIns, JSON.parse(before).checkIns);
  assert.equal(store().preferences.goals.length, 0);
}
const timestamp = '2026-11-06T23:30:00.000Z';
assert.equal(localDateTime(timestamp), '2026-11-07T00:30', 'datetime input must use Rome local time');
assert.equal(new Date(localDateTime(timestamp)).toISOString(), timestamp, 'editing must preserve instant');
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
assert.equal(filterByRange([{date:todayKey()}, {date:todayKey(tomorrow)}], '7', 'date').length, 1);
assert.equal(stressSeries([{datetime:timestamp, stressIntensity:4}], 'all')[0].date, '2026-11-07');
console.log('Passed: backup round-trip, malformed/unsupported backup rejection without mutation, local datetime round-trip, future-date exclusion, local chart grouping.');
