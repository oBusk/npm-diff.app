import { forwardRef, Icon, IconProps } from "@chakra-ui/react";

export interface ServiceIconProps extends IconProps {}

const ServiceIcon = forwardRef<ServiceIconProps, "div">((props, ref) => {
    return <Icon width="14px" height="14px" {...props} ref={ref} />;
});

export default ServiceIcon;
