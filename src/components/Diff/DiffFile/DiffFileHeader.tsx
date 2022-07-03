import { Button, Heading, HStack, StackProps, Text } from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { FunctionComponent } from "react";
import type { File } from "react-diff-view";
import { UNPKGIcon } from "^/components/icons";
import { Tooltip, TooltipCode } from "^/components/theme";
import { serviceLinks } from "^/lib/serviceLinks";
import countChanges from "^/lib/utils/countChanges";

export interface DiffFileHeaderProps extends StackProps {
    a: NpaResult;
    b: NpaResult;
    file: File;
}

const DiffFileHeader: FunctionComponent<DiffFileHeaderProps> = ({
    a: { name: aName, rawSpec: aVersion },
    b: { name: bName, rawSpec: bVersion },
    file: { type, oldPath, newPath, hunks },
    children,
    ...props
}) => {
    const { additions, deletions } = countChanges(hunks);

    return (
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
                        View{" "}
                        <TooltipCode>
                            {type === "delete" ? oldPath : newPath}
                        </TooltipCode>{" "}
                        on <TooltipCode>unpkg.com</TooltipCode>
                    </>
                }
            >
                <Button
                    size="sm"
                    variant="ghost"
                    rightIcon={<UNPKGIcon />}
                    as="a"
                    href={
                        type === "delete"
                            ? serviceLinks.UNPKG(aName, aVersion, oldPath)
                            : serviceLinks.UNPKG(bName, bVersion, newPath)
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    View file
                </Button>
            </Tooltip>
        </HStack>
    );
};

export default DiffFileHeader;
