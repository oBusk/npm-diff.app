import { chakra, Icon, IconProps } from "@chakra-ui/react";

export interface ServiceIconProps extends IconProps {}

const ServiceIcon = chakra(Icon, {
    baseStyle: {
        width: "14px",
        height: "14px",
    },
});

export default ServiceIcon;
