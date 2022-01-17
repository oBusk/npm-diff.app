import { HStack, StackProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface FooterProps extends StackProps {}

const Footer: FunctionComponent<FooterProps> = (props) => {
    return <HStack as="footer" {...props} />;
};

export default Footer;
