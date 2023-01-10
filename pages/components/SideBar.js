import { useEffect, useState } from "react";
import styled from "styled-components";

import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVerticle from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";

import * as EmailValidator from "email-validator";

import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import ChatRow from "./ChatRow";

//Utils...
import { isUserExist, isChatAlreadyExist } from "../../lib/createAChat";
import { getRecipientEmail } from "../../lib/chatRowUtils";
import { signOutFromGoogle } from "../../lib/authUtils";

const SideBar = () => {
  const { currentUser } = auth;
  const [chats, setChats] = useState([]);

  //Get Realtime Updates of Chats...
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "Chats"),
          where("users", "array-contains", currentUser.email)
        ),
        (snapshot) =>
          setChats(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    []
  );

  const createAChat = async () => {
    const input = prompt("Enter A Registered Email")?.trim();
    if (!input) return;

    if (!EmailValidator.validate(input)) {
      alert("Invalid Email Address.");
      return;
    } else if (currentUser.email === input) {
      alert("You can not use your own email address.");
      return;
    }

    const verifyiedUser = await isUserExist(input);
    if (!verifyiedUser.exists()) {
      alert("Unregistered User.");
      return;
    }

    if (await isChatAlreadyExist(input, currentUser.email)) {
      alert("Chat Already Exist.");
      return;
    }

    //Add To Chat Collection...
    try {
      await addDoc(collection(db, "Chats"), {
        users: [currentUser.email, input],
      });
    } catch (error) {}
  };

  return (
    <Container>
      <Header>
        {currentUser.photoURL ? (
          <UserAvatar
            src={currentUser.photoURL}
            onClick={() => signOutFromGoogle(auth)}
          />
        ) : (
          <UserAvatar onClick={() => signOutFromGoogle(auth)}>
            {currentUser.displayName}
          </UserAvatar>
        )}

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticle />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchBox>
        <SearchIcon />
        <SearchInput placeholder="Search In Chats" type="text" />
      </SearchBox>

      <SidebarButton onClick={createAChat}>Start A New Chat</SidebarButton>

      {/* Chats List... */}
      {chats.map((chat) => (
        <ChatRow
          recipientEmail={getRecipientEmail(currentUser.email, chat.users)}
          id={chat.id}
          key={chat.id}
        />
      ))}
    </Container>
  );
};

export default SideBar;

//Styled Components...
const Container = styled.div`
  flex: 0.45;
  overflow-y: scroll;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  border-right: 1px solid whitesmoke;

  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; //Firefox
  -ms-overflow-style: none; //IE and Edge
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  outline: none;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    /* Override MUI styling !important */
  }
`;
