import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import "../styles.css";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ThemeProvider>
            <CSSReset />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
