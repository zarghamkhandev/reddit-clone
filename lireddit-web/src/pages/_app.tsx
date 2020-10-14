import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { AppProps } from 'next/app';
import { onError } from 'apollo-link-error';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import Router from 'next/router';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      if (message.includes('not authenticated')) {
        Router.push('/');
      }
    });
  }
}) as any;
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(httpLink),
});

const app = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};
export default app;
