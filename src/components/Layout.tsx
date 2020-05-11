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
            <Header bg="gray.50" />
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                bg="gray.50"
                {...props}
            >
                {children}
            </Flex>
        </>
    );
};

export default Layout;
