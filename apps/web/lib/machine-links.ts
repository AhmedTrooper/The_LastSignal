/** Story-first entry point; the Explorer archive separately opens detailed profiles. */
export function machineEntryUrl(slug: string) {
  return `/heroes/${slug}/story`;
}
