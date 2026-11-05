/**
 * data/versions.json is the public AppSource version feed.
 * Foundation's AppVersionCheck reads schemaVersion, appId, version, released,
 * releaseNotes and the optional appSourceUrl. brief and description are
 * additive and are not read by that parser. schemaVersion stays 1.
 *
 * Only apps already listed may be updated. This repository is public.
 */

const REQUIRED = ['appId', 'name', 'version', 'released', 'releaseNotes', 'brief', 'description'];
const VERSION = /^\d+\.\d+\.\d+\.\d+$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Problems that would make the feed unusable or drop the new copy fields. */
export function releasedCopyErrors(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return ['data/versions.json must be an object'];
  }
  if (data.schemaVersion !== 1) {
    errors.push('data/versions.json schemaVersion must stay 1 so Foundation AppVersionCheck can parse the file');
  }
  if (typeof data.updated !== 'string' || !DAY.test(data.updated)) {
    errors.push('data/versions.json updated must be a YYYY-MM-DD date');
  }
  if (!Array.isArray(data.apps) || data.apps.length === 0) {
    errors.push('data/versions.json apps must be a non-empty array');
    return errors;
  }
  const seen = new Set();
  for (const app of data.apps) {
    const label = app && (app.name || app.appId) ? `"${app.name || app.appId}"` : 'an entry';
    if (!app || typeof app !== 'object' || Array.isArray(app)) {
      errors.push('data/versions.json has an entry that is not an object');
      continue;
    }
    for (const key of REQUIRED) {
      if (typeof app[key] !== 'string' || app[key].trim() === '') {
        errors.push(`${label}: ${key} must be a non-empty string`);
      }
    }
    if (typeof app.version === 'string' && app.version !== '' && !VERSION.test(app.version)) {
      errors.push(`${label}: version "${app.version}" must be a four-part numeric version`);
    }
    if (typeof app.released === 'string' && app.released !== '' && !DAY.test(app.released)) {
      errors.push(`${label}: released "${app.released}" must be YYYY-MM-DD`);
    }
    if (typeof app.releaseNotes === 'string' && app.releaseNotes !== '' && !app.releaseNotes.startsWith('https://')) {
      errors.push(`${label}: releaseNotes must be an https URL`);
    }
    if (typeof app.appId === 'string' && app.appId !== '') {
      const id = app.appId.toLowerCase();
      if (seen.has(id)) errors.push(`duplicate appId "${app.appId}"`);
      seen.add(id);
    }
  }
  return errors;
}

/**
 * Copies brief and description exactly from a released app.json onto the
 * existing catalogue entry. Refuses an app that is not already listed.
 * version and released are changed only when the caller supplies them.
 */
export function applyReleasedCopy(data, appJson, options = {}) {
  if (!appJson || typeof appJson !== 'object') throw new Error('app.json must be an object');
  const appId = typeof appJson.id === 'string' ? appJson.id : '';
  if (!/^[0-9a-fA-F-]{36}$/.test(appId)) throw new Error('app.json id must be the app GUID');
  if (typeof appJson.brief !== 'string' || appJson.brief.trim() === '') {
    throw new Error(`app.json ${appId} brief is missing or blank`);
  }
  if (typeof appJson.description !== 'string' || appJson.description.trim() === '') {
    throw new Error(`app.json ${appId} description is missing or blank`);
  }
  const entry = (data.apps || []).find((app) => String(app.appId || '').toLowerCase() === appId.toLowerCase());
  if (!entry) {
    throw new Error(`app ${appId} is not listed in data/versions.json; refusing to add an unreleased app`);
  }
  entry.brief = appJson.brief;
  entry.description = appJson.description;
  if (options.version !== undefined) {
    if (!VERSION.test(options.version)) throw new Error(`version "${options.version}" must be a four-part numeric version`);
    entry.version = options.version;
  }
  if (options.released !== undefined) {
    if (!DAY.test(options.released)) throw new Error(`released "${options.released}" must be YYYY-MM-DD`);
    entry.released = options.released;
  }
  if (options.updated !== undefined) {
    if (!DAY.test(options.updated)) throw new Error(`updated "${options.updated}" must be YYYY-MM-DD`);
    data.updated = options.updated;
  }
  return entry;
}
