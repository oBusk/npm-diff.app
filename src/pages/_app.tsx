import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";

const theme = extendTheme({
    styles: {
        global: {
            html: {
                // 360px
                minWidth: "22em",
            },
            ".diff-gutter": {
                scrollMarginTop: "100px",
            },
        },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
