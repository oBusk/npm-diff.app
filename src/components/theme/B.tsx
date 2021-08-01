import { chakra, forwardRef, HTMLChakraProps } from "@chakra-ui/react";

export interface BProps extends HTMLChakraProps<"b"> {}

const B = forwardRef<BProps, "b">((props, ref) => {
    return <chakra.b {...props} ref={ref} />;
});

export default B;
