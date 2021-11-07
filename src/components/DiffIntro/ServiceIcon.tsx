import { forwardRef, Icon, IconProps } from "@chakra-ui/react";

export interface ServiceIconProps extends IconProps {}

const ServiceIcon = forwardRef<ServiceIconProps, typeof Icon>((props, ref) => {
    return <Icon width="14px" height="14px" ref={ref} {...props} />;
});

export default ServiceIcon;
