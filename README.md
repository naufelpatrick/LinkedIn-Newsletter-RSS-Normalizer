# LinkedIn Newsletter RSS Normalizer

A small Next.js service that consumes an existing RSS feed (such as one produced by `linkedin-newsletter-rss`) and emits importer-friendly RSS 2.0. It does **not** scrape LinkedIn.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/api/rss?source=https%3A%2F%2Fexample.com%2Ffeed.xml`.

The diagnostic endpoint uses the same pipeline and returns counts and warnings:

```text
/api/debug?source=https%3A%2F%2Fexample.com%2Ffeed.xml
```

## Behavior

- Repairs the common case where UTF-8 bytes were decoded as Windows-1252, using a score-based conversion that leaves valid text untouched.
- Copies full, sanitized article HTML into `content:encoded` and creates a plain, 500-character `description`.
- Preserves valid source publication dates, enclosures, inline images, headings, lists, links, figures, captions, preformatted text and horizontal rules.
- Omits invalid or missing publication dates rather than inventing one.
- Caches fetched feeds in each warm server instance for 10 minutes. Response headers also allow Vercel's edge cache to retain results for 10 minutes and serve stale data for 5 minutes while refreshing.

## Security limits

The fetcher accepts only HTTP(S), blocks credentials and non-standard ports, resolves DNS before every request, blocks loopback/private/link-local/metadata destinations, validates every redirect, follows at most three redirects, times out after 10 seconds, and reads at most 5 MB. XML containing `DOCTYPE` or `ENTITY` declarations is rejected. HTML is sanitized with an allowlist.

DNS rebinding protection is best-effort in standard serverless `fetch`: DNS is validated immediately before the request, but the runtime does not expose address pinning. For sensitive deployments, also apply an outbound network allowlist or run through an egress proxy.

## Test and deploy

```bash
npm test
npm run build
```

Import the repository into Vercel; no environment variables or database are required.

## License

MIT
