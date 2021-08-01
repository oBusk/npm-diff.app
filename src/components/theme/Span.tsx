import { chakra, forwardRef, HTMLChakraProps } from "@chakra-ui/react";

export interface SpanProps extends HTMLChakraProps<"span"> {}

const Span = forwardRef<HTMLChakraProps<"span">, "span">((props, ref) => (
    <chakra.span ref={ref} {...props}></chakra.span>
));

export default Span;
