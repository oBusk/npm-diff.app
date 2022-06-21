import {
    forwardRef,
    Tag,
    TagLabel,
    TagLeftIcon,
    TagProps,
} from "@chakra-ui/react";
import { ElementType, ReactNode } from "react";
import { Tooltip } from "^/components/theme";

interface FlagProps extends TagProps {
    icon: ElementType;
    label: string;
    tooltip: ReactNode;
    colorScheme: undefined | "green" | "red";
}

const Flag = forwardRef<FlagProps, "div">(
    ({ label, icon, tooltip, colorScheme, ...props }, ref) => (
        <Tooltip label={tooltip} closeOnClick={false} shouldWrapChildren={true}>
            <Tag
                colorScheme={colorScheme}
                cursor="help"
                margin="10px 0"
                {...props}
                ref={ref}
            >
                <TagLeftIcon boxSize="16px" as={icon} fill="currentColor" />
                <TagLabel>{label}</TagLabel>
            </Tag>
        </Tooltip>
    ),
);

export default Flag;
