import { LRV_AUDIO_MANIFEST } from "@/lib/lrv-thoughts";
export function GET() { return Response.json(LRV_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="apollo-15-rover-narration.json"', "Cache-Control": "no-cache" } }); }
