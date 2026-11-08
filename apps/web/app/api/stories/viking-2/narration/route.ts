import { VIKING_TWO_AUDIO_MANIFEST } from "@/lib/viking-two-thoughts";

export function GET() {
  return Response.json(VIKING_TWO_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="viking-2-narration-production.json"', "Cache-Control": "no-cache" } });
}
