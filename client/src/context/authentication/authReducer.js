import { LOGIN, LOGOUT } from "../types";

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
