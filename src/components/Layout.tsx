import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { Header } from "./Header";

type Props = {
    title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
    children,
    title = "",
    ...props
}) => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
                <title>{title ? title + " - " : ""}package-diff 📦🔃</title>
            </Head>
            <div
                className={cn([
                    "flex",
                    "flex-col",
                    "items-center",
                    "justify-start",
                    "bg-gray-100",
                    "min-h-screen",
                ])}
                {...props}
            >
                <Header className="bg-gray-100" />
                {children}
            </div>
        </>
    );
};

export default Layout;
