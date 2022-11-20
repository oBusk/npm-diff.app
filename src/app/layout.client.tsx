"use client";

import { Box, ChakraProvider, ColorModeScript, Stack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Div100vh from "react-div-100vh";
import theme from "^/theme";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";

const LayoutClient = ({ children }: PropsWithChildren<{}>) => (
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <Stack as={Div100vh} justifyContent="space-between" overflow="auto">
                <Header background="chakra-body-bg" />
                <Box padding="1em">{children}</Box>
                <Footer background="chakra-body-bg" />
            </Stack>
        </ChakraProvider>
    </>
);
export default LayoutClient;
