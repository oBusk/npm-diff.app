import { FunctionComponent } from "react";
import ChakraNextImage, {
    ChakraNextImageProps,
} from "^/components/theme/NextImage";
import { Service } from "^/lib/Services";

export interface ServiceIconProps
    extends Omit<ChakraNextImageProps, "src" | "alt" | "width" | "height"> {
    service: Service;
}

const ServiceIcon: FunctionComponent<ServiceIconProps> = ({
    service,
    ...props
}) => (
    <ChakraNextImage
        alt={service.name}
        src={service.icon}
        width={16}
        height={16}
        {...props}
    />
);

export default ServiceIcon;
