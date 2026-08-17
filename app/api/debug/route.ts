import { errorResponse, processRequest } from "@/lib/route";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const result = await processRequest(request);
    return Response.json(result.diagnostic, { headers: { "cache-control": "public, s-maxage=600, stale-while-revalidate=300", "x-content-type-options": "nosniff" } });
  } catch (error) { return errorResponse(error); }
}
