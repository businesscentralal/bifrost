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
    title: 'Consent once',
    to: '/setup/consent/',
    what: 'Give the Bifröst MCP server consent once, so assistants can sign your users in.',
    where: ['entra'],
    who: 'A Global or Application Administrator in Microsoft Entra ID, once for the organisation',
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
    title: 'Check it and invite your users',
    to: '/setup/first-call/',
    what: 'Connect yourself first and ask one question, then send your users their part of the setup.',
    where: ['assistant', 'bc'],
    who: 'The Business Central administrator',
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
        The company's setup steps: what happens, where, and who is needed. Do them in a sandbox first,
        then again in production. Each user then connects their own assistant.
      </figcaption>
    </figure>
  );
}
