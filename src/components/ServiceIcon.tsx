import Image, { ImageProps } from "next/image";
import { FunctionComponent } from "react";
import { Service } from "^/lib/Services";

export interface ServiceIconProps
    extends Omit<ImageProps, "src" | "alt" | "width" | "height"> {
    service: Service;
}

const ServiceIcon: FunctionComponent<ServiceIconProps> = ({
    service,
    ...props
}) => (
    <Image
        alt={service.name}
        src={service.icon}
        layout="fixed"
        width={16}
        height={16}
        {...props}
    />
);

export default ServiceIcon;
