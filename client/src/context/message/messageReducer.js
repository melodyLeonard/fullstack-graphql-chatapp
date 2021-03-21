import {
  SET_USERS,
  SET_USER_MESSAGES,
  SET_SELECTED_USER,
  ADD_MESSAGE,
} from "../types";

export const messageReducer = (state, action) => {
  // declear avariable userCopy and userIndex
  let usersCopy, userIndex;

  // top level destructuring
  const { username, message, messages } = action.payload;

  switch (action.type) {
    //case user
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };

    //set user message after query
    case SET_USER_MESSAGES:
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex(
        (u) => u.username === username
      );
      usersCopy[userIndex] = {
        ...usersCopy[userIndex],
        messages,
      };
      return {
        ...state,
        users: usersCopy,
      };

    //selected User
    case SET_SELECTED_USER:
      usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }));
      return {
        ...state,
        users: usersCopy,
      };

    //add message
    case ADD_MESSAGE:
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex(
        (u) => u.username === username
      );

      let newUser = {
        ...usersCopy[userIndex],
        messages: usersCopy[userIndex].messages
          ? [message, ...usersCopy[userIndex].messages]
          : null,
        latestMessage: message,
      };
      usersCopy[userIndex] = newUser;
      return {
        ...state,
        users: usersCopy,
      };

    //default state
    default:
      throw new Error(
        `Unknown action type: ${action.type}`
      );
  }
};
