import dns from "node:dns/promises";
import net from "node:net";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 10_000;
const cache = new Map<string, { expires: number; body: string }>();

function isPrivate(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a >= 224;
  }
  const normalized = address.toLowerCase();
  return normalized === "::1" || normalized === "::" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb") || normalized.startsWith("::ffff:");
}

async function validate(url: URL): Promise<void> {
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS sources are allowed");
  if (url.username || url.password || url.port && !["80", "443"].includes(url.port)) throw new Error("Credentials and non-standard ports are not allowed");
  if (["localhost", "localhost.localdomain", "metadata.google.internal"].includes(url.hostname.toLowerCase())) throw new Error("Private hosts are not allowed");
  const addresses = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivate(address))) throw new Error("Private or unresolved hosts are not allowed");
}

async function fetchOnce(url: URL, redirects: number): Promise<string> {
  await validate(url);
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS), headers: { accept: "application/rss+xml, application/xml, text/xml;q=0.9", "user-agent": "linkedin-newsletter-rss-normalizer/0.1" } });
  if (response.status >= 300 && response.status < 400) {
    if (redirects >= MAX_REDIRECTS) throw new Error("Too many redirects");
    const location = response.headers.get("location");
    if (!location) throw new Error("Redirect has no location");
    return fetchOnce(new URL(location, url), redirects + 1);
  }
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) throw new Error("Source exceeds the 5 MB limit");
  if (!response.body) throw new Error("Source returned an empty response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); throw new Error("Source exceeds the 5 MB limit"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder("utf-8").decode(bytes);
}

export async function fetchFeed(source: string): Promise<string> {
  let url: URL;
  try { url = new URL(source); } catch { throw new Error("Invalid source URL"); }
  const cached = cache.get(url.href);
  if (cached && cached.expires > Date.now()) return cached.body;
  const body = await fetchOnce(url, 0);
  cache.set(url.href, { body, expires: Date.now() + 10 * 60 * 1000 });
  return body;
}
