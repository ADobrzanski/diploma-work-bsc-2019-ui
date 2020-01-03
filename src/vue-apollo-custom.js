/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from 'apollo-link';

Vue.use(VueApollo);

const AUTH_TOKEN = 'apollo-token';
// const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql';
// const wsEndpoint = process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql';

const uploadLink = createUploadLink({ uri: 'http://localhost:4000/graphql' });
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const clientOptions = {
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
  tokenName: AUTH_TOKEN,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
  connectToDevTools: !process.env.NODE_ENV === 'production',
};

export const createProvider = () => {
  const apolloClient = new ApolloClient(clientOptions);

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
    },
  });

  return apolloProvider;
};
