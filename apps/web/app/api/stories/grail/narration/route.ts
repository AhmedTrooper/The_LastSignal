import { GRAIL_AUDIO_MANIFEST } from "@/lib/grail-thoughts";

export function GET() {
  return Response.json(GRAIL_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="grail-narration-production.json"', "Cache-Control": "no-cache" } });
}
