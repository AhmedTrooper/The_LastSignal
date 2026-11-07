import { INGENUITY_AUDIO_MANIFEST } from "@/lib/ingenuity-thoughts";
export function GET() { return Response.json(INGENUITY_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="ingenuity-narration-manifest.json"', "Cache-Control": "no-cache" } }); }
