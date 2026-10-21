import { create } from "zustand";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Tribute {
  id: string;
  heroSlug?: string;
  name: string;
  message: string;
  date: string;
  photoUrl?: string;
  isFirebase?: boolean;
}

const INITIAL_TRIBUTES: Tribute[] = [
  {
    id: "1",
    heroSlug: "opportunity",
    name: "A fellow wanderer",
    message:
      "Thank you for showing us what perseverance and hope look like across 45 kilometres of Martian dust.",
    date: "Feb 14, 2019",
  },
  {
    id: "2",
    heroSlug: "ingenuity",
    name: "Skywatcher",
    message:
      "72 flights through an alien sky. You proved that the impossible was just waiting to take off.",
    date: "Jan 26, 2024",
  },
  {
    id: "3",
    heroSlug: "insight",
    name: "Earth Seismology Team",
    message:
      "You heard the heartbeat of Mars when nobody else could. Rest easy beneath the dust.",
    date: "Dec 20, 2022",
  },
  {
    id: "4",
    heroSlug: "spirit",
    name: "Stargazer",
    message:
      "From Husband Hill to Troy, you fought for every centimetre. We will never forget you.",
    date: "Apr 1, 2010",
  },
];

interface TributesState {
  tributes: Tribute[];
  isLoading: boolean;
  fetchFirebaseTributes: () => Promise<void>;
  addTribute: (
    heroSlug: string,
    name: string,
    message: string,
    userPhotoUrl?: string
  ) => Promise<void>;
  getTributesForHero: (heroSlug: string) => Tribute[];
}

let activeUnsubscribe: Unsubscribe | null = null;

export const useTributesStore = create<TributesState>((set, get) => ({
  tributes: INITIAL_TRIBUTES,
  isLoading: false,

  fetchFirebaseTributes: async () => {
    set({ isLoading: true });

    // 1. Fallback REST fetch function for instant response
    const fallbackRestFetch = async () => {
      try {
        const res = await fetch(
          "https://firestore.googleapis.com/v1/projects/thelastsignal/databases/(default)/documents/tributes"
        );
        if (!res.ok) {
          set({ isLoading: false });
          return;
        }
        const data = await res.json();
        if (!data.documents || !Array.isArray(data.documents)) {
          set({ isLoading: false });
          return;
        }

        type FirestoreDoc = {
          name: string;
          createTime?: string;
          fields?: Record<string, { stringValue?: string; timestampValue?: string }>;
        };

        const restTributes: Tribute[] = (data.documents as FirestoreDoc[])
          .map((docItem: FirestoreDoc) => {
            const f = docItem.fields || {};
            const id = f.id?.stringValue || docItem.name.split("/").pop() || "";
            const name =
              f.userName?.stringValue ||
              f.name?.stringValue ||
              f.author?.stringValue ||
              "Explorer";
            const message = f.text?.stringValue || f.message?.stringValue || "";
            const heroSlug = f.heroSlug?.stringValue || "all";
            const photoUrl = f.userPhotoUrl?.stringValue || f.photoUrl?.stringValue;
            const rawDate = f.createdAt?.timestampValue || docItem.createTime || "";
            let dateStr = "Recent";
            try {
              if (rawDate) {
                dateStr = new Date(rawDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }
            } catch {
              // fallback
            }

            return {
              id,
              heroSlug,
              name,
              message,
              date: dateStr,
              photoUrl,
              isFirebase: true,
            };
          })
          .filter((t: Tribute) => t.message.trim().length > 0);

        set((state) => {
          const restIds = new Set(restTributes.map((r) => r.id));
          const filteredMock = state.tributes.filter(
            (m) => !restIds.has(m.id) && !m.isFirebase
          );
          return { tributes: [...restTributes, ...filteredMock], isLoading: false };
        });
      } catch (err) {
        console.warn("Failed to fetch Firebase tributes via REST:", err);
        set({ isLoading: false });
      }
    };

    // 2. Setup real-time listener if not already active
    if (!activeUnsubscribe) {
      try {
        const tributesCol = collection(db, "tributes");
        const q = query(tributesCol);
        activeUnsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const remoteTributes: Tribute[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              if (data.status !== "blocked") {
                const message = (data.text || data.message || "").trim();
                if (message) {
                  let dateStr = "Recent";
                  try {
                    const ts = data.createdAt;
                    if (ts?.toDate) {
                      dateStr = ts.toDate().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    } else if (ts?.seconds) {
                      dateStr = new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }
                  } catch {
                    // date fallback
                  }

                  remoteTributes.push({
                    id: data.id || d.id,
                    heroSlug: data.heroSlug || "all",
                    name: data.userName || data.name || "Explorer",
                    message,
                    date: dateStr,
                    photoUrl: data.userPhotoUrl || data.photoUrl,
                    isFirebase: true,
                  });
                }
              }
            });

            // Merge with local mock tributes
            set((state) => {
              const remoteIds = new Set(remoteTributes.map((r) => r.id));
              const filteredMock = state.tributes.filter(
                (m) => !remoteIds.has(m.id) && !m.isFirebase
              );
              return {
                tributes: [...remoteTributes, ...filteredMock],
                isLoading: false,
              };
            });
          },
          (err) => {
            console.warn("Firestore snapshot error, falling back to REST:", err);
            fallbackRestFetch();
          }
        );
      } catch (err) {
        console.warn("Could not bind Firestore listener:", err);
        fallbackRestFetch();
      }
    }

    await fallbackRestFetch();
  },

  addTribute: async (
    heroSlug: string,
    name: string,
    message: string,
    userPhotoUrl?: string
  ) => {
    const tributeId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `mob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newTribute: Tribute = {
      id: tributeId,
      heroSlug,
      name: name.trim() || "Anonymous Explorer",
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      photoUrl: userPhotoUrl,
      isFirebase: true,
    };

    // Optimistic UI update
    set((state) => ({ tributes: [newTribute, ...state.tributes] }));

    try {
      // 1. Write via Firestore SDK
      const tributeRef = doc(db, "tributes", tributeId);
      await setDoc(tributeRef, {
        id: tributeId,
        parentId: null,
        userId: "mobile_user",
        userName: newTribute.name,
        userPhotoUrl: userPhotoUrl || "",
        heroSlug,
        text: newTribute.message,
        status: "approved",
        createdAt: serverTimestamp(),
      });
    } catch {
      // 2. Fallback to Firestore REST API if SDK write was interrupted
      try {
        await fetch(
          `https://firestore.googleapis.com/v1/projects/thelastsignal/databases/(default)/documents/tributes?documentId=${tributeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fields: {
                id: { stringValue: tributeId },
                userId: { stringValue: "mobile_user" },
                userName: { stringValue: newTribute.name },
                userPhotoUrl: { stringValue: userPhotoUrl || "" },
                heroSlug: { stringValue: heroSlug },
                text: { stringValue: newTribute.message },
                status: { stringValue: "approved" },
                createdAt: { timestampValue: new Date().toISOString() },
              },
            }),
          }
        );
      } catch {
        // Offline fallback: kept in local zustand state
      }
    }
  },

  getTributesForHero: (heroSlug: string) => {
    return get().tributes.filter(
      (t) => !t.heroSlug || t.heroSlug === "all" || t.heroSlug === heroSlug
    );
  },
}));
