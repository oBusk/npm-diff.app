import { ElementRef, forwardRef } from "react";
import Pkg from "^/components/ui/Pkg";
import Tooltip, { TooltipProps } from "^/components/ui/Tooltip";
import { Service } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface ServiceTooltipProps extends Omit<TooltipProps, "label"> {
    pkg: SimplePackageSpec;
    serviceName: Service["name"];
}

const ServiceTooltip = forwardRef<
    ElementRef<typeof Tooltip>,
    ServiceTooltipProps
>(({ pkg, serviceName, ...props }, ref) => {
    return (
        <Tooltip
            className="text-center"
            {...props}
            ref={ref}
            label={
                <>
                    <span className="whitespace-nowrap">
                        View <Pkg pkg={pkg} />
                    </span>{" "}
                    <span>
                        on <b>{serviceName}</b>
                    </span>
                </>
            }
        />
    );
});
ServiceTooltip.displayName = "ServiceTooltip";

export default ServiceTooltip;
