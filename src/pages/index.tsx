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
};

function AppCard({id, title, appName}: {id: string; title: string; appName: string}): ReactNode {
  const summary = registrySummaries[appName] ?? fallbackSummaries[id];
  return (
    <Link className="bifrostCard" to={`/${id}/`}>
      <img src={useBaseUrl(`img/${id}.png`)} alt="" role="presentation" />
      <h3>{title}</h3>
      <p>{summary}</p>
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
          'Let AI assistants do real work in Business Central, as you and within your permissions. Documentation for Bifröst by Origo.',
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
            One platform. Other Bifröst apps add operations of their own, and the assistant uses
            them all together.
          </Translate>
        </p>
      </header>
      <main className="container">
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
          <Link className="bifrostCard" to="/documentation/how-it-works/#what-happens-when-you-ask">
            <p><em><Translate id="home.examples.ask3">"Which customers are over their credit limit, and how much of it is overdue?"</Translate></em></p>
            <p><Translate id="home.examples.do3">It reads balances, credit limits and open entries, and answers with a list you can check in Business Central.</Translate></p>
          </Link>
        </div>
        <h2>
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
        <h2>
          <Translate id="home.apps.title">The apps</Translate>
        </h2>
        <p>
          <Link to="/apps/">
            <Translate id="home.apps.more">Add more: banks, electronic invoices, storage, schedules and more</Translate> <span aria-hidden="true">→</span>
          </Link>
        </p>
        <div className="bifrostGrid">
          {apps.map((app) => (
            <AppCard key={app.id} id={app.id} title={app.title} appName={app.appName} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
