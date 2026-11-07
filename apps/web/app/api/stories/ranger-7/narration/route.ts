import { RANGER_AUDIO_MANIFEST } from "@/lib/ranger-thoughts";

export function GET() {
  return Response.json(RANGER_AUDIO_MANIFEST, {
    headers: {
      "Content-Disposition": 'attachment; filename="ranger-7-narration-manifest.json"',
      "Cache-Control": "no-cache",
    },
  });
}
