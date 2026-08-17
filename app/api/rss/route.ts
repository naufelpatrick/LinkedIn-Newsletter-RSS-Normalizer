import { errorResponse, processRequest } from "@/lib/route";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const result = await processRequest(request);
    return new Response(result.xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, s-maxage=600, stale-while-revalidate=300", "x-content-type-options": "nosniff" } });
  } catch (error) { return errorResponse(error); }
}
