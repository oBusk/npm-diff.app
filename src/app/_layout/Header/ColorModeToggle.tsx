"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useState } from "react";
import Button, { ButtonProps } from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";
import cn from "^/lib/cn";

export interface ColorModeToggleProps extends ButtonProps {}

const ColorModeToggle = forwardRef<HTMLButtonElement, ColorModeToggleProps>(
    ({ ...props }, ref) => {
        const [mounted, setMounted] = useState(false);
        const { setTheme, theme } = useTheme();

        useEffect(() => setMounted(true), []);

        const label = mounted
            ? `Switch to ${theme === "dark" ? "Light Mode" : "Dark Mode"}`
            : "Loading...";

        return (
            <Tooltip label={label}>
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label={label}
                    className={cn(
                        "transition-opacity duration-500",
                        !mounted && "opacity-0",
                    )}
                    {...props}
                    ref={ref}
                >
                    {mounted && theme === "dark" ? <SunMedium /> : <Moon />}
                </Button>
            </Tooltip>
        );
    },
);
ColorModeToggle.displayName = "ColorModeToggle";

export default ColorModeToggle;
