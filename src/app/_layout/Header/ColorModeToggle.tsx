import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { forwardRef, IconButton, IconButtonProps } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Tooltip from "^/components/Tooltip";

export interface ColorModeToggleProps extends Partial<IconButtonProps> {}

const ColorModeToggle = forwardRef<ColorModeToggleProps, "button">(
    ({ ...props }, ref) => {
        const [mounted, setMounted] = useState(false);
        const { setTheme, theme } = useTheme();

        useEffect(() => setMounted(true), []);

        if (!mounted) {
            return null;
        }

        const label = `Switch to ${
            theme === "dark" ? "Light Mode" : "Dark Mode"
        }`;

        return (
            <Tooltip label={label}>
                <IconButton
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label={label}
                    size="sm"
                    fontSize="1.2em"
                    icon={theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    {...props}
                    ref={ref}
                />
            </Tooltip>
        );
    },
);

export default ColorModeToggle;
