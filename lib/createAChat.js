import { db } from "../firebase";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";

export const isUserExist = async (email) => {
  const docRef = doc(db, "Users", email);
  const capturedData = await getDoc(docRef);
  return capturedData;
};

export const isChatAlreadyExist = async (recipientEmail, currentUserEmail) => {
  const queryObj = query(
    collection(db, "Chats"),
    where("users", "array-contains", currentUserEmail)
  );
  const querySnapshot = await getDocs(queryObj);
  const filteredData = querySnapshot.docs.find((chat) =>
    chat.data().users.find((user) => user === recipientEmail)
  );
  if (!filteredData) return false;
  return true;
};
