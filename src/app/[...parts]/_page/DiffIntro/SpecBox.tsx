import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import Pkg from "^/components/Pkg";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceLinks from "./ServiceLinks";

interface SpecBoxProps extends BoxProps {
    pkg: SimplePackageSpec;
}

const SpecBox = forwardRef<SpecBoxProps, "div">(({ pkg, ...props }, ref) => (
    <Box {...props} ref={ref}>
        <Pkg pkg={pkg} />
        <Box>
            <ServiceLinks pkg={pkg} />
        </Box>
    </Box>
));

export default SpecBox;
