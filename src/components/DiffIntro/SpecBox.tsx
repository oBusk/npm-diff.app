import { Box, BoxProps, Code, forwardRef, Text } from "@chakra-ui/react";
import ServiceLinks from "./ServiceLinks";

interface SpecBoxProps extends BoxProps {
    packageName: string;
    packageVersion: string;
}

const SpecBox = forwardRef<SpecBoxProps, "div">(
    ({ packageName, packageVersion, ...props }, ref) => (
        <Box {...props} ref={ref}>
            <Code>
                {packageName}@{packageVersion}
            </Code>
            <Box>
                <ServiceLinks
                    packageName={packageName}
                    packageVersion={packageVersion}
                />
            </Box>
        </Box>
    ),
);

export default SpecBox;
