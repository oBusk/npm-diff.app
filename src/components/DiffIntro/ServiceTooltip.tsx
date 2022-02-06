import {
    Code,
    forwardRef,
    Text,
    Tooltip,
    TooltipProps,
    useColorModeValue,
} from "@chakra-ui/react";
import B from "^/components/theme/B";
import TooltipCode from "../theme/TooltipCode";

export interface ServiceTooltipProps extends TooltipProps {
    packageName: string;
    packageVersion: string;
    serviceName: string;
}

const ServiceTooltip = forwardRef<ServiceTooltipProps, any>(
    ({ packageName, packageVersion, serviceName, ...props }, ref) => {
        return (
            <Tooltip
                textAlign="center"
                {...props}
                ref={ref}
                label={
                    <>
                        <Text whiteSpace="nowrap">
                            View{" "}
                            <TooltipCode>
                                {packageName}@{packageVersion}
                            </TooltipCode>
                        </Text>
                        <Text>
                            on <B>{serviceName}</B>
                        </Text>
                    </>
                }
            />
        );
    },
);

export default ServiceTooltip;
