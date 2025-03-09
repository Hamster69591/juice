import "@/styles/globals.css";
import Script from 'next/script';
import Head from 'next/head';
import '../styles/animations.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        defer
        data-domain="juice.hackclub.com"
        src="https://plausible.io/js/script.js"
      />
      <Component {...pageProps} />
    </>
  );
}
