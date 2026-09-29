import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, {translate} from '@docusaurus/Translate';
import {apps} from '../../apps';
import registry from '../../data/apps.json';

/** Summaries come from the app registry (data/apps.json), so they are written in one place. */
const registrySummaries: Record<string, string> = Object.fromEntries(
  (registry as {apps: {name: string; summary: string}[]}).apps.map((entry) => [entry.name, entry.summary]),
);

const fallbackSummaries: Record<string, string> = {
  foundation: 'The kernel: message types, queue, setup, secret store and the REST API every other app plugs into.',
  iceland: 'Icelandic ERP message types — national register, VAT, and local business rules.',
  'iceland-treasury': 'Bank connectors and payment services for Icelandic banks.',
  'iceland-docex': 'Electronic document exchange: Peppol/BIS 3.0, incoming and outgoing documents.',
  'language-models': 'Chat and language models — Copilot, OpenAI, Azure OpenAI, Anthropic, Gemini and xAI.',
  attachments: 'External storage — Azure Blob, Azure File Share and SharePoint.',
  orchestrator: 'Scheduling and orchestration — job queue supervision and declarative playbooks.',
  timesheets: 'Time tracking synchronised with Business Central resources and jobs.',
  'subscription-billing': 'Recurring billing and subscription management.',
  inventory: 'Item attributes — get, create, update and define via message types.',
};

function AppCard({id, title, appName, wave}: {id: string; title: string; appName: string; wave: 1 | 2}): ReactNode {
  const summary = registrySummaries[appName] ?? fallbackSummaries[id];
  return (
    <Link className="bifrostCard" to={`/${id}/`}>
      <img src={useBaseUrl(`img/${id}.png`)} alt="" role="presentation" />
      <h3>{title}</h3>
      <p>{summary}</p>
      {wave === 2 && (
        <span className="bifrostBadge">
          <Translate id="home.badge.comingSoon">Docs in progress</Translate>
        </span>
      )}
    </Link>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({id: 'home.title', message: 'Bifröst documentation'})}
      description={translate({
        id: 'home.description',
        message:
          'Documentation, in-product help and extensibility guidance for the Bifröst family of Business Central extensions by Origo.',
      })}>
      <header className="bifrostHero">
        <p style={{textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem', opacity: 0.75, marginBottom: '0.5rem'}}>
          <Translate id="home.eyebrow">Bifröst by Origo, for Microsoft Dynamics 365 Business Central</Translate>
        </p>
        <h1>
          <Translate id="home.headline">Ask Business Central. It works out how.</Translate>
        </h1>
        <p>
          <Translate id="home.tagline">
            Bifröst lets AI assistants and other systems do real work in Business Central: answer
            questions from live data, carry out tasks and run whole routines. They do it as you,
            within your permissions.
          </Translate>
        </p>
        <p>
          <Link className="button button--primary button--lg" to="/start/">
            <Translate id="home.startHere">New here? What Bifröst is</Translate>
          </Link>{' '}
          <Link className="button button--secondary button--lg" to="/start/set-up/">
            <Translate id="home.setUp">Set up Bifröst</Translate>
          </Link>
        </p>
        <p>
          <Translate id="home.onePlatform">
            One platform, with apps for Icelandic banks, document exchange, storage, schedules and
            more, and room for yours.
          </Translate>
        </p>
      </header>
      <main className="container">
        <h2 style={{marginTop: '2rem'}}>
          <Translate id="home.examples.title">What it looks like</Translate>
        </h2>
        <div className="bifrostGrid" style={{marginBottom: '2.5rem'}}>
          <div className="bifrostCard">
            <p><em><Translate id="home.examples.ask1">"How many of item 1896-S can we still promise this week, and where are they?"</Translate></em></p>
            <p><Translate id="home.examples.do1">The assistant finds the right operation, reads live availability per location and answers with the figures.</Translate></p>
          </div>
          <div className="bifrostCard">
            <p><em><Translate id="home.examples.ask2">"Turn quote SQ-1042 into an order and show me what posting would do."</Translate></em></p>
            <p><Translate id="home.examples.do2">It creates the order and previews the posting, without posting anything, so you see the result first.</Translate></p>
          </div>
          <Link className="bifrostCard" to="/orchestrator/">
            <p><em><Translate id="home.examples.ask3">"Every Friday, reconcile the bank statements and tell me what didn't match."</Translate></em></p>
            <p><Translate id="home.examples.do3">A playbook in Orchestrator runs it on schedule and logs every step.</Translate></p>
          </Link>
        </div>
        <h2>
          <Translate id="home.apps.title">The apps</Translate>
        </h2>
        <div className="bifrostGrid">
          {apps.map((app) => (
            <AppCard key={app.id} id={app.id} title={app.title} appName={app.appName} wave={app.wave} />
          ))}
        </div>
      </main>
      <section className="bifrostBand">
        <div className="container">
          <h2>
            <Translate id="home.build.title">For developers and partners</Translate>
          </h2>
          <p className="bifrostBandLead">
            <Translate id="home.build.lead">
              Add your own app to the platform, connect another system, or give an AI agent what it
              needs to work with Business Central.
            </Translate>
          </p>
          <div className="bifrostLinks">
            <Link className="bifrostPath" to="/extensibility/">
              <h3>
                <Translate id="home.extensibility.title">Build on Bifröst</Translate>
              </h3>
              <p>
                <Translate id="home.extensibility.body">
                  Make your app headless and add message types that agents can find, choose and
                  call. The full guide lives in the partner reference repository.
                </Translate>
              </p>
              <span className="bifrostPathCta">
                <Translate id="home.extensibility.cta">Start building →</Translate>
              </span>
            </Link>
            <Link className="bifrostPath" to="/foundation/reference/api/">
              <h3>
                <Translate id="home.api.title">Connect another system</Translate>
              </h3>
              <p>
                <Translate id="home.api.body">
                  One API for every operation: send a message, read the answer, get told when it is
                  done.
                </Translate>
              </p>
              <span className="bifrostPathCta">
                <Translate id="home.api.cta">API reference →</Translate>
              </span>
            </Link>
            <Link className="bifrostPath" to="/skills/">
              <h3>
                <Translate id="home.skills.title">Skills for AI agents</Translate>
              </h3>
              <p>
                <Translate id="home.skills.body">
                  What an agent loads before it works with Business Central through Bifröst: the
                  envelope, the rules and the mistakes to avoid.
                </Translate>
              </p>
              <span className="bifrostPathCta">
                <Translate id="home.skills.cta">Skills →</Translate>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
