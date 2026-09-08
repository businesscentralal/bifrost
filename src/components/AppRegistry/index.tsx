import {type ReactNode, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import registry from '@site/data/apps.json';
import styles from './styles.module.css';

type Domain =
  | 'finance'
  | 'sales'
  | 'purchasing'
  | 'inventory'
  | 'projects'
  | 'hr-payroll'
  | 'banking'
  | 'e-documents'
  | 'integration'
  | 'ai'
  | 'documents'
  | 'scheduling'
  | 'time-tracking'
  | 'billing'
  | 'iceland'
  | 'other';

type Status = 'available' | 'preview' | 'coming-soon';

type AppLinks = {
  appSource: string | null;
  docs: string | null;
  repository: string | null;
  support: string | null;
  logo: string;
};

type RegistryApp = {
  appId: string;
  name: string;
  publisher: string;
  summary: string;
  summary_is?: string;
  domains: Domain[];
  foundationMinVersion: string;
  status: Status;
  links: AppLinks;
};

const apps = (registry as {apps: RegistryApp[]}).apps;

/** Fixed domain list and bilingual labels — keep in sync with data/apps.schema.json's enum. */
const DOMAIN_LABELS: Record<Domain, {en: string; is: string}> = {
  finance: {en: 'Finance', is: 'Fjármál'},
  sales: {en: 'Sales', is: 'Sala'},
  purchasing: {en: 'Purchasing', is: 'Innkaup'},
  inventory: {en: 'Inventory', is: 'Birgðir'},
  projects: {en: 'Projects', is: 'Verkefni'},
  'hr-payroll': {en: 'HR & payroll', is: 'Mannauður og laun'},
  banking: {en: 'Banking', is: 'Bankaviðskipti'},
  'e-documents': {en: 'E-documents', is: 'Rafræn skjöl'},
  integration: {en: 'Integration', is: 'Samþætting'},
  ai: {en: 'AI', is: 'Gervigreind'},
  documents: {en: 'Documents', is: 'Skjöl'},
  scheduling: {en: 'Scheduling', is: 'Áætlanagerð'},
  'time-tracking': {en: 'Time tracking', is: 'Tímaskráning'},
  billing: {en: 'Billing', is: 'Innheimta'},
  iceland: {en: 'Iceland', is: 'Ísland'},
  other: {en: 'Other', is: 'Annað'},
};

const STATUS_LABELS: Record<Status, {en: string; is: string}> = {
  available: {en: 'Available', is: 'Í boði'},
  preview: {en: 'Preview', is: 'Forskoðun'},
  'coming-soon': {en: 'Coming soon', is: 'Væntanlegt'},
};

const STRINGS = {
  en: {
    searchPlaceholder: 'Search apps by name or summary…',
    searchLabel: 'Search',
    domainLabel: 'Domain',
    allDomains: 'All domains',
    appSource: 'AppSource',
    docs: 'Docs',
    repository: 'Repository',
    comingSoonPill: 'Coming soon',
    noResults: 'No apps match your search.',
    resultCount: (n: number, total: number) => `Showing ${n} of ${total} apps`,
    registerTitle: 'Register your app',
    registerBody: 'Building a Business Central extension on Bifröst Foundation? List it here.',
    registerCta: 'Register your app',
  },
  is: {
    searchPlaceholder: 'Leitaðu að forriti eftir nafni eða lýsingu…',
    searchLabel: 'Leit',
    domainLabel: 'Svið',
    allDomains: 'Öll svið',
    appSource: 'AppSource',
    docs: 'Skjölun',
    repository: 'Hugbúnaðarsafn',
    comingSoonPill: 'Væntanlegt',
    noResults: 'Ekkert forrit passar við leitina.',
    resultCount: (n: number, total: number) => `Sýni ${n} af ${total} forritum`,
    registerTitle: 'Skráðu forritið þitt',
    registerBody: 'Ertu að byggja Business Central viðbót ofan á Bifröst Foundation? Skráðu hana hér.',
    registerCta: 'Skrá forrit',
  },
} as const;

function StatusBadge({status, isIcelandic}: {status: Status; isIcelandic: boolean}): ReactNode {
  const label = isIcelandic ? STATUS_LABELS[status].is : STATUS_LABELS[status].en;
  return <span className={`${styles.statusBadge} ${styles[`status-${status}`]}`}>{label}</span>;
}

function AppCard({app, isIcelandic}: {app: RegistryApp; isIcelandic: boolean}): ReactNode {
  const t = isIcelandic ? STRINGS.is : STRINGS.en;
  const summary = isIcelandic && app.summary_is ? app.summary_is : app.summary;
  // Data stores repo-relative paths ("static/img/apps/x.png"); useBaseUrl wants
  // them relative to the static/ folder and prepends the site's own baseUrl.
  const logoSrc = useBaseUrl(app.links.logo.replace(/^static\//, ''));

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <img src={logoSrc} alt="" role="presentation" className={styles.logo} />
        <div>
          <h3 className={styles.name}>{app.name}</h3>
          <p className={styles.publisher}>{app.publisher}</p>
        </div>
        <StatusBadge status={app.status} isIcelandic={isIcelandic} />
      </div>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.chips}>
        {app.domains.map((domain) => (
          <span key={domain} className={styles.chip}>
            {isIcelandic ? DOMAIN_LABELS[domain].is : DOMAIN_LABELS[domain].en}
          </span>
        ))}
      </div>
      <div className={styles.actions}>
        {app.links.appSource ? (
          <Link className={`button button--primary button--sm ${styles.actionButton}`} to={app.links.appSource}>
            {t.appSource}
          </Link>
        ) : (
          <span className={`${styles.actionButton} ${styles.comingSoonPill}`}>{t.comingSoonPill}</span>
        )}
        {app.links.docs && (
          <Link className={`button button--secondary button--sm ${styles.actionButton}`} to={app.links.docs}>
            {t.docs}
          </Link>
        )}
        {app.links.repository && (
          <Link className={`button button--secondary button--sm ${styles.actionButton}`} to={app.links.repository}>
            {t.repository}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function AppRegistry(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const isIcelandic = i18n.currentLocale === 'is-IS';
  const t = isIcelandic ? STRINGS.is : STRINGS.en;

  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<Domain | 'all'>('all');

  const domainsInUse = useMemo(() => {
    const set = new Set<Domain>();
    for (const app of apps) for (const d of app.domains) set.add(d);
    return Array.from(set).sort((a, b) =>
      (isIcelandic ? DOMAIN_LABELS[a].is : DOMAIN_LABELS[a].en).localeCompare(
        isIcelandic ? DOMAIN_LABELS[b].is : DOMAIN_LABELS[b].en,
      ),
    );
  }, [isIcelandic]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return apps.filter((app) => {
      if (domain !== 'all' && !app.domains.includes(domain)) return false;
      if (!needle) return true;
      const haystack = [
        app.name,
        app.summary,
        app.summary_is ?? '',
        app.publisher,
        ...app.domains.map((d) => DOMAIN_LABELS[d].en).concat(app.domains.map((d) => DOMAIN_LABELS[d].is)),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, domain]);

  return (
    <div className={styles.registry}>
      <div className={styles.toolbar}>
        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>{t.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={styles.searchInput}
          />
        </label>
        <label className={styles.domainField}>
          <span className={styles.visuallyHidden}>{t.domainLabel}</span>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as Domain | 'all')}
            className={styles.domainSelect}>
            <option value="all">{t.allDomains}</option>
            {domainsInUse.map((d) => (
              <option key={d} value={d}>
                {isIcelandic ? DOMAIN_LABELS[d].is : DOMAIN_LABELS[d].en}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className={styles.resultCount}>{t.resultCount(filtered.length, apps.length)}</p>

      {filtered.length === 0 ? (
        <p className={styles.noResults}>{t.noResults}</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((app) => (
            <AppCard key={app.appId} app={app} isIcelandic={isIcelandic} />
          ))}
        </div>
      )}

      <div className={styles.registerCta}>
        <h2>{t.registerTitle}</h2>
        <p>{t.registerBody}</p>
        <Link className="button button--primary" to="/apps/register-your-app/">
          {t.registerCta}
        </Link>
      </div>
    </div>
  );
}
