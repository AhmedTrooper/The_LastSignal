import { PATHFINDER_AUDIO_MANIFEST } from "@/lib/pathfinder-thoughts";
export function GET() { return Response.json(PATHFINDER_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="pathfinder-sojourner-narration.json"', "Cache-Control": "no-cache" } }); }
