import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * The Bifröst app logo on a page of its own, for anyone who needs a URL to it.
 * Deliberately unlisted: not in the navbar or footer, not linked from any page, left out of the
 * sitemap and the site search (docusaurus.config.ts), and marked noindex for search engines.
 */
export default function Logo(): ReactNode {
  const src = useBaseUrl('img/foundation.png');
  return (
    <Layout title="Bifröst logo" description="The Bifröst app logo.">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 1rem'}}>
        <img src={src} alt="Bifröst logo" width={250} height={250} />
      </main>
    </Layout>
  );
}
