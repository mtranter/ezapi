import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (<>
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="quickstart">
            Quickstart ⏱️
          </Link>
        </div>
      </div>
    </header>
  </>);
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [showAlert, setShowAlert] = React.useState(true);
  return (<>
    {showAlert && <div className={styles.headerAlert}>This documentation is for EZ API version {siteConfig.customFields.docsSupportVersion}<span className={styles.headerAlertClose} onClick={() => setShowAlert(false)}>X</span></div>}
    
    <Layout
      title={siteConfig.title}
      description="A typesafe, composable Typescript HTTP API DSL <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
    </>
  );
}
