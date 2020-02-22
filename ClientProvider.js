import React from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";
import { API_HTTP_URL, API_WS_URL } from "react-native-dotenv";

// react-native-dotenv is buggy. It's not populating env vars w/o the console.log statements comments below.
// TODO: find a better solution
console.log("API_HTTP_URL", API_HTTP_URL);
console.log("API_WS_URL", API_WS_URL);

// Create an http link:
const httpLink = new HttpLink({
  uri: API_HTTP_URL,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: API_WS_URL,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const ClientProvider = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ClientProvider;
