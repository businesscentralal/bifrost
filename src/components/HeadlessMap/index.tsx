import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * "Headless inside, message types outside": callers from outside come in only
 * through the message types, people use the pages, and both call the same
 * headless core. Conceptual only; no platform internals.
 */
export default function HeadlessMap(): ReactNode {
  return (
    <figure className={styles.map}>
      <div className={styles.row}>
        <div className={styles.column}>
          <ul className={styles.callers} role="list">
            <li>AI agents</li>
            <li>Integrations</li>
            <li>Other AL code</li>
            <li>Scheduled routines</li>
          </ul>
          <div className={styles.down} aria-hidden="true">↓</div>
          <div className={`${styles.box} ${styles.outside}`}>
            <strong>Your message types</strong>
            <span>Name, one-line description, help. The only way in from outside</span>
          </div>
        </div>
        <div className={styles.column}>
          <ul className={styles.callers} role="list">
            <li>People</li>
          </ul>
          <div className={styles.down} aria-hidden="true">↓</div>
          <div className={`${styles.box} ${styles.people}`}>
            <strong>Your pages</strong>
            <span>Dialogs, confirmations, the selected row</span>
          </div>
        </div>
      </div>
      <div className={styles.down} aria-hidden="true">↓ ↓</div>
      <div className={`${styles.box} ${styles.core}`}>
        <strong>Your headless core</strong>
        <span>
          The business rules, once. Never asks a person, never commits on its own, takes every
          choice as a parameter
        </span>
      </div>
      <figcaption className={styles.caption}>Pages and message types share one core.</figcaption>
    </figure>
  );
}
