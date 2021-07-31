import { Icon, forwardRef, IconProps } from "@chakra-ui/react";

export interface ServiceIconProps extends IconProps {}

const ServiceIcon = forwardRef<ServiceIconProps, "div">((props, ref) => (
    <Icon width="14px" height="14px" ref={ref} {...props} />
));

export default ServiceIcon;
