# LinkedIn Newsletter RSS Normalizer

[![CI](https://github.com/naufelpatrick/LinkedIn-Newsletter-RSS-Normalizer/actions/workflows/ci.yml/badge.svg)](https://github.com/naufelpatrick/LinkedIn-Newsletter-RSS-Normalizer/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-69e4bb.svg)](LICENSE)
[![Live demo](https://img.shields.io/badge/demo-live-071019.svg)](https://linked-in-newsletter-rss-normalizer.vercel.app)

Make existing LinkedIn newsletter RSS feeds work reliably with Substack and other content importers. The service consumes an RSS feed you already have and emits clean, importer-friendly RSS 2.0. It does **not** scrape LinkedIn.

**[Try the live app](https://linked-in-newsletter-rss-normalizer.vercel.app)** · **[Deploy your own](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnaufelpatrick%2FLinkedIn-Newsletter-RSS-Normalizer)**

## Why this exists

Some generated newsletter feeds contain full articles inside `description`, omit `content:encoded`, or declare UTF-8 while carrying text decoded as Windows-1252 (`nÃ£o`, `â€”`, and similar). The feed may look valid but importers can report that no posts were found.

This normalizer:

- repairs common UTF-8/Windows-1252 mojibake without changing valid Unicode;
- copies sanitized full article HTML into `content:encoded`;
- creates a concise `description` for broad reader compatibility;
- preserves source URLs, valid publication dates, images and enclosures;
- emits RSS 2.0 with Atom and Content namespaces;
- exposes a JSON diagnostic endpoint;
- caches upstream feeds for 10 minutes.

## Use the hosted version

Paste a public RSS URL into the [live app](https://linked-in-newsletter-rss-normalizer.vercel.app), or call the API directly:

```text
https://linked-in-newsletter-rss-normalizer.vercel.app/api/rss?source=ENCODED_FEED_URL
```

Diagnostics:

```text
https://linked-in-newsletter-rss-normalizer.vercel.app/api/debug?source=ENCODED_FEED_URL
```

For production or high-volume use, deploy your own instance instead of depending on the public demo.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnaufelpatrick%2FLinkedIn-Newsletter-RSS-Normalizer)

No database or environment variables are required.

## Run locally

```bash
git clone https://github.com/naufelpatrick/LinkedIn-Newsletter-RSS-Normalizer.git
cd LinkedIn-Newsletter-RSS-Normalizer
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Processing and security

The service preserves safe rich HTML including headings, paragraphs, lists, links, images, figures, captions, preformatted text and horizontal rules. Invalid or missing publication dates are omitted rather than invented.

The fetcher accepts only HTTP(S), blocks credentials and non-standard ports, resolves DNS before every request, blocks loopback/private/link-local/metadata destinations, validates every redirect, follows at most three redirects, times out after 10 seconds, and reads at most 5 MB. XML containing `DOCTYPE` or `ENTITY` declarations is rejected. HTML is sanitized with an allowlist.

DNS rebinding protection is best-effort in standard serverless `fetch`. Sensitive deployments should also use an outbound allowlist or egress proxy. See [SECURITY.md](SECURITY.md) to report vulnerabilities privately.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), then run:

```bash
npm test
npm run build
```

## License

[MIT](LICENSE)
