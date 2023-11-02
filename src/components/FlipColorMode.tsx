import { ColorModeContext } from "@chakra-ui/react";
import React, { type PropsWithChildren, useContext, useMemo } from "react";

/**
 * Provider to flip the color mode to the opposite of the current color mode.
 *
 * Based on
 * https://github.dev/chakra-ui/chakra-ui/blob/7a1716aab5405c71180e9a0a3f1123782c18c3df/packages/components/color-mode/src/color-mode-provider.tsx#L127-L161
 */
export function FlipColorMode(props: PropsWithChildren<{}>) {
    const currentColorMode = useContext(ColorModeContext);

    const context = useMemo<typeof currentColorMode>(
        () => ({
            colorMode:
                currentColorMode.colorMode === "light" ? "dark" : "light",
            toggleColorMode: currentColorMode.toggleColorMode,
            setColorMode: currentColorMode.setColorMode,
            forced: true,
        }),
        [currentColorMode],
    );

    return <ColorModeContext.Provider value={context} {...props} />;
}
