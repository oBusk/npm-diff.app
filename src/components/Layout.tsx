import { Box, Stack, StackProps } from "@chakra-ui/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import Div100vh from "react-div-100vh";
import Footer from "./Footer";
import Header from "./Header";

export interface LayoutProps extends StackProps {
    title?: string;
    description?: string;
}

const PADDING = "1em" as const;

const Layout: FunctionComponent<LayoutProps> = ({
    children,
    title = "",
    description,
    ...props
}) => (
    <>
        <Head>
            <title>
                {[title, "npm-diff.app 📦🔃"].filter(Boolean).join(" • ")}
            </title>
            <meta
                name="description"
                content={
                    description
                        ? description
                        : "Inspect changes between npm packages in a webapp"
                }
            />
        </Head>
        <Stack
            as={Div100vh}
            justifyContent="space-between"
            overflow="auto"
            paddingRight={PADDING}
            paddingLeft={PADDING}
            {...props}
        >
            <Header
                background="chakra-body-bg"
                marginLeft={`-${PADDING}`}
                marginRight={`-${PADDING}`}
            />
            {children}
            <Footer
                background="chakra-body-bg"
                marginLeft={`-${PADDING}`}
                marginRight={`-${PADDING}`}
            />
        </Stack>
    </>
);

export default Layout;
