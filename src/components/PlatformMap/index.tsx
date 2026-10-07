import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

/**
 * The Bifröst platform at a glance: who calls, the one gate, and who adds message types.
 * Other apps are shown as one box: the site documents published apps only.
 */
export default function PlatformMap(): ReactNode {
  return (
    <figure className={styles.map}>
      <div className={styles.rowLabel}>
        <Translate id="platformMap.ask">Who asks</Translate>
      </div>
      <div className={styles.row}>
        <div className={styles.caller}>
          <strong><Translate id="platformMap.agents">AI assistants</Translate></strong>
          <span>Copilot, Claude, MCP</span>
        </div>
        <div className={styles.caller}>
          <strong><Translate id="platformMap.systems">Other systems</Translate></strong>
          <span>REST API</span>
        </div>
        <div className={styles.caller}>
          <strong><Translate id="platformMap.extensions">Other extensions</Translate></strong>
          <span>AL</span>
        </div>
      </div>

      <div className={styles.arrow} aria-hidden="true">↓</div>

      <Link className={styles.gate} to="/foundation/">
        <strong>Bifröst Foundation</strong>
        <span>
          <Translate id="platformMap.gate">
            One gate: catalogue, help, permissions, license and a log of every call
          </Translate>
        </span>
      </Link>

      <div className={styles.arrow} aria-hidden="true">↑</div>

      <div className={styles.rowLabel}>
        <Translate id="platformMap.add">Who adds capabilities</Translate>
      </div>
      <div className={styles.row}>
        <Link className={styles.builtin} to="/foundation/">
          <strong><Translate id="platformMap.builtin">Built into Foundation</Translate></strong>
          <span>
            <Translate id="platformMap.builtinBody">
              Customer, Sales, Purchase, Finance, Inventory, Projects, Data and more
            </Translate>
          </span>
        </Link>
      </div>
      <div className={styles.apps}>
        <span className={styles.yours}>
          <Translate id="platformMap.others">Other Bifröst apps</Translate>
        </span>
      </div>
      <figcaption className={styles.caption}>
        <Translate id="platformMap.caption">
          Every app adds its own capabilities to the same catalogue, so every caller can use them.
        </Translate>
      </figcaption>
    </figure>
  );
}
