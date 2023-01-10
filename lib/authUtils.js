import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const signOutFromGoogle = async (auth) => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(error.message);
  }
};

export const signInWithGoogle = (auth) => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((error) => {
      const errorMessage = error.message;
      signOutFromGoogle(auth);
      alert(errorMessage);
    });
};
