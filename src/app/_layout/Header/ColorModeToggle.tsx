"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { forwardRef } from "react";
import Button, { type ButtonProps } from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";
import { cx } from "^/lib/cva";
import useMounted from "^/lib/utils/useMounted";

export interface ColorModeToggleProps extends ButtonProps {}

const ColorModeToggle = forwardRef<HTMLButtonElement, ColorModeToggleProps>(
    ({ className, ...props }, ref) => {
        const mounted = useMounted();
        const { setTheme, resolvedTheme } = useTheme();

        const label = mounted
            ? `Switch to ${
                  resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"
              }`
            : "Loading...";

        return (
            <Tooltip label={label}>
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    aria-label={label}
                    className={cx(
                        "transition-opacity duration-500",
                        !mounted && "opacity-0",
                        className,
                    )}
                    {...props}
                    ref={ref}
                >
                    {mounted && resolvedTheme === "dark" ? (
                        <SunMedium />
                    ) : (
                        <Moon />
                    )}
                </Button>
            </Tooltip>
        );
    },
);
ColorModeToggle.displayName = "ColorModeToggle";

export default ColorModeToggle;
