import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/** The result cards of the role demo. Every block is plain data from src/data/role-demo/. */

export type Cell = string | {pill: string; tone?: 'warn' | 'muted'} | {meter: number; text: string};
export type Block =
  | {type: 'kpis'; items: {label: string; value: string; note?: string; warn?: boolean}[]}
  | {
      type: 'lineChart';
      aria: string;
      values: number[];
      labels: string[];
      threshold: number;
      thresholdLabel: string;
      minIndex: number;
    }
  | {type: 'waterfall'; aria: string; steps: {label: string; value: number; total?: boolean}[]}
  | {type: 'slides'; items: {title: string; n: string; kind: 'cover' | 'bars' | 'wf' | 'bal'}[]}
  | {type: 'message'; from: string; title: string; body: string; actions: string[]}
  | {type: 'checks'; items: {label: string; status: 'ok' | 'warn' | 'open'; note: string}[]}
  | {type: 'table'; cols: {label: string; num?: boolean}[]; rows: Cell[][]; foot?: Cell[]}
  | {type: 'bars'; max: number; items: {label: string; value: number; text: string}[]}
  | {type: 'banner'; text: string}
  | {
      type: 'sync';
      left: {label: string; title: string; detail: string};
      right: {label: string; title: string; detail: string};
    }
  | {type: 'events'; items: {time: string; text: string}[]}
  | {type: 'operation'; name: string; rows: [string, string][]; clients: {text: string; tone?: 'muted'}[]};

type Fmt = (value: number) => string;

function CellView({cell}: {cell: Cell}): ReactNode {
  if (typeof cell === 'string') return cell;
  if ('pill' in cell) {
    return <span className={clsx(styles.pill, cell.tone === 'warn' && styles.pillWarn, cell.tone === 'muted' && styles.pillMuted)}>{cell.pill}</span>;
  }
  return (
    <>
      <span className={styles.meter} aria-hidden="true">
        <i style={{width: `${Math.min(100, cell.meter / 1.3)}%`}} />
      </span>{' '}
      {cell.text}
    </>
  );
}

function LineChart({block, fmt}: {block: Extract<Block, {type: 'lineChart'}>; fmt: Fmt}): ReactNode {
  const {values, labels, threshold, minIndex} = block;
  const W = 560, H = 180, L = 34, R = 10, T = 14, B = 24, max = 90, n = values.length;
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={block.aria}>
      {[0, 30, 60, 90].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} className={styles.gridLine} />
          <text x={L - 6} y={y(g) + 4} textAnchor="end">{g}</text>
        </g>
      ))}
      <polygon points={`${x(0)},${y(0)} ${points} ${x(n - 1)},${y(0)}`} className={styles.area} />
      <polyline points={points} className={styles.line} />
      <line x1={L} x2={W - R} y1={y(threshold)} y2={y(threshold)} className={styles.thresholdLine} />
      <text x={W - R} y={y(threshold) - 5} textAnchor="end" className={styles.warnText}>
        {block.thresholdLabel.replace('{value}', String(threshold))}
      </text>
      <circle cx={x(minIndex)} cy={y(values[minIndex])} r={5} className={styles.minDot} />
      <text className={styles.lbl} x={x(minIndex) + 8} y={y(values[minIndex]) + 16}>{fmt(values[minIndex])}</text>
      {labels.map((label, i) =>
        i % 2 === 0 ? (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle">{label}</text>
        ) : null,
      )}
    </svg>
  );
}

function Waterfall({block, fmt}: {block: Extract<Block, {type: 'waterfall'}>; fmt: Fmt}): ReactNode {
  const steps = block.steps;
  const W = 560, H = 200, L = 10, R = 10, T = 22, B = 30, max = 50, n = steps.length, bw = (W - L - R) / n;
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  let run = 0;
  const parts: ReactNode[] = [];
  steps.forEach((st, i) => {
    const x0 = L + i * bw + bw * 0.18, w = bw * 0.64;
    let top: number, bot: number, cls: string;
    if (st.total) {
      top = y(st.value);
      bot = y(0);
      cls = i === 0 ? styles.barGrey : styles.barAccent;
      run = st.value;
    } else {
      const a = run, b = run + st.value;
      top = y(Math.max(a, b));
      bot = y(Math.min(a, b));
      cls = st.value < 0 ? styles.barWarn : styles.barUp;
      run = b;
      if (i < n - 1) parts.push(<line key={`c${i}`} x1={x0 + w} x2={x0 + bw} y1={y(b)} y2={y(b)} className={styles.connector} />);
    }
    parts.push(<rect key={`r${i}`} x={x0.toFixed(1)} y={top.toFixed(1)} width={w.toFixed(1)} height={Math.max(2, bot - top).toFixed(1)} rx={3} className={cls} />);
    const label = (st.total ? '' : st.value > 0 ? '+' : '−') + fmt(Math.abs(st.value));
    parts.push(<text key={`v${i}`} className={styles.lbl} x={x0 + w / 2} y={top - 6} textAnchor="middle">{label}</text>);
    parts.push(<text key={`l${i}`} x={x0 + w / 2} y={H - 10} textAnchor="middle">{st.label}</text>);
    if (st.total && i > 0) parts.push(<line key={`t${i}`} x1={L + (i - 1) * bw + bw * 0.82} x2={x0} y1={top} y2={top} className={styles.connector} />);
  });
  return (
    <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={block.aria}>
      {parts}
    </svg>
  );
}

