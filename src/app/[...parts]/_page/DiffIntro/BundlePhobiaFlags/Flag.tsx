import {
    forwardRef,
    Skeleton,
    Tag,
    TagLabel,
    TagLeftIcon,
    type TagProps,
} from "@chakra-ui/react";
import { type ElementType, type ReactNode } from "react";
import Tooltip from "^/components/Tooltip";
import TreeshakeIcon from "./assets/TreeshakeIcon";

interface FlagProps extends TagProps {
    icon: ElementType;
    label: string;
    tooltip?: ReactNode;
    colorScheme?: undefined | "green" | "red";
}

const Flag = forwardRef<FlagProps, "div">(
    ({ label, icon, tooltip, colorScheme, ...props }, ref) => {
        const tag = (
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
        );

        if (tooltip == null) {
            return tag;
        }

        return (
            <Tooltip
                label={tooltip}
                closeOnClick={false}
                shouldWrapChildren={true}
            >
                {tag}
            </Tooltip>
        );
    },
);

export default Flag;

export const FlagSkeleton = () => (
    <Skeleton margin="10px 0" width="130px" height="24px" />
);
