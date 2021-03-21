import React, { useReducer } from "react";
import {
  SET_USERS,
  SET_SELECTED_USER,
  ADD_MESSAGE,
  SET_USER_MESSAGES,
} from "../types";
import {
  MessageStateContext,
  MessageDispatchContext,
} from "./messageContext";
import { messageReducer } from "./messageReducer";

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, {
    users: null,
  });

  const setUserDispatch = async (users) => {
    dispatch({ type: SET_USERS, payload: users.getUsers });
  };

  const setSelectedUserDispatch = async (user) => {
    dispatch({
      type: SET_SELECTED_USER,
      payload: user.username,
    });
  };

  const sendMessageDisatch = async (otherUser, message) => {
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        username: otherUser,
        message: message,
      },
    });
  };

  const setUserMessageDispatcher = async (
    selectedUser,
    messagesData
  ) => {
    dispatch({
      type: SET_USER_MESSAGES,
      payload: {
        username: selectedUser.username,
        messages: messagesData.getMessages,
      },
    });
  };
  return (
    <MessageDispatchContext.Provider
      value={{
        setUserDispatch,
        setSelectedUserDispatch,
        setUserMessageDispatcher,
        sendMessageDisatch,
      }}
    >
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};
