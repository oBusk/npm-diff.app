import { forwardRef, Text } from "@chakra-ui/react";
import B from "^/components/B";
import Pkg from "^/components/Pkg";
import Tooltip, { TooltipProps } from "^/components/ui/Tooltip";
import { Service } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface ServiceTooltipProps extends Omit<TooltipProps, "label"> {
    pkg: SimplePackageSpec;
    serviceName: Service["name"];
}

const ServiceTooltip = forwardRef<ServiceTooltipProps, any>(
    ({ pkg, serviceName, ...props }, ref) => {
        return (
            <Tooltip
                className="text-center"
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
