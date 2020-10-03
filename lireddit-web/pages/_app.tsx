import { ThemeProvider } from '@chakra-ui/core';
import { AppProps } from 'next/app';
const app = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};
export default app;
