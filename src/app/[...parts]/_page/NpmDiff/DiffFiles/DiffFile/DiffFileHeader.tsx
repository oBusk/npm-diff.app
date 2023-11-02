import {
    Button,
    Code,
    Heading,
    HStack,
    Skeleton,
    type StackProps,
    VStack,
} from "@chakra-ui/react";
import { type FunctionComponent } from "react";
import type { FileData } from "react-diff-view";
import Span from "^/components/Span";
import Tooltip from "^/components/Tooltip";
import { unpkg } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import type { CountedChanges } from "^/lib/utils/countChanges";
import ServiceIcon from "../../../ServiceIcon";

export interface DiffFileHeaderProps extends StackProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    file: FileData;
    countedChanges: CountedChanges;
}

const DiffFileHeader: FunctionComponent<DiffFileHeaderProps> = ({
    a,
    b,
    file: { type, oldPath, newPath },
    countedChanges: { additions, deletions },
    children,
    ...props
}) => (
    <HStack justifyContent="space-between" width="100%" {...props}>
        <Heading size="sm">
            {type === "delete" ? oldPath : newPath}{" "}
            <Tooltip
                label={`${
                    additions + deletions
                } changes: ${additions} additions & ${deletions} deletions`}
            >
                <Span>
                    <Span color="green.200" padding="0 4px">
                        +++{additions}
                    </Span>
                    <Span color="red.200" padding="0 4px">
                        ---{deletions}
                    </Span>
                </Span>
            </Tooltip>
        </Heading>
        <Tooltip
            label={
                <>
                    View <Code>{type === "delete" ? oldPath : newPath}</Code> on{" "}
                    <Code>unpkg.com</Code>
                </>
            }
        >
            <Button
                size="sm"
                variant="ghost"
                rightIcon={<ServiceIcon service={unpkg} />}
                as="a"
                href={
                    type === "delete"
                        ? unpkg.url(a, oldPath)
                        : unpkg.url(b, newPath)
                }
                rel="noopener noreferrer"
                target="_blank"
            >
                View file
            </Button>
        </Tooltip>
    </HStack>
);

export default DiffFileHeader;

export function DiffFileHeaderSkeleton() {
    return (
        <HStack justifyContent="space-between" width="100%">
            <Heading size="sm" as={HStack}>
                <Skeleton width={170} height="0.5rem" />
                <Span>
                    <Span opacity={0.5} padding="0 4px">
                        +++0
                    </Span>
                    <Span opacity={0.5} padding="0 4px">
                        ---0
                    </Span>
                </Span>
            </Heading>
            <Button
                size="sm"
                variant="ghost"
                rightIcon={<ServiceIcon service={unpkg} />}
            >
                View file
            </Button>
        </HStack>
    );
}
