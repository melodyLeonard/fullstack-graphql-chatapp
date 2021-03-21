import { ApolloServer } from "apollo-server";
import {
  mergeTypeDefs,
  mergeResolvers,
} from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { join } from "path";
import { sequelize } from "./models";
import contextMiddleware from "./utils/contextMiddleware";

const typeDefs = mergeTypeDefs(
  loadFilesSync(join(__dirname, "./graphql/schema"))
);

const resolvers = mergeResolvers(
  loadFilesSync(join(__dirname, "./graphql/resolvers"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("database connected"))
    .catch((err) => console.error(err));
});
