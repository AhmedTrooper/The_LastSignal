import { LCROSS_AUDIO_MANIFEST } from "@/lib/lcross-thoughts";

export function GET() {
  return Response.json(LCROSS_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="lcross-narration-manifest.json"', "Cache-Control": "no-cache" } });
}
