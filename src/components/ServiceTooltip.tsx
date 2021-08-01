import { forwardRef, Tooltip, TooltipProps, Code } from "@chakra-ui/react";

export interface ServiceTooltipProps extends TooltipProps {
    packageName: string;
    packageVersion: string;
    serviceName: string;
}

const ServiceTooltip = forwardRef<ServiceTooltipProps, any>(
    ({ packageName, packageVersion, serviceName, ...props }, ref) => (
        <Tooltip
            ref={ref}
            {...props}
            label={
                <>
                    View{" "}
                    <Code>
                        {packageName}@{packageVersion}
                    </Code>{" "}
                    on <b>{serviceName}</b>
                </>
            }
        />
    ),
);

export default ServiceTooltip;
