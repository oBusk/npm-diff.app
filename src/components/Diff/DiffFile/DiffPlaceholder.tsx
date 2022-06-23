import { Button, forwardRef, Stack, StackProps } from "@chakra-ui/react";

export interface DiffPlaceholderProps extends StackProps {
    reason?: string;
}

const DiffPlaceholder = forwardRef<DiffPlaceholderProps, "div">(
    ({ reason, ...props }, ref) => (
        <Stack
            align="center"
            padding="2em"
            cursor="pointer"
            {...props}
            ref={ref}
        >
            <Button variant="ghost" colorScheme="blue">
                Load Diff
            </Button>
            {reason && <span>{reason}</span>}
        </Stack>
    ),
);

export default DiffPlaceholder;
