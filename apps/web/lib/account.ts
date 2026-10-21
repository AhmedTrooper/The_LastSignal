import { collection, query, where, getDocs, writeBatch, doc, deleteDoc } from "firebase/firestore";
import { deleteUser, reauthenticateWithPopup, GoogleAuthProvider, type User } from "firebase/auth";
import { db } from "./firebase";

export interface DeleteAccountResult {
  success: boolean;
  tributesDeleted: number;
  error?: string;
  requiresRecentLogin?: boolean;
}

/**
 * Permanently deletes the user's account and all associated data:
 * 1. Queries and deletes all tributes posted by the user in Cloud Firestore.
 * 2. Deletes the user profile document in `users/{uid}`.
 * 3. Deletes the Firebase Authentication user record.
 * Handles `auth/requires-recent-login` by prompting re-authentication.
 */
export async function deleteUserDataAndAccount(user: User): Promise<DeleteAccountResult> {
  const uid = user.uid;
  let tributesDeleted = 0;

  try {
    // 1. Find and delete all tributes submitted by this user
    const tributesRef = collection(db, "tributes");
    const q = query(tributesRef, where("userId", "==", uid));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const batch = writeBatch(db);
      snap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
        tributesDeleted++;
      });
      await batch.commit();
    }

    // 2. Delete user profile document in Firestore
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);

    // 3. Delete Firebase Auth user
    try {
      await deleteUser(user);
    } catch (authErr: unknown) {
      const e = authErr as { code?: string; message?: string };
      if (e?.code === "auth/requires-recent-login") {
        // Re-authenticate and retry
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
        await deleteUser(user);
      } else {
        throw authErr;
      }
    }

    return { success: true, tributesDeleted };
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    return {
      success: false,
      tributesDeleted,
      error: e?.message || "Failed to delete account. Please try again.",
      requiresRecentLogin: e?.code === "auth/requires-recent-login",
    };
  }
}
