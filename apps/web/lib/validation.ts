// Blocklist of common abusive/offensive keywords to moderate tribute messages
const PROFANITY_BLOCKLIST = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "dick",
  "cunt",
  "pussy",
  "slut",
  "whore",
  "nigger",
  "faggot",
  "chutiya",
  "madarchod",
  "bhodai",
  "khanki",
  "magi",
  "haramzada",
  "suor",
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 4-Layer Input & Payload Protection:
 * 1. Length guard (2 to 1,000 characters)
 * 2. Script & HTML tag injection block
 * 3. Repetitive character spam block
 * 4. Profanity & abusive words moderation
 */
export function validateComment(text: string): ValidationResult {
  const trimmed = text.trim();

  // 1. Size bounds check (2 - 1,000 characters)
  if (trimmed.length < 2) {
    return { valid: false, error: "Tribute is too short (minimum 2 characters)." };
  }
  if (trimmed.length > 1000) {
    return { valid: false, error: "Tribute exceeds 1,000 characters limit." };
  }

  // 2. Raw Script / HTML tag injection block
  const htmlTagRegex = /<\/?(script|iframe|embed|object|style)[^>]*>/gi;
  if (htmlTagRegex.test(trimmed)) {
    return { valid: false, error: "Scripts or HTML tags are not allowed." };
  }

  // 3. Repetitive character spam block (e.g. "aaaaa..." or "!!!!!!!...")
  const repeatedCharRegex = /(.)\1{14,}/;
  if (repeatedCharRegex.test(trimmed)) {
    return { valid: false, error: "Repeated characters detected (spam prevention)." };
  }

  // 4. Abusive language / profanity moderation
  const normalized = trimmed.toLowerCase();
  for (const word of PROFANITY_BLOCKLIST) {
    // Match whole words or boundary wrapped terms
    const wordPattern = new RegExp(`\\b${word}\\b`, "i");
    if (wordPattern.test(normalized)) {
      return {
        valid: false,
        error: "Your tribute contains inappropriate language and cannot be posted.",
      };
    }
  }

  return { valid: true };
}
