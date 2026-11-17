import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import isData from '../../data/role-demo/is-IS.json';
import enData from '../../data/role-demo/en-US.json';
import BlockView from './Blocks';
import type {Block} from './Blocks';
import styles from './styles.module.css';

type Example = {
  kind: string;
  who: string;
  q: string;
  gate: string;
  bc: string;
  out: string;
  title: string;
  blocks: Block[];
  summary: string;
};
type Data = {kinds: Record<string, string>; roles: {id: string; label: string; examples: Example[]}[]};

// Animation stages: 0 = nothing, 1 = question typed, 2 = gate lit, 3 = bc lit, 4 = result lit.
type Run = {chars: number; stage: number};
const FULL: Run = {chars: Infinity, stage: 4};

export default function RoleDemo(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const data = (locale === 'is-IS' ? isData : enData) as unknown as Data;
  const fmt = useMemo(() => {
    const f = new Intl.NumberFormat(locale === 'is-IS' ? 'is-IS' : 'en-US', {maximumFractionDigits: 1});
    return (v: number) => f.format(v);
  }, [locale]);

  const [roleIdx, setRoleIdx] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  // Server render and first client render show the first example complete.
  const [run, setRun] = useState<Run>(FULL);
  const timers = useRef<number[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => clear, [clear]);

  const play = useCallback(
    (q: string) => {
      clear();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        setRun(FULL);
        return;
      }
      setRun({chars: 0, stage: 0});
      const step = Math.max(12, Math.min(28, 1500 / q.length));
      for (let i = 1; i <= q.length; i++) {
        timers.current.push(window.setTimeout(() => setRun({chars: i, stage: 0}), 200 + i * step));
      }
      let t = 200 + q.length * step + 350;
      [1, 2, 3, 4].forEach((s) => {
        timers.current.push(window.setTimeout(() => setRun({chars: q.length, stage: s}), t));
        t += s === 3 ? 600 : 550;
      });
      timers.current.push(window.setTimeout(() => setRun(FULL), t + 50));
    },
    [clear],
  );

  const role = data.roles[roleIdx];
  const ex = role.examples[exIdx];

  const pickRole = (i: number) => {
    setRoleIdx(i);
    setExIdx(0);
    play(data.roles[i].examples[0].q);
  };
  const pickExample = (i: number) => {
    setExIdx(i);
    play(role.examples[i].q);
  };

  const typing = run.chars !== Infinity && run.chars < ex.q.length;
  const shown = run.chars === Infinity ? ex.q : ex.q.slice(0, run.chars);
  const lit = (n: number) => run.stage >= n;

  return (
    <section className={styles.demo} aria-label={translate({id: 'home.roleDemo.title', message: 'What can you do with Bifröst?'})}>
      <div className={styles.roles} role="group" aria-label={translate({id: 'home.roleDemo.rolesLabel', message: 'Choose a role'})}>
        <span className={styles.iam}><Translate id="home.roleDemo.iam">I am</Translate></span>
        {data.roles.map((r, i) => (
          <button key={r.id} type="button" className={clsx(styles.role, i === roleIdx && styles.active)} aria-pressed={i === roleIdx} onClick={() => pickRole(i)}>
            {r.label}
          </button>
        ))}
      </div>
      <div className={styles.layout}>
        <div className={styles.prompts} role="group" aria-label={translate({id: 'home.roleDemo.examplesLabel', message: 'Examples'})}>
          {role.examples.map((e, i) => (
            <button key={i} type="button" className={clsx(styles.prompt, i === exIdx && styles.active)} aria-pressed={i === exIdx} onClick={() => pickExample(i)}>
              <span className={styles.tag}>{data.kinds[e.kind]}</span>
              <span>{e.q}</span>
            </button>
          ))}
        </div>
        <div className={styles.stage}>
          <span className={styles.badge}><Translate id="home.roleDemo.badge">Illustration</Translate></span>
          <div className={styles.bubble}>
            <small>{ex.who}</small>
            <p>
              {shown}
              {typing ? <span className={styles.caret} aria-hidden="true" /> : null}
            </p>
          </div>
          <ol className={styles.steps}>
            <li className={clsx(lit(2) && styles.lit)}>
              <b><Translate id="home.roleDemo.gate">Bifröst guards</Translate></b>
              <span>{ex.gate}</span>
            </li>
            <li className={clsx(lit(3) && styles.lit)}>
              <b><Translate id="home.roleDemo.bc">Business Central works</Translate></b>
              <span>{ex.bc}</span>
            </li>
            <li className={clsx(lit(4) && styles.lit)}>
              <b><Translate id="home.roleDemo.result">Result</Translate></b>
              <span>{ex.out}</span>
            </li>
          </ol>
          <div ref={resultRef} className={clsx(styles.out, lit(4) && styles.lit)} aria-live="polite">
            {lit(4) ? (
              <>
                <h4>{ex.title}</h4>
                {ex.blocks.map((b, i) => (
                  <BlockView key={`${roleIdx}-${exIdx}-${i}`} block={b} fmt={fmt} />
                ))}
                <p className={styles.summary}>{ex.summary}</p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
