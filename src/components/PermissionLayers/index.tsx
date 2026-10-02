import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * One concrete request and the permission checks it has to pass, with what the
 * user sees when a check fails. Names follow docs/setup/business-central.md;
 * facts checked against Foundation (the G/L posting gate on posting a sales document).
 * Field Access is not part of posting: it applies to record reads and writes.
 */
const checks = [
  {
    q: 'May Sigga use Bifröst at all?',
    how: 'She has the BIFROST API ori permission set',
    no: 'The call is refused',
  },
  {
    q: 'May Sigga do this in Business Central?',
    how: 'Her ordinary Business Central permissions allow posting sales invoices',
    no: 'Refused: she does not have that permission',
  },
  {
    q: 'May she post through Bifröst?',
    how: 'She has the posting gate BIFROST GL Post ori, which covers sales and purchase documents as well as general journals',
    no: 'Refused: posting, and a posting preview, need that permission set. Reading and preparing still work',
  },
];

export default function PermissionLayers(): ReactNode {
  return (
    <figure className={styles.figure}>
      <p className={styles.ask}>
        Sigga asks her assistant: <em>"Post the sales invoice for Adatum."</em> Before Business Central
        posts anything, Bifröst checks:
      </p>
      <ol className={styles.checks} role="list">
        {checks.map((c, i) => (
          <li key={c.q} className={styles.check}>
            <span className={styles.n} aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <strong>{c.q}</strong>
              <span className={styles.how}>{c.how}</span>
              <span className={styles.no}>
                <span className={styles.label}>If not:</span> {c.no}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>
        Every check must pass; any one of them can refuse the call on its own.
      </figcaption>
    </figure>
  );
}
