import Head from "next/head";
import * as React from "react";

type Props = {
    title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
    children,
    title = "This is the default title",
}) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
        </Head>
        <header>
            <h1>Diff! 📦🔃</h1>
        </header>
        {children}
        <footer>
            <hr />
            <span>I'm here to stay (Footer)</span>
        </footer>
    </div>
);

export default Layout;
