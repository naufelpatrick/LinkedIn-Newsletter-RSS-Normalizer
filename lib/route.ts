import { fetchFeed } from "./fetch-feed";
import { normalizeFeed } from "./xml";

export async function processRequest(request: Request) {
  const source = new URL(request.url).searchParams.get("source");
  if (!source) throw new Error("Missing source query parameter");
  const body = await fetchFeed(source);
  return normalizeFeed(body, request.url);
}

export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to process feed";
  return Response.json({ error: message }, { status: /Missing|Invalid|allowed|limit|DOCTYPE|ENTITY/.test(message) ? 400 : 502 });
}
