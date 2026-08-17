export default function Home() {
  return (
    <main>
      <p className="eyebrow">Open source RSS utility</p>
      <h1>LinkedIn Newsletter<br />RSS Normalizer</h1>
      <p className="lead">Turn an existing newsletter feed into clean RSS 2.0 with full article content and corrected text encoding.</p>
      <section>
        <h2>Use the endpoint</h2>
        <code>/api/rss?source=https://example.com/feed.xml</code>
        <p>Inspect a feed first with <code>/api/debug?source=…</code>.</p>
      </section>
      <p className="note">No LinkedIn scraping. No database. Feeds are cached for 10 minutes.</p>
    </main>
  );
}
