"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import theme from "^/theme";

/** Configures the app with the necessary Context and scripts */
export default function Config({ children }: PropsWithChildren<{}>) {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </>
    );
}
