import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ChakraProvider>
            <CSSReset />
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
