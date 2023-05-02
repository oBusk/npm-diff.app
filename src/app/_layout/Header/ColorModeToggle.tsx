"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useState } from "react";
import Button, { ButtonProps } from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";
import cn from "^/lib/cn";

export interface ColorModeToggleProps extends ButtonProps {}

const iconSize = cn("h-6 w-6");

const ColorModeToggle = forwardRef<HTMLButtonElement, ColorModeToggleProps>(
    ({ ...props }, ref) => {
        const [mounted, setMounted] = useState(false);
        const { setTheme, theme } = useTheme();

        useEffect(() => setMounted(true), []);

        if (!mounted) {
            return (
                <Button variant="ghost" {...props}>
                    <div className={iconSize} />
                </Button>
            );
        }

        const label = `Switch to ${
            theme === "dark" ? "Light Mode" : "Dark Mode"
        }`;

        const Icon = theme === "dark" ? SunMedium : Moon;

        return (
            <Tooltip label={label}>
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label={label}
                    {...props}
                    ref={ref}
                >
                    <Icon className={iconSize} />
                </Button>
            </Tooltip>
        );
    },
);
ColorModeToggle.displayName = "ColorModeToggle";

export default ColorModeToggle;
