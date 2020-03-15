import Head from "next/head";
import * as React from "react";
import GithubLogo from "./icons/github";

type Props = {
    title?: string;
};

const Layout: React.FunctionComponent<Props> = ({ children, title = "" }) => (
    <div>
        <Head>
            <title>{title ? title + " - " : ""}package-diff 📦🔃</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
        </Head>
        <header>
            <h1>
                <a href="https://github.com/oBusk/package-diff">
                    <GithubLogo></GithubLogo>
                </a>
                &nbsp;&nbsp;package-diff 📦🔃
            </h1>
        </header>
        {children}
        <footer></footer>
    </div>
);

export default Layout;
