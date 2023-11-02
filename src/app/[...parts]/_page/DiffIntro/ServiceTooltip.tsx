import { forwardRef, Text } from "@chakra-ui/react";
import B from "^/components/B";
import Pkg from "^/components/Pkg";
import Tooltip, { type TooltipProps } from "^/components/Tooltip";
import { type Service } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface ServiceTooltipProps extends TooltipProps {
    pkg: SimplePackageSpec;
    serviceName: Service["name"];
}

const ServiceTooltip = forwardRef<ServiceTooltipProps, any>(
    ({ pkg, serviceName, ...props }, ref) => {
        return (
            <Tooltip
                textAlign="center"
                {...props}
                ref={ref}
                label={
                    <>
                        <Text whiteSpace="nowrap">
                            View <Pkg pkg={pkg} />
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
