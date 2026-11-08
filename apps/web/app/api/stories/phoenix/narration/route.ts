import { PHOENIX_AUDIO_MANIFEST } from "@/lib/phoenix-thoughts";

export function GET() {
  return Response.json(PHOENIX_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="phoenix-narration-production.json"', "Cache-Control": "no-cache" } });
}
