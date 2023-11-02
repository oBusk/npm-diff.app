import Image, { type ImageProps } from "next/image";
import { type ElementRef, forwardRef } from "react";
import { type Service } from "^/lib/Services";

export interface ServiceIconProps
    extends Omit<ImageProps, "src" | "alt" | "width" | "height"> {
    service: Service;
}

const ServiceIcon = forwardRef<ElementRef<typeof Image>, ServiceIconProps>(
    ({ service, ...props }, ref) => (
        <Image
            alt={service.name}
            src={service.icon}
            width={16}
            height={16}
            {...props}
            ref={ref}
        />
    ),
);
ServiceIcon.displayName = "ServiceIcon";

export default ServiceIcon;
