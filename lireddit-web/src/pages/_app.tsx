import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { AppProps } from 'next/app';

const app = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};
export default app;
