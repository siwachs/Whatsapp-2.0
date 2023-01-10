import styled from "styled-components";

import { auth } from "../../firebase";

import moment from "moment/moment";

import { Avatar } from "@material-ui/core";

const Message = ({ user, message, photoURL, timestamp }) => {
  const { currentUser } = auth;

  const TypeOfMessage = user === currentUser.email ? Sender : Reciever;

  const TypeOfProfile =
    user === currentUser.email ? SenderUserProfile : RecieverUserProfile;

  return (
    <Container>
      <TypeOfProfile src={photoURL} />
      <TypeOfMessage>
        {message}
        <TimeStamp>{moment(timestamp?.seconds * 1000).format("lll")}</TimeStamp>
      </TypeOfMessage>
    </Container>
  );
};

export default Message;

const Container = styled.div`
  position: relative;
`;

const SenderUserProfile = styled(Avatar)`
  position: absolute;
  margin-left: auto;
  bottom: -26px;
  z-index: 1;
`;

const RecieverUserProfile = styled(Avatar)`
  position: absolute;
  bottom: -26px;
  z-index: 1;
`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  padding-top: 20px;
  padding-bottom: 30px;
  margin: 10px;
  border-radius: 8px;
  min-width: 130px;
  position: relative;
  text-align: right;
  word-break: break-all;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`;

const TimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 12px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
