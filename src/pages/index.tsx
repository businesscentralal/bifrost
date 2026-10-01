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
  foundation: 'The base app every other app needs: the standard Business Central capabilities, permissions, the log and the API.',
  iceland: 'Icelandic capabilities: the national register, VAT, and local business rules.',
  'iceland-treasury': 'Bank connectors and payment services for Icelandic banks.',
  'iceland-docex': 'Electronic document exchange: Peppol/BIS 3.0, incoming and outgoing documents.',
  'language-models': 'Chat and language models — Copilot, OpenAI, Azure OpenAI, Anthropic, Gemini and xAI.',
  attachments: 'External storage — Azure Blob, Azure File Share and SharePoint.',
  orchestrator: 'Scheduling and orchestration — job queue supervision and declarative playbooks.',
  timesheets: 'Time tracking synchronised with Business Central resources and jobs.',
  'subscription-billing': 'Recurring billing and subscription management.',
  inventory: 'Item attributes: get, create, update and define them.',
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
            Bifröst lets AI assistants and other systems do real work in Business Central, not just
            answer questions about it. They answer from live data, carry out tasks and run whole
            routines, as you and within your permissions.
          </Translate>
        </p>
        <p>
          <Link className="button button--primary button--lg" to="/setup/">
            <Translate id="home.setUp">Set it up</Translate>
          </Link>{' '}
          <Link className="button button--secondary button--lg" to="/try-it-out/">
            <Translate id="home.tryIt">Try it out</Translate>
          </Link>
        </p>
        <p>
          <Translate id="home.onePlatform">
            One platform. Origo's apps add Icelandic banks, document exchange, storage and schedules,
            partners add their own, and your developers can add more. The assistant uses them all
            together.
          </Translate>
        </p>
      </header>
      <main className="container">
        <h2 style={{marginTop: '2rem'}}>
          <Translate id="home.how.title">How it works</Translate>
        </h2>
        <div className="bifrostSteps">
          <div className="bifrostStep">
            <h3><Translate id="home.how.ask.title">You ask</Translate></h3>
            <p>
              <Translate id="home.how.ask.body">
                In Copilot, ChatGPT, Claude or another assistant, in your own words, or from
                another system.
              </Translate>
            </p>
          </div>
          <div className="bifrostStep">
            <h3><Translate id="home.how.gate.title">Bifröst works out how</Translate></h3>
            <p>
              <Translate id="home.how.gate.body">
                The assistant finds the right operations, reads how to call them, and calls them
                as you. Bifröst checks your permissions and logs every call.
              </Translate>
            </p>
          </div>
          <div className="bifrostStep">
            <h3><Translate id="home.how.bc.title">Business Central does the work</Translate></h3>
            <p>
              <Translate id="home.how.bc.body">
                With its own rules, checks and entries, in your own environment, and the answer
                comes back in plain words.
              </Translate>
            </p>
          </div>
        </div>
        <p>
          <Translate id="home.how.reach">
            It can read most of your Business Central, and carry out the tasks in its capabilities:
            sales, purchasing, finance, inventory and more. Every app built on Bifröst adds new ones.
          </Translate>{' '}
          <Link to="/documentation/how-it-works/#what-it-covers-and-how-it-grows">
            <Translate id="home.how.reach.link">What it covers</Translate>
          </Link>
        </p>
        <p>
          <Link to="/documentation/how-it-works/">
            <Translate id="home.how.more">More on how Bifröst works</Translate> <span aria-hidden="true">→</span>
          </Link>
        </p>
        <h2>
          <Translate id="home.roles.title">Find your way</Translate>
        </h2>
        <div className="bifrostLinks" style={{marginBottom: '2.5rem'}}>
          <Link className="bifrostPath" to="/documentation/end-customers/users/">
            <h3><Translate id="home.roles.users.title">I use Business Central</Translate></h3>
            <p>
              <Translate id="home.roles.users.body">
                What you can ask, what it will not do, and what to do when it says no.
              </Translate>
            </p>
            <span className="bifrostPathCta"><Translate id="home.roles.users.cta">For users</Translate> <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="bifrostPath" to="/documentation/end-customers/administrators/">
            <h3><Translate id="home.roles.admins.title">I run Business Central</Translate></h3>
            <p>
              <Translate id="home.roles.admins.body">
                Permissions, what agents may see, logs and usage, and what you are responsible for.
              </Translate>
            </p>
            <span className="bifrostPathCta"><Translate id="home.roles.admins.cta">For administrators</Translate> <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="bifrostPath" to="/documentation/end-customers/developers/">
            <h3><Translate id="home.roles.devs.title">I connect other systems</Translate></h3>
            <p>
              <Translate id="home.roles.devs.body">
                One API for every operation: send a message, read the answer, get told when it is done.
              </Translate>
            </p>
            <span className="bifrostPathCta"><Translate id="home.roles.devs.cta">For developers</Translate> <span aria-hidden="true">→</span></span>
          </Link>
        </div>
        <h2 style={{marginTop: '2rem'}}>
          <Translate id="home.examples.title">What it looks like</Translate>
        </h2>
        <div className="bifrostGrid" style={{marginBottom: '2.5rem'}}>
          <Link className="bifrostCard" to="/documentation/how-it-works/#what-happens-when-you-ask">
            <p><em><Translate id="home.examples.ask1">"How many of item 1896-S can we still promise this week, and where are they?"</Translate></em></p>
            <p><Translate id="home.examples.do1">The assistant finds the right operation, reads live availability per location and answers with the figures.</Translate></p>
          </Link>
          <Link className="bifrostCard" to="/documentation/how-it-works/#what-happens-when-you-ask">
            <p><em><Translate id="home.examples.ask2">"Turn quote SQ-1042 into an order and show me what posting it would do."</Translate></em></p>
            <p><Translate id="home.examples.do2">It creates the order and previews the posting, without posting anything, so you see the result first.</Translate></p>
          </Link>
          <Link className="bifrostCard" to="/orchestrator/">
            <p><em><Translate id="home.examples.ask3">"Every Friday, reconcile the bank statements and tell me what didn't match."</Translate></em></p>
            <p><Translate id="home.examples.do3">A playbook in Orchestrator runs it on schedule and logs every step.</Translate></p>
          </Link>
        </div>
        <h2>
          <Translate id="home.apps.title">The apps</Translate>
        </h2>
        <p>
          <Link to="/apps/">
            <Translate id="home.apps.more">All apps, and how app pages differ from help</Translate> <span aria-hidden="true">→</span>
          </Link>
        </p>
        <div className="bifrostGrid">
          {apps.map((app) => (
            <AppCard key={app.id} id={app.id} title={app.title} appName={app.appName} wave={app.wave} />
          ))}
        </div>
      </main>
      <section className="bifrostBand">
        <div className="container">
          <h2>
            <Translate id="home.build.title">For partners and ISVs</Translate>
          </h2>
          <p className="bifrostBandLead">
            <Translate id="home.build.lead">
              Set Bifröst up for your customers, add your own app to the platform, or give an AI
              agent what it needs to work with Business Central.
            </Translate>
          </p>
          <div className="bifrostLinks">
            <Link className="bifrostPath" to="/documentation/partners/">
              <h3>
                <Translate id="home.partners.title">Set it up for customers</Translate>
              </h3>
              <p>
                <Translate id="home.partners.body">
                  What to think about when you set up, support or resell Bifröst for the companies
                  you work with.
                </Translate>
              </p>
              <span className="bifrostPathCta">
                <Translate id="home.partners.cta">For partners</Translate> <span aria-hidden="true">→</span>
              </span>
            </Link>
            <Link className="bifrostPath" to="/extensibility/">
              <h3>
                <Translate id="home.extensibility.title">Build on Bifröst</Translate>
              </h3>
              <p>
                <Translate id="home.extensibility.body">
                  Give your app its own capabilities, and every assistant, integration and playbook
                  can use them, behind Bifröst's permissions and log. The full guide lives in the
                  partner reference repository.
                </Translate>
              </p>
              <span className="bifrostPathCta">
                <Translate id="home.extensibility.cta">Start building</Translate> <span aria-hidden="true">→</span>
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
                <Translate id="home.skills.cta">Skills</Translate> <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
