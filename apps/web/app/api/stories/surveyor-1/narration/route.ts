import { SURVEYOR_AUDIO_MANIFEST } from "@/lib/surveyor-thoughts";

export function GET() {
  return Response.json(SURVEYOR_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="surveyor-1-narration-manifest.json"', "Cache-Control": "no-cache" } });
}
