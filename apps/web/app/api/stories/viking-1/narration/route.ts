import { VIKING_AUDIO_MANIFEST } from "@/lib/viking-thoughts";

export function GET() {
  return Response.json(VIKING_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="viking-1-narration-production.json"', "Cache-Control": "no-cache" } });
}
