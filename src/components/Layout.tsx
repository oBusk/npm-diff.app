import { Flex } from "@chakra-ui/core";
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
                <title>{title ? title + " - " : ""}package-diff 📦🔃</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                bg="gray.50"
                minHeight="100vh"
                {...props}
            >
                <Header bg="gray.50" />
                {children}
            </Flex>
        </>
    );
};

export default Layout;
