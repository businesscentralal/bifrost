import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * Where data goes when someone asks through an AI assistant: three places,
 * what passes between them, and what each one keeps. The wording follows the
 * wizard's Tenant Identification and Data Storage Disclosure, telemetry, and the Privacy page; change it there
 * first if the product changes.
 * OPEN-07
 * OPEN-09
 */
export default function DataFlow(): ReactNode {
  return (
    <figure className={styles.flow}>
      <div className={styles.row}>
        <div className={styles.box}>
          <strong>Your AI assistant</strong>
          <span>Copilot, ChatGPT, Claude or another</span>
          <em>Keeps: what your agreement with its provider says</em>
        </div>
        <div className={styles.arrow} aria-hidden="true">⇄</div>
        <div className={`${styles.box} ${styles.origo}`}>
          <strong>Origo</strong>
          <span>The Bifröst MCP server passes requests and answers through</span>
          <em>Keeps: configuration, usage counts, a hashed tenant ID and technical diagnostics. No message contents</em>
        </div>
        <div className={styles.arrow} aria-hidden="true">⇄</div>
        <div className={`${styles.box} ${styles.bc}`}>
          <strong>Your Business Central</strong>
          <span>Bifröst Foundation checks your permissions and runs the work as you</span>
          <em>Keeps: every call on Bifrost Messages, for as long as you decide</em>
        </div>
      </div>
      <figcaption className={styles.caption}>
        Your business data is kept in your own Business Central and by the assistant you chose, and by any outside service an app you installed connects to, such as your bank.
      </figcaption>
    </figure>
  );
}
