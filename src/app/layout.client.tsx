"use client";

import { ChakraProvider, Stack } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { PropsWithChildren } from "react";
import Div100vh from "react-div-100vh";
import theme from "^/theme";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";

const PADDING = "1em" as const;

const LayoutClient = ({ children }: PropsWithChildren<{}>) => (
    <>
        <ChakraProvider theme={theme}>
            <Stack
                as={Div100vh}
                justifyContent="space-between"
                overflow="auto"
                paddingRight={PADDING}
                paddingLeft={PADDING}
            >
                <Header />
                {children}
                <Footer />
            </Stack>
        </ChakraProvider>
        {process.env.VERCEL_URL ? <Analytics /> : null}
    </>
);
export default LayoutClient;
