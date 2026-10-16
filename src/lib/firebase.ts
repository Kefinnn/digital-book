/**
 * Google Firebase Configuration Placeholder
 * Siapkan environment variables berikut di .env.local saat menghubungkan Firebase:
 *
 * NEXT_PUBLIC_FIREBASE_API_KEY=...
 * NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 * NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
 * NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
 * NEXT_PUBLIC_FIREBASE_APP_ID=...
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "netflix-books.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "netflix-books",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "netflix-books.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:000000000000",
};

// Placeholder untuk instance Auth & Firestore
export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

export const getFirebaseApp = () => {
  if (!isFirebaseConfigured) {
    console.info("[Firebase] Mode lokal dummy aktif. Konfigurasi kredensial di .env.local untuk menghubungkan Firebase.");
  }
  return null;
};
