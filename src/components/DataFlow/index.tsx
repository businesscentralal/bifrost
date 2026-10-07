import type {ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

/**
 * Where data goes when someone asks through an AI assistant: three places,
 * what passes between them, and what each one keeps. The wording follows the
 * wizard's Tenant Identification and Data Storage Disclosure, telemetry, and the Privacy page; change it there
 * first if the product changes.
 */
export default function DataFlow(): ReactNode {
  return (
    <figure className={styles.flow}>
      <div className={styles.row}>
        <div className={styles.box}>
          <strong>
            <Translate id="dataFlow.assistant.title">Your AI assistant</Translate>
          </strong>
          <span>
            <Translate id="dataFlow.assistant.body">Copilot, ChatGPT, Claude or another</Translate>
          </span>
          <em>
            <Translate id="dataFlow.assistant.keeps">Keeps: what your agreement with its provider says</Translate>
          </em>
        </div>
        <div className={styles.arrow} aria-hidden="true">⇄</div>
        <div className={`${styles.box} ${styles.origo}`}>
          <strong>Origo</strong>
          <span>
            <Translate id="dataFlow.origo.body">The Bifröst MCP server passes requests and answers through</Translate>
          </span>
          <em>
            <Translate id="dataFlow.origo.keeps">
              Keeps: configuration, usage counts, a hashed tenant ID and technical diagnostics. No message contents
            </Translate>
          </em>
        </div>
        <div className={styles.arrow} aria-hidden="true">⇄</div>
        <div className={`${styles.box} ${styles.bc}`}>
          <strong>
            <Translate id="dataFlow.bc.title">Your Business Central</Translate>
          </strong>
          <span>
            <Translate id="dataFlow.bc.body">Bifröst Foundation checks your permissions and runs the work as you</Translate>
          </span>
          <em>
            <Translate id="dataFlow.bc.keeps">Keeps: every call on Bifrost Messages, for as long as you decide</Translate>
          </em>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <Translate id="dataFlow.caption">
          Your business data is kept in your own Business Central and by the assistant you chose, and by any outside
          service an app you installed connects to, such as your bank.
        </Translate>
      </figcaption>
    </figure>
  );
}
