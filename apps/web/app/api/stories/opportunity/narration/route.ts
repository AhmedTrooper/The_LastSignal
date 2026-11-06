import { OPPORTUNITY_AUDIO_MANIFEST } from "@/lib/opportunity-thoughts";

export function GET() {
  return Response.json(OPPORTUNITY_AUDIO_MANIFEST, {
    headers: {
      "Content-Disposition": 'attachment; filename="opportunity-narration-manifest.json"',
      "Cache-Control": "no-cache",
    },
  });
}
