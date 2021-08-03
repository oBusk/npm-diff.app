import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    forwardRef,
    IconButton,
    IconButtonProps,
    useColorMode,
} from "@chakra-ui/react";
import Tooltip from "components/theme/Tooltip";

export interface DarkmodeToggleProps extends Partial<IconButtonProps> {}

const DarkmodeToggle = forwardRef<DarkmodeToggleProps, "button">(
    ({ ...props }, ref) => {
        const { colorMode, toggleColorMode } = useColorMode();

        const label = `Switch to ${
            colorMode === "dark" ? "Light Mode" : "Dark Mode"
        }`;

        return (
            <Tooltip label={label}>
                <IconButton
                    onClick={toggleColorMode}
                    aria-label={label}
                    icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                    ref={ref}
                    {...props}
                />
            </Tooltip>
        );
    },
);

export default DarkmodeToggle;
