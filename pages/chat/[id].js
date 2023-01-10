import styled from "styled-components";

import Head from "next/head";

//Components...
import SideBar from "../components/SideBar";
import ChatScreen from "../components/ChatScreen";

import { db, auth } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { getRecipientEmail } from "../../lib/chatRowUtils";

const Chat = ({ messages, chats }) => {
  const { currentUser } = auth;
  const recipientEmail = getRecipientEmail(currentUser.email, chats.users);

  return (
    <Container>
      <Head>
        <title>Chat | {recipientEmail}</title>
      </Head>
      <SideBar />
      <ChatContainer>
        <ChatScreen messages={messages} recipientEmail={recipientEmail} />
      </ChatContainer>
    </Container>
  );
};

export default Chat;

export const getServerSideProps = async (context) => {
  const innerCollectionRef = collection(
    db,
    `Chats/${context.query.id}/messages`
  );
  const Query = query(innerCollectionRef, orderBy("timestamp", "asc"));
  const messages = await getDocs(Query);

  const chats = await getDoc(doc(db, "Chats", context.query.id));

  return {
    props: {
      messages: JSON.stringify(
        messages.docs.map((message) => ({
          id: message.id,
          ...message.data(),
        }))
      ),
      chats: {
        id: chats.id,
        ...chats.data(),
      },
    },
  };
};

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
`;
