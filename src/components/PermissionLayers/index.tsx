import type {ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

/**
 * One concrete request and the permission checks it has to pass, with what the
 * user sees when a check fails. Names follow docs/setup/business-central.md;
 * facts checked against Foundation (the G/L posting gate on posting a sales document).
 * Field Access is not part of posting: it applies to record reads and writes.
 */
function getChecks(): {id: string; q: string; how: string; no: string}[] {
  return [
    {
      id: 'bifrost',
      q: translate({id: 'permissionLayers.check1.q', message: 'May Sigga use Bifröst at all?'}),
      how: translate({id: 'permissionLayers.check1.how', message: 'She has the BIFROST API ori permission set'}),
      no: translate({id: 'permissionLayers.check1.no', message: 'The call is refused'}),
    },
    {
      id: 'bc',
      q: translate({id: 'permissionLayers.check2.q', message: 'May Sigga do this in Business Central?'}),
      how: translate({
        id: 'permissionLayers.check2.how',
        message: 'Her ordinary Business Central permissions allow posting sales invoices',
      }),
      no: translate({id: 'permissionLayers.check2.no', message: 'Refused: she does not have that permission'}),
    },
    {
      id: 'gate',
      q: translate({id: 'permissionLayers.check3.q', message: 'May she post through Bifröst?'}),
      how: translate({
        id: 'permissionLayers.check3.how',
        message:
          'She has the posting gate BIFROST GL Post ori, which covers sales and purchase documents as well as general journals',
      }),
      no: translate({
        id: 'permissionLayers.check3.no',
        message: 'Refused: posting, and a posting preview, need that permission set. Reading and preparing still work',
      }),
    },
  ];
}

export default function PermissionLayers(): ReactNode {
  const checks = getChecks();
  return (
    <figure className={styles.figure}>
      <p className={styles.ask}>
        <Translate
          id="permissionLayers.ask"
          values={{
            request: (
              <em>
                <Translate id="permissionLayers.request">"Post the sales invoice for Adatum."</Translate>
              </em>
            ),
          }}>
          {'Sigga asks her assistant: {request} Before Business Central posts anything, Bifröst checks:'}
        </Translate>
      </p>
      <ol className={styles.checks} role="list">
        {checks.map((c, i) => (
          <li key={c.id} className={styles.check}>
            <span className={styles.n} aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <strong>{c.q}</strong>
              <span className={styles.how}>{c.how}</span>
              <span className={styles.no}>
                <span className={styles.label}>
                  <Translate id="permissionLayers.ifNot">If not:</Translate>
                </span>{' '}
                {c.no}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>
        <Translate id="permissionLayers.caption">
          Every check must pass; any one of them can refuse the call on its own.
        </Translate>
      </figcaption>
    </figure>
  );
}
