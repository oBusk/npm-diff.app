import { Code, forwardRef, Text } from "@chakra-ui/react";
import { B, Tooltip, TooltipProps } from "^/components/theme";
import { Service } from "^/lib/Services";

export interface ServiceTooltipProps extends TooltipProps {
    packageName: string;
    packageVersion: string;
    serviceName: Service["name"];
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
        );
    },
);

export default ServiceTooltip;
