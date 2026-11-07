import { SPIRIT_AUDIO_MANIFEST } from "@/lib/spirit-thoughts";

export function GET() {
  return Response.json(SPIRIT_AUDIO_MANIFEST, { headers: { "Content-Disposition": 'attachment; filename="spirit-narration-manifest.json"', "Cache-Control": "no-cache" } });
}
