import { INSIGHT_AUDIO_MANIFEST } from "@/lib/insight-thoughts";

export function GET() {
  return Response.json(INSIGHT_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="insight-narration-manifest.json"', "Cache-Control": "no-cache" } });
}
