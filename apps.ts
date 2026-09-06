/**
 * Single source of truth for the Bifröst app family.
 *
 * Every entry produces:
 *   - a docs plugin instance  `<id>`        served at  /{locale}/<id>/
 *   - a help plugin instance  `help-<id>`   served at  /{locale}/help/<id>/
 *
 * The help route is a contract with Business Central: an app sets
 *   contextSensitiveHelpUrl = https://bifrost.origo.is/{0}/help/<id>/
 * and BC appends the page's ContextSensitiveHelpPage slug.
 */
export type BifrostApp = {
  /** Route segment and plugin instance id. Kebab-case, stable forever. */
  id: string;
  /** Display name used in the navbar and sidebar headings. */
  title: string;
  /** AppSource / app.json name of the extension. */
  appName: string;
  /** Import wave: 1 = documentation already migrated, 2 = placeholder only. */
  wave: 1 | 2;
};

export const apps: BifrostApp[] = [
  {id: 'foundation', title: 'Foundation', appName: 'Bifrost Foundation', wave: 2},
  {id: 'iceland', title: 'Iceland', appName: 'Bifrost Iceland', wave: 2},
  {id: 'iceland-treasury', title: 'Iceland Treasury', appName: 'Bifrost Iceland Treasury', wave: 2},
  {id: 'iceland-docex', title: 'Iceland DocEx', appName: 'Bifrost Iceland DocEx', wave: 1},
  {id: 'bragi', title: 'Bragi', appName: 'Bifrost Bragi', wave: 1},
  {id: 'hnitbjorg', title: 'Hnitbjörg', appName: 'Bifrost Hnitbjorg', wave: 1},
  {id: 'nornir', title: 'Nornir', appName: 'Bifrost Nornir', wave: 1},
  {id: 'clockify', title: 'Clockify', appName: 'Bifrost Clockify', wave: 2},
  {id: 'subscription-billing', title: 'Subscription Billing', appName: 'Bifrost Subscription Billing', wave: 2},
];

/** Cross-app documentation instances that are not tied to a single extension. */
export const crossAppInstances = [
  {id: 'extensibility', title: 'Extensibility'},
  {id: 'skills', title: 'Skills'},
];
