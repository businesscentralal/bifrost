import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {apps} from '../../../apps';
import styles from './styles.module.css';

/**
 * The Bifröst platform at a glance: who calls, the one gate, and who adds message types.
 * The app row is drawn from apps.ts, so a new app appears here without editing this page.
 */
export default function PlatformMap(): ReactNode {
  const dependentApps = apps.filter((app) => app.id !== 'foundation');
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
            One gate: catalogue, help, permissions, licence and a log of every call
          </Translate>
        </span>
      </Link>

      <div className={styles.arrow} aria-hidden="true">↑</div>

      <div className={styles.rowLabel}>
        <Translate id="platformMap.add">Who adds message types</Translate>
      </div>
      <div className={styles.row}>
        <Link className={styles.builtin} to="/foundation/message-types/">
          <strong><Translate id="platformMap.builtin">Built into Foundation</Translate></strong>
          <span>
            <Translate id="platformMap.builtinBody">
              Sales, purchase, finance, inventory, projects, data and more
            </Translate>
          </span>
        </Link>
      </div>
      <div className={styles.apps}>
        {dependentApps.map((app) => (
          <Link key={app.id} className={styles.app} to={`/${app.id}/`}>
            {app.title}
          </Link>
        ))}
        <Link className={styles.yours} to="/extensibility/">
          <Translate id="platformMap.yours">Your app</Translate>
        </Link>
      </div>
      <figcaption className={styles.caption}>
        <Translate id="platformMap.caption">
          Every app adds its own message types to the same catalogue, so every caller can use them.
        </Translate>
      </figcaption>
    </figure>
  );
}
