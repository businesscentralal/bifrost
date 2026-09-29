import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Place = 'bc' | 'entra' | 'assistant';

const placeLabel: Record<Place, string> = {
  bc: 'Business Central',
  entra: 'Microsoft Entra ID',
  assistant: 'AI assistant',
};

type Step = {n: number; title: string; to: string; what: string; where: Place[]; who: string};

/**
 * The setup steps at a glance: what happens, where, and who is needed. This is
 * the only overview of the steps; each step page owns its details. Keep the
 * wording in step with docs/setup/*.md.
 */
const steps: Step[] = [
  {
    n: 1,
    title: 'Get the app',
    to: '/setup/get-the-app/',
    what: 'Install Bifröst Foundation and the Bifröst apps you want.',
    where: ['bc'],
    who: 'A Business Central user with D365 EXTENSION MGT or SUPER',
  },
  {
    n: 2,
    title: 'Set up Business Central',
    to: '/setup/business-central/',
    what: 'Run the setup wizard once per company, and give people and apps permission.',
    where: ['bc'],
    who: 'A Business Central administrator (SUPER for outbound HTTP, SECURITY or SUPER for permissions), and someone entitled to accept terms for the company',
  },
  {
    n: 3,
    title: 'Connect your AI assistant',
    to: '/setup/connect-your-ai/',
    what: 'Consent once for the organisation, then connect an assistant to test with.',
    where: ['entra', 'assistant'],
    who: 'A Global or Application Administrator in Microsoft Entra ID, once, after step 2; then the Business Central administrator',
  },
  {
    n: 4,
    title: 'Set up your data',
    to: '/setup/data-setup/',
    what: 'Choose which fields agents should not get, and how long logs are kept.',
    where: ['bc'],
    who: 'The Business Central administrator, with whoever owns the data',
  },
  {
    n: 5,
    title: 'Make the first call',
    to: '/setup/first-call/',
    what: 'Check the setup with one question, then let your users connect.',
    where: ['assistant', 'bc'],
    who: 'The administrator, then each user',
  },
];

export default function SetupFlow(): ReactNode {
  return (
    <figure className={styles.flow}>
      <ol className={styles.steps} role="list">
        {steps.map((step) => (
          <li key={step.n} className={styles.step}>
            <div className={styles.head}>
              <span className={styles.number} aria-hidden="true">{step.n}</span>
              <Link className={styles.title} to={step.to}>
                {step.title}
              </Link>
            </div>
            <div className={styles.body}>
              <p className={styles.what}>{step.what}</p>
              <div className={styles.places}>
                <span className={styles.srOnly}>Where: </span>
                {step.where.map((place) => (
                  <span key={place} className={`${styles.place} ${styles[place]}`}>
                    {placeLabel[place]}
                  </span>
                ))}
              </div>
            </div>
            <p className={styles.who}>
              <strong>Who:</strong> {step.who}
            </p>
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>
        The setup steps: what happens, where, and who is needed. Do them in a sandbox first, then
        again in production.
      </figcaption>
    </figure>
  );
}
