import styled from "styled-components";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Avatar } from "@material-ui/core";

import { getRecipientEmailProfile } from "../../lib/chatRowUtils";

const ChatRow = ({ recipientEmail, id }) => {
  const router = useRouter();

  const [recipientEmailSnapshot, setRecipientEmailSnapshot] = useState();

  useEffect(() => {
    const getRecipientEmailSnapshot = async () => {
      setRecipientEmailSnapshot(await getRecipientEmailProfile(recipientEmail));
    };

    getRecipientEmailSnapshot();
  }, []);

  const enterChat = () => {
    router.push({
      pathname: `/chat/${id}`,
    });
  };

  return (
    <Container onClick={enterChat}>
      {recipientEmailSnapshot ? (
        <UserAvatar src={recipientEmailSnapshot.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
};

export default ChatRow;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
