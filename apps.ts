/**
 * Single source of truth for the Bifröst app family.
 *
 * Every entry produces:
 *   - a docs plugin instance  `<id>`        served at  /{locale}/<id>/
 *   - a help plugin instance  `help-<id>`   served at  /{locale}/help/<id>/
 *
 * The help route is a contract with Business Central: an app sets
 *   contextSensitiveHelpUrl = https://docs.bifrost.origo.is/{0}/help/<id>/
 * and BC appends the page's ContextSensitiveHelpPage slug.
 */
export type BifrostApp = {
  /**
   * Route segment and plugin instance id. Kebab-case; treat as stable.
   * Four ids were intentionally renamed (with client redirects) to match live
   * AppSource names: bragi→language-models, hnitbjorg→attachments,
   * nornir→orchestrator, clockify→timesheets. AL app.json follow-up is separate.
   */
  id: string;
  /** Display name used in the navbar and sidebar headings. */
  title: string;
  /** AppSource / app.json name of the extension. */
  appName: string;
  /** Import wave: 1 = documentation migrated, 2 = placeholder only. All apps are at 1 since 2026-09-06. */
  wave: 1 | 2;
  /**
   * Where the app sits in the Apps and Help menus: `base` is Foundation, the one
   * every other app needs; `addon` apps work in any country; `iceland` apps are
   * for the Icelandic market. Left out, an app is listed as an add-on.
   */
  group?: 'base' | 'addon' | 'iceland';
};

export const apps: BifrostApp[] = [
  {id: 'foundation', title: 'Foundation', appName: 'Bifrost Foundation', wave: 1, group: 'base'},
];

/**
 * Cross-app documentation instances that are not tied to a single extension,
 * in the order a reader meets them: set it up, read the documentation, try it,
 * see the cost, then the apps.
 */
export const crossAppInstances = [
  {id: 'setup', title: 'Set it up'},
  {id: 'documentation', title: 'Documentation'},
  {id: 'try-it-out', title: 'Try it out'},
  {id: 'price', title: 'Price'},
  {id: 'licensing', title: 'Licensing'},
  {id: 'apps', title: 'Apps'},
  {id: 'extensibility', title: 'Extensibility'},
];
