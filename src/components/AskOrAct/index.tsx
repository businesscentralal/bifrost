import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * For users: the difference between asking a question and asking for a change.
 * A question only reads. A change is proposed first and can be previewed; most
 * assistants ask before they act. Bifröst itself does not ask: it runs as you.
 */
export default function AskOrAct(): ReactNode {
  return (
    <figure className={styles.figure}>
      <div className={styles.lane}>
        <div className={styles.laneTitle}>Look something up</div>
        <ol className={styles.path} role="list">
          <li>You ask</li>
          <li>The assistant reads from Business Central, as you</li>
          <li className={styles.end}>You get the answer. Nothing changes</li>
        </ol>
      </div>
      <div className={styles.lane}>
        <div className={styles.laneTitle}>Change something</div>
        <ol className={styles.path} role="list">
          <li>You ask</li>
          <li>The assistant proposes what it will do</li>
          <li className={styles.safe}>
            Say <em>"show me first"</em> to see what posting would do
          </li>
          <li className={styles.confirm}>You say yes (most assistants ask first; if yours does not, tell it to)</li>
          <li className={styles.end}>Business Central does it, with your rights, and logs it</li>
        </ol>
      </div>
      <figcaption className={styles.caption}>A question only reads; a change waits for your yes.</figcaption>
    </figure>
  );
}
