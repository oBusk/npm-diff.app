import {
    Code,
    forwardRef,
    Text,
    Tooltip,
    TooltipProps,
} from "@chakra-ui/react";
import B from "^/components/theme/B";

export interface ServiceTooltipProps extends TooltipProps {
    packageName: string;
    packageVersion: string;
    serviceName: string;
}

const ServiceTooltip = forwardRef<ServiceTooltipProps, any>(
    ({ packageName, packageVersion, serviceName, ...props }, ref) => (
        <Tooltip
            ref={ref}
            textAlign="center"
            {...props}
            label={
                <>
                    <Text whiteSpace="nowrap">
                        View{" "}
                        <Code>
                            {packageName}@{packageVersion}
                        </Code>
                    </Text>
                    <Text>
                        on <B>{serviceName}</B>
                    </Text>
                </>
            }
        />
    ),
);

export default ServiceTooltip;
