import { FeedBuilder } from "@/components/FeedBuilder";

const features = [
  ["Fix broken encoding", "Repairs common UTF-8 and Windows-1252 mojibake without touching valid text."],
  ["Keep full articles", "Creates content:encoded while preserving safe headings, lists, links, figures and images."],
  ["Importer friendly", "Emits valid RSS 2.0 with original dates, GUIDs and image enclosures."],
  ["Safe by default", "Includes SSRF protection, redirect and response limits, timeouts and HTML sanitization."],
];

export default function Home() {
  return (
    <main>
      <nav aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="RSS Normalizer home"><span aria-hidden="true">◔</span> RSS Normalizer</a>
        <div className="navLinks"><a href="#how-it-works">How it works</a><a href="https://github.com/naufelpatrick/LinkedIn-Newsletter-RSS-Normalizer">GitHub ↗</a></div>
      </nav>
      <section className="hero" id="top">
        <div className="status"><span /> Open source · MIT licensed</div>
        <h1>Make newsletter RSS<br /><em>work everywhere.</em></h1>
        <p className="lead">Normalize an existing LinkedIn newsletter feed for Substack and other content importers. No scraping, database or signup.</p>
        <FeedBuilder />
        <p className="privacy">Your URL is processed on demand and cached for 10 minutes. We do not store feeds.</p>
      </section>
      <section className="workflow" id="how-it-works">
        <p className="sectionLabel">One clean step in your publishing flow</p>
        <div className="flow" aria-label="Processing flow"><span>LinkedIn Newsletter</span><b>→</b><span>Existing RSS feed</span><b>→</b><span className="active">RSS Normalizer</span><b>→</b><span>Substack & readers</span></div>
      </section>
      <section className="features">
        {features.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p></article>)}
      </section>
      <section className="openSource">
        <div><p className="sectionLabel">Built in public</p><h2>Use it. Inspect it.<br />Make it better.</h2><p>The code is small, documented and ready for a one-click Vercel deployment.</p></div>
        <div className="actions"><a className="button primary" href="https://github.com/naufelpatrick/LinkedIn-Newsletter-RSS-Normalizer">View on GitHub ↗</a><a className="button secondary" href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnaufelpatrick%2FLinkedIn-Newsletter-RSS-Normalizer">Deploy your own ↗</a></div>
      </section>
      <footer><span>LinkedIn Newsletter RSS Normalizer</span><span>MIT License · Built by <a href="https://github.com/naufelpatrick">Patrick Naufel</a></span></footer>
    </main>
  );
}
