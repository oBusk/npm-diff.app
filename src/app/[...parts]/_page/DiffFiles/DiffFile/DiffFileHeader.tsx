import {
    Button,
    Code,
    Heading,
    HStack,
    StackProps,
    Text,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import type { File } from "react-diff-view";
import Tooltip from "^/components/Tooltip";
import { unpkg } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import type { CountedChanges } from "^/lib/utils/countChanges";
import ServiceIcon from "../../ServiceIcon";

export interface DiffFileHeaderProps extends StackProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    file: File;
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
                <Text as="span">
                    <Text as="span" color="green.200" padding="0 4px">
                        +++{additions}
                    </Text>
                    <Text as="span" color="red.200" padding="0 4px">
                        ---{deletions}
                    </Text>
                </Text>
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
