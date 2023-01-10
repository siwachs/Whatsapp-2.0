import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

export const getRecipientEmail = (loggedInUser, usersArray) => {
  return usersArray.filter((userToFilter) => userToFilter !== loggedInUser)[0];
};

export const getRecipientEmailProfile = async (recipientEmail) => {
  const snapshot = await getDoc(doc(db, "Users", recipientEmail));
  if (snapshot.exists()) return snapshot.data();
};
