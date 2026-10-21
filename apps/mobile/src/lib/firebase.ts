import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyCqAJKB62BOe08Z5JeNLj1QfaVtemSJeVA",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "thelastsignal.firebaseapp.com",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "thelastsignal",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "thelastsignal.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1003209827567",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    "1:1003209827567:web:ff338193003376b230271a",
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GM3C85S7NX",
};

export const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let authInstance: FirebaseAuth.Auth;

try {
  const getRNPersistence = (FirebaseAuth as any).getReactNativePersistence;
  if (typeof getRNPersistence === "function") {
    const appStorage = createAsyncStorage("thelastsignal_auth");
    authInstance = (FirebaseAuth as any).initializeAuth(app, {
      persistence: getRNPersistence(appStorage),
    });
  } else {
    authInstance = FirebaseAuth.getAuth(app);
  }
} catch {
  authInstance = FirebaseAuth.getAuth(app);
}

export const auth = authInstance;
export const db: Firestore = getFirestore(app);
