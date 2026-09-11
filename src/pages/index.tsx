import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, {translate} from '@docusaurus/Translate';
import {apps} from '../../apps';

const summaries: Record<string, string> = {
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

function AppCard({id, title, wave}: {id: string; title: string; wave: 1 | 2}): ReactNode {
  return (
    <Link className="bifrostCard" to={`/${id}/`}>
      <img src={useBaseUrl(`img/${id}.png`)} alt="" role="presentation" />
      <h3>{title}</h3>
      <p>{summaries[id]}</p>
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
        <h1>Bifröst</h1>
        <p>
          <Translate id="home.tagline">
            A family of Microsoft Dynamics 365 Business Central extensions by Origo. One kernel,
            one message-type contract, and a growing set of apps that connect Business Central to
            banks, storage, documents, schedules and language models.
          </Translate>
        </p>
      </header>
      <main className="container">
        <div className="bifrostGrid">
          {apps.map((app) => (
            <AppCard key={app.id} id={app.id} title={app.title} wave={app.wave} />
          ))}
        </div>
        <div className="bifrostLinks">
          <Link className="bifrostCard" to="/extensibility/">
            <h3>
              <Translate id="home.extensibility.title">Build on Bifröst</Translate>
            </h3>
            <p>
              <Translate id="home.extensibility.body">
                How to write a dependent app: extend the message type enum, implement the message
                interface, add a help codeunit per domain, and hand your setup page to Bifröst Setup.
              </Translate>
            </p>
          </Link>
          <Link className="bifrostCard" to="/skills/">
            <h3>
              <Translate id="home.skills.title">Skills for AI agents</Translate>
            </h3>
            <p>
              <Translate id="home.skills.body">
                Reference material for agents that drive Business Central through the Bifröst API
                and the Origo BC MCP server.
              </Translate>
            </p>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
