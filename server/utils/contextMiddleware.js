import { PubSub } from "apollo-server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.json";

const pubsub = new PubSub();

export default function contextMiddleware(context) {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split(
      "Bearer "
    )[1];
  } else if (
    context.connection &&
    context.connection.context.Authorization
  ) {
    token = context.connection.context.Authorization.split(
      "Bearer "
    )[1];
  }
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  context.pubsub = pubsub;

  return context;
}
