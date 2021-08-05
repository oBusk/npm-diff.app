import { extendTheme, ThemeConfig } from "@chakra-ui/react";

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
    // useSystemColorMode: true,
};

const theme = extendTheme({
    config,
    styles: {
        global: ({ colorMode }) => ({
            ":root": colorMode === "dark" ? reactDiffViewDarkModeVariables : {},
            html: {
                // I find it less annoying to go from dark->ligth when loading, than flash of light
                background: colorMode === "light" ? "white" : "gray.800",
                // 360px
                minWidth: "22em",
            },
            body: {
                minHeight: "100vh",
            },
            ".diff-gutter": {
                scrollMarginTop: "100px",
            },
        }),
    },
});

export type Theme = typeof theme;

export default theme;
