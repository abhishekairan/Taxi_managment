import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { type AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={{ primaryColor: 'dark' }}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}