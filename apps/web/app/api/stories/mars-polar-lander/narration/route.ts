import { MPL_AUDIO_MANIFEST } from "@/lib/mpl-thoughts";

export function GET() {
  return Response.json(MPL_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="mars-polar-lander-narration-production.json"', "Cache-Control": "no-cache" } });
}
