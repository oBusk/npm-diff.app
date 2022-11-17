import {
    Button,
    Code,
    Heading,
    HStack,
    StackProps,
    Text,
} from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { FunctionComponent } from "react";
import type { File } from "react-diff-view";
import { Tooltip } from "^/components/theme";
import { unpkg } from "^/lib/Services";
import type { CountedChanges } from "^/lib/utils/countChanges";
import ServiceIcon from "../../ServiceIcon";

export interface DiffFileHeaderProps extends StackProps {
    a: NpaResult;
    b: NpaResult;
    file: File;
    countedChanges: CountedChanges;
}

const DiffFileHeader: FunctionComponent<DiffFileHeaderProps> = ({
    a: { name: aName, rawSpec: aVersion },
    b: { name: bName, rawSpec: bVersion },
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
                        ? unpkg.url(aName, aVersion, oldPath)
                        : unpkg.url(bName, bVersion, newPath)
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
