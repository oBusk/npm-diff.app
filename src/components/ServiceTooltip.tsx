import {
    forwardRef,
    Tooltip,
    TooltipProps,
    Code,
    Text,
} from "@chakra-ui/react";

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
                        on <b>{serviceName}</b>
                    </Text>
                </>
            }
        />
    ),
);

export default ServiceTooltip;
