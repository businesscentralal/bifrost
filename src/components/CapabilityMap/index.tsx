import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import map from '@site/src/data/capabilities.json';
import styles from './styles.module.css';

type Entry = {type: string; action: string; href: string};
type AppMap = Record<string, Entry[]>;

/**
 * An app's capabilities, each with what its message types do in plain words. Built by
 * tools/build-capability-map.mjs from the generated message type pages, so it follows the app.
 * The Help capability (each app's directory types) goes last.
 */
export default function CapabilityMap({app}: {app: string}): ReactNode {
  const capabilities = ((map as Record<string, AppMap>)[app] ?? {}) as AppMap;
  const names = Object.keys(capabilities).sort((a, b) =>
    a === 'Help' ? 1 : b === 'Help' ? -1 : a.localeCompare(b),
  );
  if (!names.length) return <p>This app has no message types listed yet.</p>;
  return (
    <div className={styles.map}>
      {names.map((name) => {
        const entries = capabilities[name];
        return (
          <details key={name} className={styles.capability}>
            <summary>
              <strong>{name}</strong>
              <span className={styles.count}>
                {entries.length} {entries.length === 1 ? 'message type' : 'message types'}
              </span>
            </summary>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>What it does</th>
                  <th>Message type</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.type}>
                    <td>{entry.action || '—'}</td>
                    <td>
                      <Link to={entry.href}>
                        <code>{entry.type}</code>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        );
      })}
    </div>
  );
}
