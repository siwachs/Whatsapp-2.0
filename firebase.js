import { initializeApp, getApp, getApps } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FirebaseApiKey,
  authDomain: "whatsapp-clone-9b978.firebaseapp.com",
  projectId: "whatsapp-clone-9b978",
  storageBucket: "whatsapp-clone-9b978.appspot.com",
  messagingSenderId: "403552860501",
  appId: "1:403552860501:web:a05343bc864a49e73517dc",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
