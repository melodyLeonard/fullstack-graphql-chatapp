import React, {
  Fragment,
  useEffect,
  useContext,
} from "react";
import { Row } from "react-bootstrap";
import Users from "../Components/home/Users";
import Messages from "../Components/home/Messages";
import AppNavbar from "../Components/Navbar";
import { useSubscription } from "@apollo/client";
import { AuthStateContext } from "../context/authentication/authContext";
import { NEW_MESSAGE } from "../Apollo/subscriptions/message";
import { MessageDispatchContext } from "../context/message/messageContext";

const Home = () => {
  const authStateContext = useContext(AuthStateContext);

  const { user } = authStateContext;

  const messageDispatchContext = useContext(
    MessageDispatchContext
  );

  const { sendMessageDisatch } = messageDispatchContext;

  const {
    data: messageData,
    error: messageError,
  } = useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to
          ? message.from
          : message.to;
      sendMessageDisatch(otherUser, message);
    }
  }, [messageData, messageError]);

  return (
    <Fragment>
      <AppNavbar />
      <Row>
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
};

export default Home;
