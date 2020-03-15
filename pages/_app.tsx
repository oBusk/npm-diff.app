import { AppProps } from "next/app";
import "react-diff-view/style/index.css";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />;
}

export default MyApp;
