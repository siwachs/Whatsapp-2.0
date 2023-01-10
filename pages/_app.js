import "../styles/globals.css";

import { useEffect, useState } from "react";

//Firebase ...
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";

//Pages...
import Login from "./login";
import Loading from "./components/Loading";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const tapUser = async (currentUser) => {
    try {
      await setDoc(
        doc(db, "Users", currentUser.email),
        {
          uid: currentUser.uid,
          email: currentUser.email,
          lastSeen: serverTimestamp(),
          photoURL: currentUser.photoURL,
        },
        { merge: true }
      );
    } catch (e) {}
  };

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          tapUser(currentUser);
          setUser(currentUser.uid);
        } else {
          setUser(null);
        }

        setInitialLoading(false);
      }),
    []
  );

  if (initialLoading) return <Loading />;

  if (!user) return <Login />;

  return <Component {...pageProps} />;
}
