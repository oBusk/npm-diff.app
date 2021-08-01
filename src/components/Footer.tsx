import { forwardRef, HStack, StackProps } from "@chakra-ui/react";

export interface FooterProps extends StackProps {}

const Footer = forwardRef<FooterProps, "footer">((props, ref) => {
    return <HStack as="footer" />;
});

export default Footer;
