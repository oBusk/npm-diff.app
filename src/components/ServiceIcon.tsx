import { FunctionComponent } from "react";
import ChakraNextImage, { ChakraNextImageProps } from "./theme/NextImage";

export interface ServiceIconProps
    extends Omit<ChakraNextImageProps, "src" | "alt" | "width" | "height"> {
    serviceName: string;
}

const ServiceIcon: FunctionComponent<ServiceIconProps> = ({
    serviceName,
    ...props
}) => (
    <ChakraNextImage
        alt={serviceName}
        src={`/service-icons/${serviceName}.png`}
        width={16}
        height={16}
        {...props}
    />
);

export default ServiceIcon;
