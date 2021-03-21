//default files
import React, {
  useEffect,
  useContext,
  useState,
  Fragment,
} from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Col, Form } from "react-bootstrap";

// custom files
import { GET_MESSAGES } from "../../Apollo/queries/messages";
import Spinner from "../Spinner";
import Message from "./Message";

//context
import {
  MessageStateContext,
  MessageDispatchContext,
} from "../../context/message/messageContext";
import { SEND_MESSAGE } from "../../Apollo/mutations/message";

const Messages = () => {
  const messageStateContext = useContext(
    MessageStateContext
  );
  const messageDispatchContext = useContext(
    MessageDispatchContext
  );

  const {
    setUserMessageDispatcher,
    sendMessageDisatch,
  } = messageDispatchContext;
  const { users } = messageStateContext;
  const [content, setContent] = useState("");

  const selectedUser = users?.find(
    (u) => u.selected === true
  );
  const messages = selectedUser?.messages;

  // query
  const [
    getMessages,
    { loading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  // mutation
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  //submitHandler
  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;

    //clear input
    setContent("");

    // mutation to send message
    sendMessage({
      variables: {
        to: selectedUser.username,
        content: content.trim(),
      },
    });
  };

  //useEffects
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({
        variables: { from: selectedUser.username },
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      setUserMessageDispatcher(selectedUser, messagesData);
    }
  }, [messagesData]);

  let selectedChatMarkup;
  if (!messages && !loading) {
    selectedChatMarkup = (
      <p>Choose a friend to start chatting with</p>
    );
  } else if (loading) {
    selectedChatMarkup = <Spinner />;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className="info-text">
        You are no connected. You can now start chatting{" "}
      </p>
    );
  }

  return (
    <Col className="message-container" xs={9} md={8}>
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={sendMessageHandler}>
          <Form.Group>
            <Form.Control
              type="text"
              className="message-input rounded-pill bg-secondary border-0"
              placeholder="start typing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
