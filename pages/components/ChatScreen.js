import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import { auth, db } from "../../firebase";

import { Avatar, IconButton } from "@material-ui/core";
import MoreVerticleIcon from "@material-ui/icons/MoreVert";
import AttachFile from "@material-ui/icons/AttachFile";
import InsertEmoticon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

import {
  onSnapshot,
  query,
  collection,
  orderBy,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Message from "./Message";

//Format timestamp
import TimeAgo from "react-timeago";

const ChatScreen = ({ messages, recipientEmail }) => {
  const endOfMessageDivRef = useRef(null);
  const { currentUser } = auth;
  const router = useRouter();
  const { id } = router.query;

  const [messagesSnapshot, setMessagesSnapshot] = useState([]);
  const [recipientEmailSnapshot, setRecipientEmailSnapshot] = useState();
  const [input, setInput] = useState("");

  useEffect(
    () =>
      onSnapshot(doc(db, "Users", recipientEmail), (snapshot) =>
        setRecipientEmailSnapshot(snapshot.data())
      ),
    [recipientEmail]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, `Chats/${id}/messages`),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          if (!snapshot.empty) {
            setMessagesSnapshot(
              snapshot.docs.map((message) => ({
                id: message.id,
                ...message.data(),
              }))
            );
          } else {
            setMessagesSnapshot(JSON.parse(messages));
          }
        }
      ),
    [id]
  );

  const showMessages = () => {
    if (messagesSnapshot.length === 0) return;
    return messagesSnapshot.map((message) => (
      <Message
        key={message.id}
        user={message.user}
        message={message.message}
        photoURL={message.photoURL}
        timestamp={message.timestamp}
      />
    ));
  };

  const scrollToBottom = () => {
    endOfMessageDivRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    setDoc(
      doc(db, "Users", currentUser.email),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    )
      .then(
        addDoc(collection(db, `Chats/${router.query.id}/messages`), {
          timestamp: serverTimestamp(),
          message: input,
          user: currentUser.email,
          photoURL: currentUser.photoURL,
        })
      )
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setInput("");
        scrollToBottom();
      });
  };

  return (
    <Container>
      <Header>
        {recipientEmailSnapshot ? (
          <Avatar
            src={recipientEmailSnapshot.photoURL}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <Avatar style={{ cursor: "pointer" }}>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientEmailSnapshot ? (
            <p>
              Last Active:{" "}
              <TimeAgo
                date={new Date(recipientEmailSnapshot?.lastSeen.seconds * 1000)}
              />
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVerticleIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessagesContainer>
        {showMessages()}
        {scrollToBottom()}
        <EndOfMessage ref={endOfMessageDivRef} />
      </MessagesContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
        ></Input>
        <button hidden disabled={!input} onClick={sendMessage} type="submit">
          Send Message
        </button>
        <IconButton>
          <MicIcon />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin-left: 15px;

  > h3 {
    margin: 0;
    margin-bottom: 3px;
  }

  > p {
    margin: 0;
    font-style: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessagesContainer = styled.div`
  min-height: 90vh;
  padding: 30px;
  padding-top: 120px;
  background-color: #e5ded8;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 20;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 10px;
  margin: 0 15px;
`;
