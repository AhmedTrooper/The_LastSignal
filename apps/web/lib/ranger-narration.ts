import type { NarrationClip } from "./thought-clouds";

/** Add actual recorded clips here using IDs, revisions and fingerprints from the manifest.
 * A mismatched revision or spoken text is rejected by the reader rather than played silently.
 * Empty means scripts are ready but no produced audio has been attached yet.
 */
export const RANGER_NARRATION: Record<string, NarrationClip> = {};
