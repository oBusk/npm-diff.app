import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import { Header } from "./Header";

type Props = {
    title?: string;
};

const BACKGROUND_COLOR = "white";

const Layout: FunctionComponent<Props> = ({
    children,
    title = "",
    ...props
}) => {
    return (
        <>
            <Head>
                <title>{title ? title + " - " : ""}npm-diff.app 📦🔃</title>
            </Head>
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                bg={BACKGROUND_COLOR}
                minHeight="100vh"
                {...props}
            >
                <Header bg={BACKGROUND_COLOR} />
                {children}
            </Flex>
        </>
    );
};

export default Layout;
