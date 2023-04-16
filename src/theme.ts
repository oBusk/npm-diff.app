import {
    defineStyle,
    extendBaseTheme,
    ThemeConfig,
    ThemeOverride,
} from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { mode } from "@chakra-ui/theme-tools";

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

const {
    Button,
    Code,
    FormLabel,
    Heading,
    Input,
    Link,
    List,
    Skeleton,
    Spinner,
    Tag,
    Tooltip,
} = chakraTheme.components;

const themeOverride: ThemeOverride = {
    config,
    styles: {
        global: {
            html: {
                minWidth: "sm",
            },
        },
    },
    components: {
        Button: {
            ...Button,
            variants: {
                ...Button.variants,
                "solid-disabled": variantSolidDisabled,
            },
        },
        Code,
        FormLabel,
        Heading,
        Input,
        Link,
        List,
        Skeleton,
        Spinner,
        Tag,
        Tooltip: {
            ...Tooltip,
            baseStyle: {
                ...Tooltip.baseStyle,
                padding: "4px",
                textAlign: "center",
            },
        },
    },
};

const theme = extendBaseTheme(themeOverride);

export type Theme = typeof theme;

export default theme;
