import {
    defineStyle,
    extendTheme,
    ThemeConfig,
    ThemeOverride,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// https://github.com/otakustay/react-diff-view/blob/v2.4.8/site/components/DiffView/diff.global.less#L22-L36
// Cross referenced with
// https://github.com/otakustay/react-diff-view/blob/v2.4.8/README.md#css-variables
const reactDiffViewDarkModeVariables = {
    // "--diff-background-color": "initial",
    "--diff-text-color": "#fafafa",
    // "--diff-font-family": "Consolas, Courier, monospace",
    "--diff-selection-background-color": "#5a5f80",
    "--diff-gutter-insert-background-color": "#082525",
    "--diff-gutter-delete-background-color": "#2b1523",
    "--diff-gutter-selected-background-color": "#5a5f80",
    "--diff-code-insert-background-color": "#082525",
    "--diff-code-delete-background-color": "#2b1523",
    "--diff-code-insert-edit-background-color": "#00462f",
    "--diff-code-delete-edit-background-color": "#4e2436",
    "--diff-code-selected-background-color": "#5a5f80",
    // "--diff-omit-gutter-line-color": "#cb2a1d",
} as const;

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: true,
};

/**
 * Add variant that reflects how a disabled solid button looks.
 * The main purpose of this is to make a button look disabled
 * while still being clickable and focusable.
 *
 * @see https://github.dev/chakra-ui/chakra-ui/blob/%40chakra-ui/theme%402.1.15/packages/components/theme/src/components/button.ts#L14-L24
 */
const variantSolidDisabled = defineStyle((props) => {
    const { colorScheme: c } = props;

    if (c === "gray") {
        const bg = mode(`gray.100`, `whiteAlpha.200`)(props);

        return {
            bg,

            opacity: 0.4,
            cursor: "not-allowed",
            boxShadow: "none",
        };
    }

    const bg = `${c}.500`;
    const color = "white";

    const background = mode(bg, `${c}.200`)(props);

    return {
        bg: background,
        color: mode(color, `gray.800`)(props),

        opacity: 0.4,
        cursor: "not-allowed",
        boxShadow: "none",
    };
});

const themeOverride: ThemeOverride = {
    config,
    styles: {
        global: {
            html: {
                minWidth: "sm",
            },
            body: {
                minHeight: "100vh",
            },
            ".diff-gutter": {
                scrollMarginTop: "100px",
            },
            _dark: {
                ":root": { ...reactDiffViewDarkModeVariables },
            },
        },
    },
    components: {
        Button: {
            variants: {
                "solid-disabled": variantSolidDisabled,
            },
        },
        Tooltip: {
            baseStyle: {
                padding: "4px",
                textAlign: "center",
            },
        },
    },
};

const theme = extendTheme(themeOverride);

export type Theme = typeof theme;

export default theme;
