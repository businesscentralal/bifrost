/**
 * Single source of truth for the apps documented on this site: published apps only.
 *
 * Every entry produces:
 *   - a docs plugin instance  `<id>`        served at  /{locale}/<id>/
 *   - a help plugin instance  `help-<id>`   served at  /{locale}/help/<id>/ (only when help/<id>/ has pages)
 *
 * The help route is a contract with Business Central: an app sets
 *   contextSensitiveHelpUrl = https://docs.bifrost.origo.is/{0}/help/<id>/
 * and BC appends the page's ContextSensitiveHelpPage slug.
 */
export type BifrostApp = {
  /**
   * Route segment and plugin instance id. Kebab-case; treat as stable.
   */
  id: string;
  /** Display name used in the navbar and sidebar headings. */
  title: string;
  /** AppSource / app.json name of the extension. */
  appName: string;
};

export const apps: BifrostApp[] = [
  {id: 'foundation', title: 'Foundation', appName: 'Bifrost Foundation'},
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
];
