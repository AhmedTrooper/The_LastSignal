import { EAGLE_AUDIO_MANIFEST } from "@/lib/eagle-thoughts";

export function GET() {
  return Response.json(EAGLE_AUDIO_MANIFEST, {
    headers: {
      "Content-Disposition": 'attachment; filename="eagle-narration-manifest.json"',
      "Cache-Control": "no-cache",
    },
  });
}
