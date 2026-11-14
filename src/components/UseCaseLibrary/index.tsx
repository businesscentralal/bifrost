import {useEffect, useId, useMemo, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import {usePluralForm} from '@docusaurus/theme-common';
import CopyPrompt from './CopyPrompt';
import isIS from '@site/src/data/use-cases/is-IS.json';
import enUS from '@site/src/data/use-cases/en-US.json';
import styles from './styles.module.css';

type Level = 'ask' | 'do' | 'watch';
type Effect = 'read' | 'draft' | 'write';
type Step = {prompt: string; youGet: string};
type UseCase = {
  id: string;
  roles: string[];
  level: Level;
  effect: Effect;
  name: string;
  summary: string;
  appliesIf: string | null;
  when: string;
  steps: Step[];
  notes: string[];
};
type Role = {id: string; name: string; lead: string};
type Library = {roles: Role[]; cases: UseCase[]};

const LEVELS: Level[] = ['ask', 'do', 'watch'];
const EFFECTS: Effect[] = ['read', 'draft', 'write'];
const HIGHLIGHT_MS = 1500;

/** Lower case, and without accents, so "bokad" finds "bókað". */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase();
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

type ChipGroupProps<T extends string> = {
  title: string;
  hint: string;
  options: {value: T; label: string}[];
  selected: Set<T>;
  onToggle: (value: T) => void;
  help?: string;
};

function ChipGroup<T extends string>({title, hint, options, selected, onToggle, help}: ChipGroupProps<T>): ReactNode {
  const headingId = useId();
  return (
    <div className={styles.filterGroup} role="group" aria-labelledby={headingId}>
      <div className={styles.filterTitle} id={headingId}>
        {title} <span className={styles.filterHint}>{hint}</span>
      </div>
      <div className={styles.chips}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.chip}
            aria-pressed={selected.has(option.value)}
            onClick={() => onToggle(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
      {help ? <p className={styles.filterHelp}>{help}</p> : null}
    </div>
  );
}

/**
 * The use-case library: cases grouped by role, with filters, search and a random pick.
 * Cases, roles, counts and order all come from the data files (src/data/use-cases/).
 * Every case is in the server-rendered page, so it reads without JavaScript too.
 */
export default function UseCaseLibrary(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const library = (currentLocale === 'is-IS' ? isIS : enUS) as unknown as Library;
  const {selectMessage} = usePluralForm();

  const [roleSel, setRoleSel] = useState<Set<string>>(new Set());
  const [levelSel, setLevelSel] = useState<Set<Level>>(new Set());
  const [effectSel, setEffectSel] = useState<Set<Effect>>(new Set());
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [pickNote, setPickNote] = useState<'idle' | 'none'>('idle');

  const detailsRefs = useRef(new Map<string, HTMLDetailsElement>());
  const highlightTimer = useRef<number | undefined>(undefined);
  const searchId = useId();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (highlightTimer.current !== undefined) window.clearTimeout(highlightTimer.current);
    };
  }, []);

  const L = {
    level: {
      ask: translate({id: 'useCases.level.ask', message: 'Ask'}),
      do: translate({id: 'useCases.level.do', message: 'Do'}),
      watch: translate({id: 'useCases.level.watch', message: 'Watch'}),
    },
    effect: {
      read: translate({id: 'useCases.effect.read', message: 'Read only'}),
      draft: translate({id: 'useCases.effect.draft', message: 'Creates drafts'}),
      write: translate({id: 'useCases.effect.write', message: 'Writes to BC'}),
    },
    filters: translate({id: 'useCases.filters.label', message: 'Filter the cases'}),
    role: translate({id: 'useCases.filters.role', message: 'Role'}),
    roleHint: translate({id: 'useCases.filters.roleHint', message: 'pick your role'}),
    levelTitle: translate({id: 'useCases.filters.level', message: 'Level'}),
    levelHint: translate({id: 'useCases.filters.levelHint', message: 'what the system does'}),
    levelHelp: translate({
      id: 'useCases.filters.levelHelp',
      message: 'Ask fetches an answer, Do does the work, and Watch is a question worth asking regularly.',
    }),
    effectTitle: translate({id: 'useCases.filters.effect', message: 'Effect'}),
    effectHint: translate({id: 'useCases.filters.effectHint', message: 'what is left in Business Central'}),
    effectHelp: translate({
      id: 'useCases.filters.effectHelp',
      message: 'Read only changes nothing, drafts are unposted documents, and writes to BC changes data.',
    }),
    search: translate({id: 'useCases.search.label', message: 'Search'}),
    searchPlaceholder: translate({id: 'useCases.search.placeholder', message: 'Search the cases'}),
    clear: translate({id: 'useCases.filters.clear', message: 'Clear filters'}),
    pick: translate({id: 'useCases.pick.button', message: 'Try one now'}),
    pickIdle: translate({
      id: 'useCases.pick.note',
      message: 'We pick a case at random and open it for you.',
    }),
    pickNone: translate({
      id: 'useCases.pick.none',
      message: 'No case matches the selected filters.',
    }),
    nothing: translate({id: 'useCases.count.none', message: 'Nothing found'}),
    when: translate({id: 'useCases.case.when', message: 'When:'}),
    steps: translate({id: 'useCases.case.steps', message: 'Paste in, one step at a time'}),
    youGet: translate({id: 'useCases.case.youGet', message: 'You get:'}),
    notes: translate({id: 'useCases.case.notes', message: 'Good to know'}),
    roleCases: translate({id: 'useCases.role.cases', message: '{count} case|{count} cases'}),
    countAll: translate({id: 'useCases.count.all', message: '{count} case|{count} cases'}),
    countSome: translate({
      id: 'useCases.count.some',
      message: '{count} of {total} case|{count} of {total} cases',
    }),
  };

  const queryFolded = fold(query.trim());
  const filtersActive = roleSel.size > 0 || levelSel.size > 0 || effectSel.size > 0 || queryFolded !== '';

  // The text each case is searched in: name, summary, when and prompts.
  const haystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of library.cases) {
      map.set(c.id, fold([c.name, c.summary, c.when, ...c.steps.map((s) => s.prompt)].join(' \n ')));
    }
    return map;
  }, [library]);

  const groups = useMemo(() => {
    const matches = (c: UseCase) =>
      (levelSel.size === 0 || levelSel.has(c.level)) &&
      (effectSel.size === 0 || effectSel.has(c.effect)) &&
      (queryFolded === '' || (haystacks.get(c.id) ?? '').includes(queryFolded));
    return library.roles
      .filter((r) => roleSel.size === 0 || roleSel.has(r.id))
      .map((role) => ({role, cases: library.cases.filter((c) => c.roles.includes(role.id) && matches(c))}))
      .filter((g) => g.cases.length > 0);
  }, [library, roleSel, levelSel, effectSel, queryFolded, haystacks]);

  // A case in several roles is shown under each role, and counted once.
  const visibleIds = useMemo(() => new Set(groups.flatMap((g) => g.cases.map((c) => c.id))), [groups]);
  const total = library.cases.length;

  const plural = (template: string, n: number, values: Record<string, number> = {}) =>
    Object.entries({count: n, ...values}).reduce(
      (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
      selectMessage(n, template),
    );

  const countText =
    visibleIds.size === 0
      ? L.nothing
      : filtersActive
        ? plural(L.countSome, visibleIds.size, {total})
        : plural(L.countAll, visibleIds.size);

  const clearFilters = () => {
    setRoleSel(new Set());
    setLevelSel(new Set());
    setEffectSel(new Set());
    setQuery('');
    setPickNote('idle');
  };

  const pickOne = () => {
    const ids = [...visibleIds];
    if (ids.length === 0) {
      setPickNote('none');
      return;
    }
    setPickNote('idle');
    const id = ids[Math.floor(Math.random() * ids.length)];
    const group = groups.find((g) => g.cases.some((c) => c.id === id));
    const key = group ? `${group.role.id}:${id}` : '';
    const element = detailsRefs.current.get(key);
    if (!element) return;
    element.open = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'center'});
    element.querySelector('summary')?.focus({preventScroll: true});
    setHighlight(key);
    if (highlightTimer.current !== undefined) window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
  };

  return (
    <div className={styles.library}>
      {mounted && (
        <div className={styles.controls} role="group" aria-label={L.filters}>
          <div className={styles.pickRow}>
            <button type="button" className={styles.pickButton} onClick={pickOne}>
              {L.pick}
            </button>
            <p className={styles.pickNote} aria-live="polite">
              {pickNote === 'none' ? L.pickNone : L.pickIdle}
            </p>
          </div>

          <div className={styles.searchRow}>
            <label className={styles.searchLabel} htmlFor={searchId}>
              {L.search}
            </label>
            <input
              id={searchId}
              className={styles.search}
              type="search"
              value={query}
              placeholder={L.searchPlaceholder}
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" className={styles.clearButton} onClick={clearFilters} disabled={!filtersActive}>
              {L.clear}
            </button>
          </div>

          <ChipGroup
            title={L.role}
            hint={L.roleHint}
            options={library.roles.map((r) => ({value: r.id, label: r.name}))}
            selected={roleSel}
            onToggle={(value) => setRoleSel((s) => toggle(s, value))}
          />
          <ChipGroup
            title={L.levelTitle}
            hint={L.levelHint}
            options={LEVELS.map((value) => ({value, label: L.level[value]}))}
            selected={levelSel}
            onToggle={(value) => setLevelSel((s) => toggle(s, value))}
            help={L.levelHelp}
          />
          <ChipGroup
            title={L.effectTitle}
            hint={L.effectHint}
            options={EFFECTS.map((value) => ({value, label: L.effect[value]}))}
            selected={effectSel}
            onToggle={(value) => setEffectSel((s) => toggle(s, value))}
            help={L.effectHelp}
          />
        </div>
      )}

      <p className={styles.count} aria-live="polite" aria-atomic="true">
        {countText}
      </p>

      {groups.map(({role, cases}) => (
        <section key={role.id} className={styles.role} aria-labelledby={`uc-role-${role.id}`}>
          <h3 className={styles.roleTitle} id={`uc-role-${role.id}`}>
            {role.name} <span className={styles.roleCount}>{plural(L.roleCases, cases.length)}</span>
          </h3>
          <p className={styles.roleLead}>{role.lead}</p>
          {cases.map((c) => {
            const key = `${role.id}:${c.id}`;
            return (
              <details
                key={key}
                id={`uc-${role.id}-${c.id}`}
                className={clsx(styles.case, highlight === key && styles.highlight)}
                ref={(element) => {
                  if (element) detailsRefs.current.set(key, element);
                  else detailsRefs.current.delete(key);
                }}>
                <summary className={styles.summary}>
                  <span className={styles.caseHead}>
                    <span className={styles.caseName}>{c.name}</span>
                    <span className={styles.badges}>
                      <span className={clsx(styles.badge, styles.badgeLevel)}>{L.level[c.level]}</span>
                      <span className={clsx(styles.badge, styles[`effect_${c.effect}`])}>{L.effect[c.effect]}</span>
                    </span>
                  </span>
                  <span className={styles.caseSummary}>{c.summary}</span>
                </summary>
                <div className={styles.caseBody}>
                  {c.appliesIf ? <p className={styles.appliesIf}>{c.appliesIf}</p> : null}
                  <p>
                    <strong>{L.when}</strong> {c.when}
                  </p>
                  {c.steps.length > 0 && (
                    <>
                      <h4 className={styles.sectionTitle}>{L.steps}</h4>
                      <ol className={styles.steps}>
                        {c.steps.map((step, index) => (
                          <li key={index}>
                            <CopyPrompt text={step.prompt} label={`${index + 1}`} />
                            <p className={styles.youGet}>
                              <strong>{L.youGet}</strong> {step.youGet}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                  {c.notes.length > 0 && (
                    <>
                      <h4 className={styles.sectionTitle}>{L.notes}</h4>
                      <ul className={styles.notes}>
                        {c.notes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </details>
            );
          })}
        </section>
      ))}
    </div>
  );
}
