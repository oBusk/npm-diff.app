import { forwardRef, HStack, type StackProps } from "@chakra-ui/react";

export interface FooterProps extends StackProps {}

const Footer = forwardRef<FooterProps, "footer">((props, ref) => {
    return (
        <HStack
            as="footer"
            css={{ label: "Footer", contain: "content" }}
            {...props}
            ref={ref}
        />
    );
});

export default Footer;