/** A slide in the board pack: a small picture on a light slide, the same in light and dark mode. */
function MiniSlide({kind}: {kind: 'cover' | 'bars' | 'wf' | 'bal'}): ReactNode {
  const teal = '#0BB7A7', teal2 = '#009B9E', grey = '#6C7683', orange = '#FF8300';
  return (
    <svg viewBox="0 0 160 70" preserveAspectRatio="none" aria-hidden="true">
      {kind === 'bars' &&
        [[30, 38], [52, 46], [74, 40], [96, 52], [118, 58]].map((b, i) => (
          <g key={i}>
            <rect x={b[0] - 8} y={66 - b[1]} width={7} height={b[1]} fill={teal2} />
            <rect x={b[0]} y={66 - b[1] * 0.9} width={7} height={b[1] * 0.9} fill={grey} />
          </g>
        ))}
      {kind === 'wf' && (
        <>
          <rect x={10} y={14} width={18} height={52} fill={grey} />
          <rect x={38} y={14} width={18} height={10} fill={teal} />
          <rect x={66} y={24} width={18} height={8} fill={orange} />
          <rect x={94} y={16} width={18} height={16} fill={teal} />
          <rect x={122} y={16} width={18} height={50} fill={teal2} />
        </>
      )}
      {kind === 'bal' && (
        <>
          <rect x={12} y={8} width={60} height={58} fill={teal2} fillOpacity={0.85} />
          <rect x={88} y={8} width={60} height={22} fill="#303A47" />
          <rect x={88} y={32} width={60} height={16} fill={grey} />
          <rect x={88} y={50} width={60} height={16} fill={teal} />
        </>
      )}
      {kind === 'cover' && <rect x={0} y={54} width={160} height={4} fill={teal} />}
    </svg>
  );
}

export default function BlockView({block, fmt}: {block: Block; fmt: Fmt}): ReactNode {
  switch (block.type) {
    case 'kpis':
      return (
        <div className={styles.kpis}>
          {block.items.map((k, i) => (
            <div key={i} className={clsx(styles.kpi, k.warn && styles.kpiWarn)}>
              <small>{k.label}</small>
              <b>{k.value}</b>
              {k.note ? <i>{k.note}</i> : null}
            </div>
          ))}
        </div>
      );
    case 'lineChart':
      return <LineChart block={block} fmt={fmt} />;
    case 'waterfall':
      return <Waterfall block={block} fmt={fmt} />;
    case 'slides':
      return (
        <div className={styles.slides}>
          {block.items.map((s, i) => (
            <div key={i} className={clsx(styles.slide, s.kind === 'cover' && styles.slideCover)}>
              <div className={styles.slideTitle}>
                {s.title}
                <span>{s.n}</span>
              </div>
              <MiniSlide kind={s.kind} />
            </div>
          ))}
        </div>
      );
    case 'message':
      return (
        <div className={styles.msg}>
          <div className={styles.msgHead}>
            <small>{block.from}</small>
            <b>{block.title}</b>
          </div>
          <div className={styles.msgBody}>{block.body}</div>
          <div className={styles.msgActions}>
            {block.actions.map((a, i) => (
              <span key={i} className={clsx(styles.btn, i > 0 && styles.btnGhost)}>{a}</span>
            ))}
          </div>
        </div>
      );
    case 'checks':
      return (
        <ul className={styles.checks}>
          {block.items.map((c, i) => (
            <li key={i}>
              <span className={clsx(styles.icon, c.status === 'ok' && styles.iconOk, c.status === 'warn' && styles.iconWarn, c.status === 'open' && styles.iconOpen)} aria-hidden="true">
                {c.status === 'ok' ? '✓' : c.status === 'warn' ? '!' : ''}
              </span>
              <span>{c.label}</span>
              <small>{c.note}</small>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.cols.map((c, i) => (
                  <th key={i} className={c.num ? styles.num : undefined}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, i) => (
                    <td key={i} className={block.cols[i]?.num ? styles.num : undefined}><CellView cell={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
            {block.foot ? (
              <tfoot>
                <tr>
                  {block.foot.map((cell, i) => (
                    <td key={i} className={block.cols[i]?.num ? styles.num : undefined}><CellView cell={cell} /></td>
                  ))}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      );
    case 'bars':
      return (
        <div className={styles.hbars}>
          {block.items.map((b, i) => (
            <div key={i} className={styles.hb}>
              <span>{b.label}</span>
              <span className={styles.bar} aria-hidden="true">
                <i style={{width: `${((b.value / block.max) * 100).toFixed(1)}%`}} />
              </span>
              <b>{b.text}</b>
            </div>
          ))}
        </div>
      );
    case 'banner':
      return <div className={styles.banner}>{block.text}</div>;
    case 'sync':
      return (
        <div className={styles.sync}>
          {[block.left, block.right].map((side, i) => (
            <div key={i} className={styles.card}>
              <small>{side.label}</small>
              <b>{side.title}</b>
              <br />
              {side.detail}
            </div>
          )).flatMap((el, i) => (i === 0 ? [el, <span key="arrow" className={styles.arrow} aria-hidden="true">→</span>] : [el]))}
        </div>
      );
    case 'events':
      return (
        <ul className={styles.events}>
          {block.items.map((e, i) => (
            <li key={i}>
              <time>{e.time}</time>
              <span className={styles.dot} aria-hidden="true" />
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
      );
    case 'operation':
      return (
        <div className={styles.op}>
          <strong className={styles.opName}>{block.name}</strong>
          <dl>
            {block.rows.map(([k, v], i) => (
              <div key={i} className={styles.opRow}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.clients}>
            {block.clients.map((c, i) => (
              <span key={i} className={clsx(styles.pill, c.tone === 'muted' && styles.pillMuted)}>{c.text}</span>
            ))}
          </div>
        </div>
      );
  }
}
