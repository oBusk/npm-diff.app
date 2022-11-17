"use client";

import { ChakraProvider, ColorModeScript, Stack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Div100vh from "react-div-100vh";
import theme from "^/theme";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";

const PADDING = "1em";

const LayoutClient = ({ children }: PropsWithChildren<{}>) => (
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <Stack
                as={Div100vh}
                justifyContent="space-between"
                padding={PADDING}
            >
                <Header background="chakra-body-bg" />
                {children}
                <Footer margin={`-${PADDING}`} background="chakra-body-bg" />
            </Stack>
        </ChakraProvider>
    </>
);
export default LayoutClient;
