/** Machine cards open the scroll story; legacy profiles are not public entry points. */
export function machineEntryUrl(slug: string) {
  return `/heroes/${slug}/story`;
}
