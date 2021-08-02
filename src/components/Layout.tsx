import { Stack, StackProps } from "@chakra-ui/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import { Header } from "./Header";
import Footer from "./Footer";

export interface LayoutProps extends StackProps {
    title?: string;
}

const BACKGROUND_COLOR = "white";
const PADDING = "1em";

const Layout: FunctionComponent<LayoutProps> = ({
    children,
    title = "",
    ...props
}) => {
    return (
        <>
            <Head>
                <title>{title ? `${title} • ` : ""}npm-diff.app 📦🔃</title>
            </Head>
            <Stack
                background={BACKGROUND_COLOR}
                minHeight="100vh"
                justifyContent="space-between"
                padding={PADDING}
                {...props}
            >
                <Header
                    margin={`-${PADDING} -${PADDING} 0`}
                    background={BACKGROUND_COLOR}
                />
                {children}
                <Footer margin={`-${PADDING}`} background={BACKGROUND_COLOR} />
            </Stack>
        </>
    );
};

export default Layout;
