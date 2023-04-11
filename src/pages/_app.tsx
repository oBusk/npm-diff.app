import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import theme from "^/theme";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
            {process.env.VERCEL_URL ? <Analytics /> : null}
        </ChakraProvider>
    );
}

export default MyApp;
