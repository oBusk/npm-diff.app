"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript, Stack } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { PropsWithChildren } from "react";
import theme from "^/theme";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";

const PADDING = "1em" as const;

const LayoutClient = ({ children }: PropsWithChildren<{}>) => (
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <Stack
                    minHeight="100svh"
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
        </CacheProvider>
        {process.env.VERCEL_URL ? <Analytics /> : null}
    </>
);
export default LayoutClient;
