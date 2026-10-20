import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  getDoc,
  query,
  onSnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { validateComment } from "./validation";

export interface Tribute {
  id: string;
  parentId: string | null;
  userId: string;
  userName: string;
  userPhotoUrl: string;
  text: string;
  status: "approved" | "blocked";
  createdAt: Timestamp | null;
}

export interface CreateTributeParams {
  userId: string;
  userName: string;
  userPhotoUrl: string;
  text: string;
  parentId?: string | null;
}

/**
 * Submits a tribute to Firestore with atomic batch write:
 * 1. Validates text payload (size, injection, abusive language)
 * 2. Enforces 60-second cooldown per user
 * 3. Commits tribute doc and updates user's lastCommentedAt timestamp
 */
export async function submitTribute({
  userId,
  userName,
  userPhotoUrl,
  text,
  parentId = null,
}: CreateTributeParams): Promise<{ success: boolean; tributeId: string }> {
  // 1. Text & Payload Validation
  const validation = validateComment(text);
  if (!validation.valid) {
    throw new Error(validation.error ?? "Invalid tribute text.");
  }

  // 2. Client-side fast cooldown verification
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    if (userData.lastCommentedAt) {
      const lastCommentTime = userData.lastCommentedAt.toMillis();
      const now = Date.now();
      const diffInSeconds = Math.floor((now - lastCommentTime) / 1000);

      if (diffInSeconds < 60) {
        const remaining = 60 - diffInSeconds;
        throw new Error(`Please wait ${remaining}s before posting another tribute.`);
      }
    }
  }

  // 3. Atomic Batch Write: Create Tribute & Update User's lastCommentedAt
  const batch = writeBatch(db);
  const tributeId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `trib_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const tributeRef = doc(db, "tributes", tributeId);

  batch.set(tributeRef, {
    id: tributeId,
    parentId: parentId || null,
    userId,
    userName: userName || "Anonymous",
    userPhotoUrl: userPhotoUrl || "",
    text: text.trim(),
    status: "approved",
    createdAt: serverTimestamp(),
  });

  // Update user's lastCommentedAt timestamp (use set with merge to succeed even if user doc does not exist yet)
  batch.set(
    userRef,
    {
      uid: userId,
      lastCommentedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();
  return { success: true, tributeId };
}

/**
 * Subscribes to real-time tributes across the memorial transmission wall.
 * Avoids multi-field composite indexes by reading the collection and sorting client-side.
 */
export function subscribeTributes(
  onUpdate: (tributes: Tribute[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const tributesCol = collection(db, "tributes");
  const q = query(tributesCol);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Tribute[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Tribute;
        if (data.status !== "blocked") {
          list.push({ ...data, id: d.id });
        }
      });

      // Sort client-side by createdAt descending (newest first)
      list.sort((a, b) => {
        const getMillis = (ts: Timestamp | null | undefined): number => {
          if (!ts) return 0;
          if (typeof ts.toMillis === "function") return ts.toMillis();
          const obj = ts as unknown as { seconds?: number };
          if (typeof obj.seconds === "number") return obj.seconds * 1000;
          return 0;
        };
        return getMillis(b.createdAt) - getMillis(a.createdAt);
      });

      onUpdate(list);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}
