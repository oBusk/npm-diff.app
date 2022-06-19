import { Stack, StackProps, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import Footer from "./Footer";
import Header from "./Header";

export interface LayoutProps extends StackProps {
    title?: string;
    description?: string;
}

const BACKGROUND_COLOR = undefined;
const PADDING = "1em";

const Layout: FunctionComponent<LayoutProps> = ({
    children,
    title = "",
    description,
    ...props
}) => {
    // https://github.com/chakra-ui/chakra-ui/blob/%40chakra-ui/react%401.6.5/packages/theme/src/styles.ts#L8
    const background = useColorModeValue("white", "gray.800");

    return (
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
                <Header
                    margin={`-${PADDING} -${PADDING} 0`}
                    background={background}
                />
                {children}
                <Footer margin={`-${PADDING}`} background={background} />
            </Stack>
        </>
    );
};

export default Layout;
