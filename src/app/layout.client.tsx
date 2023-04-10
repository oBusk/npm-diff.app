"use client";

import { Box, ChakraProvider, ColorModeScript, Stack } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { PropsWithChildren } from "react";
import Div100vh from "react-div-100vh";
import theme from "^/theme";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";

const PADDING = "1em" as const;

const LayoutClient = ({ children }: PropsWithChildren<{}>) => (
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <Stack
                as={Div100vh}
                justifyContent="space-between"
                overflow="auto"
                paddingRight={PADDING}
                paddingLeft={PADDING}
            >
                <Header background="chakra-body-bg" />
                {children}
                <Footer background="chakra-body-bg" />
            </Stack>
        </ChakraProvider>
        <Analytics />
    </>
);
export default LayoutClient;
