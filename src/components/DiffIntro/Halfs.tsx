import { Flex } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import { ReactNode } from "react";

interface ComparisonViewProps {
    left: ReactNode;
    center?: ReactNode;
    right: ReactNode;
}

const Halfs = forwardRef<ComparisonViewProps, typeof Flex>(
    ({ left, center, right, ...props }, ref) => (
        <Flex ref={ref} {...props}>
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
