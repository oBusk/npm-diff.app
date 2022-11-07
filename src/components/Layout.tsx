import { Stack, StackProps } from "@chakra-ui/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import Footer from "./Footer";
import Header from "./Header";

export interface LayoutProps extends StackProps {
    title?: string;
    description?: string;
}

const PADDING = "1em";

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
            minHeight="100vh"
            justifyContent="space-between"
            padding={PADDING}
            {...props}
        >
            <Header background="chakra-body-bg" />
            {children}
            <Footer margin={`-${PADDING}`} background="chakra-body-bg" />
        </Stack>
    </>
);

export default Layout;
