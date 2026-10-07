import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type Place = 'bc' | 'entra' | 'assistant';

type Step = {n: number; title: string; to: string; what: string; where: Place[]; who: string};

function placeLabel(place: Place): string {
  switch (place) {
    case 'bc':
      return 'Business Central';
    case 'entra':
      return 'Microsoft Entra ID';
    case 'assistant':
      return translate({id: 'setupFlow.place.assistant', message: 'AI assistant'});
  }
}

/**
 * The setup steps at a glance: what happens, where, and who is needed. This is
 * the only overview of the steps; each step page owns its details. Keep the
 * wording in step with docs/setup/*.md (and the Icelandic text in i18n/is-IS/code.json
 * in step with the Icelandic step pages).
 */
function getSteps(): Step[] {
  return [
    {
      n: 1,
      title: translate({id: 'setupFlow.step1.title', message: 'Get the app'}),
      to: '/setup/get-the-app/',
      what: translate({id: 'setupFlow.step1.what', message: 'Install Bifröst Foundation and the Bifröst apps you want.'}),
      where: ['bc'],
      who: translate({id: 'setupFlow.step1.who', message: 'A Business Central user with D365 EXTENSION MGT or SUPER'}),
    },
    {
      n: 2,
      title: translate({id: 'setupFlow.step2.title', message: 'Set up Business Central'}),
      to: '/setup/business-central/',
      what: translate({
        id: 'setupFlow.step2.what',
        message: 'Run the setup wizard once per company, and give people and apps permission.',
      }),
      where: ['bc'],
      who: translate({
        id: 'setupFlow.step2.who',
        message:
          'A Business Central administrator (SUPER for outbound HTTP, SECURITY or SUPER for permissions), and someone entitled to accept terms for the company',
      }),
    },
    {
      n: 3,
      title: translate({id: 'setupFlow.step3.title', message: 'Consent once'}),
      to: '/setup/consent/',
      what: translate({
        id: 'setupFlow.step3.what',
        message: 'Give the Bifröst MCP server consent once, so assistants can sign your users in.',
      }),
      where: ['entra'],
      who: translate({
        id: 'setupFlow.step3.who',
        message: 'A Global or Application Administrator in Microsoft Entra ID, once for the organisation',
      }),
    },
    {
      n: 4,
      title: translate({id: 'setupFlow.step4.title', message: 'Set up your data'}),
      to: '/setup/data-setup/',
      what: translate({
        id: 'setupFlow.step4.what',
        message: 'Choose which fields agents should not get, and how long logs are kept.',
      }),
      where: ['bc'],
      who: translate({
        id: 'setupFlow.step4.who',
        message: 'The Business Central administrator, with whoever owns the data',
      }),
    },
    {
      n: 5,
      title: translate({id: 'setupFlow.step5.title', message: 'Check it and invite your users'}),
      to: '/setup/first-call/',
      what: translate({
        id: 'setupFlow.step5.what',
        message: 'Connect yourself first and ask one question, then send your users their part of the setup.',
      }),
      where: ['assistant', 'bc'],
      who: translate({id: 'setupFlow.step5.who', message: 'The Business Central administrator'}),
    },
  ];
}

export default function SetupFlow(): ReactNode {
  const steps = getSteps();
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
                <span className={styles.srOnly}>
                  <Translate id="setupFlow.where">Where:</Translate>{' '}
                </span>
                {step.where.map((place) => (
                  <span key={place} className={`${styles.place} ${styles[place]}`}>
                    {placeLabel(place)}
                  </span>
                ))}
              </div>
            </div>
            <p className={styles.who}>
              <strong>
                <Translate id="setupFlow.who">Who:</Translate>
              </strong>{' '}
              {step.who}
            </p>
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>
        <Translate id="setupFlow.caption">
          The company's setup steps: what happens, where, and who is needed. Do them in a sandbox first,
          then again in production. Each user then connects their own assistant.
        </Translate>
      </figcaption>
    </figure>
  );
}
