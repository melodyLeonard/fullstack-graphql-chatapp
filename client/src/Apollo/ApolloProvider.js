import { ApolloProvider as Provider } from "@apollo/client";
import { client } from "./client";

export default function ApolloProviderWrapper(props) {
  return <Provider client={client} {...props} />;
}
