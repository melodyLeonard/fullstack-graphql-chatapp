import React, { useReducer } from "react";
import { LOGIN, LOGOUT } from "../types";
import { AuthStateContext, AuthDispatchContext } from "./authContext";
import { authReducer } from "./authReducer";
import jwtDecode from "jwt-decode";

let user = null;
const token = localStorage.getItem("token");
if (token) {
  try {
    const decodedToken = jwtDecode(token);
    const expiresAt = new Date(decodedToken.exp * 1000);

    if (new Date() > expiresAt) {
      localStorage.removeItem("token");
    } else {
      user = decodedToken;
    }
  } catch (err) {
    console.log(err)
  }
} else console.log("No TOKEN!!!! found");

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });

  //login Dispatcher
  const loginDispatch = async (data) => {
    dispatch({ type: LOGIN, payload: data.data.login });
  };

  const logoutDispatch = async () => {
    dispatch({ type: LOGOUT });
    console.log("here!!!!!!!");
  };

  return (
    <AuthDispatchContext.Provider value={{ loginDispatch, logoutDispatch }}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};
