"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useState } from "react";
import Tooltip from "^/components/Tooltip";
import { Button, ButtonProps } from "^/components/ui/button";

export interface ColorModeToggleProps extends Partial<ButtonProps> {}

const ColorModeToggle = forwardRef<HTMLButtonElement, ColorModeToggleProps>(
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
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label={label}
                    {...props}
                    ref={ref}
                >
                    {theme === "dark" ? <SunMedium /> : <Moon />}
                </Button>
            </Tooltip>
        );
    },
);
ColorModeToggle.displayName = "ColorModeToggle";

export default ColorModeToggle;
