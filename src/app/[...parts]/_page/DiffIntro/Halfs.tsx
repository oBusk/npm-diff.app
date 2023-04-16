import { Flex, FlexProps } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import { ReactNode } from "react";

export interface HalfsProps
    extends Omit<FlexProps, "children" | "left" | "right"> {
    left: ReactNode;
    center?: ReactNode;
    right: ReactNode;
}

const Halfs = forwardRef<HalfsProps, typeof Flex>(
    ({ left, center, right, ...props }, ref) => (
        <Flex {...props} ref={ref}>
            <Flex flex="1 0 0px" justifyContent="flex-end">
                {/* Left half */}
                {left}
            </Flex>
            {/* Center column */}
            {center}
            <Flex flex="1 0 0px" justifyContent="flex-start">
                {/* Right half */}
                {right}
            </Flex>
        </Flex>
    ),
);

export default Halfs;
