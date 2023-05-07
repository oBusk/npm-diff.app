import { FunctionComponent } from "react";
import type { FileData } from "react-diff-view";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Skeleton from "^/components/ui/Skeleton";
import Stack, { StackProps } from "^/components/ui/Stack";
import Tooltip from "^/components/ui/Tooltip";
import { cx } from "^/lib/cva";
import { unpkg } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
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
    className,
    ...props
}) => (
    <Stack
        direction="h"
        align="center"
        justify="between"
        className={cx("w-full", className)}
        {...props}
    >
        <Heading h={4} className="text-base">
            {type === "delete" ? oldPath : newPath}{" "}
            <Tooltip
                label={`${
                    additions + deletions
                } changes: ${additions} additions & ${deletions} deletions`}
            >
                <span>
                    <span className="px-1 text-green-500">+++{additions}</span>
                    <span className="px-1 text-red-500">---{deletions}</span>
                </span>
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
            <Button size="sm" variant="ghost" asChild>
                <ExternalLink
                    href={
                        type === "delete"
                            ? unpkg.url(a, oldPath)
                            : unpkg.url(b, newPath)
                    }
                >
                    <ServiceIcon
                        service={unpkg}
                        className="mr-1.5 inline-block"
                    />
                    View file
                </ExternalLink>
            </Button>
        </Tooltip>
    </Stack>
);

export default DiffFileHeader;

export const DiffFileHeaderSkeleton = () => (
    <Stack direction="h" justify="between" className="w-full">
        <Heading h={4} className="flex items-center">
            <Skeleton className="mt-1 h-2 w-44" />
            <span>
                <span className="px-1 opacity-50">+++0</span>
                <span className="px-1 opacity-50">---0</span>
            </span>
        </Heading>
        <Button size="sm" variant="ghost">
            <ServiceIcon service={unpkg} className="mr-1.5 inline-block" /> View
            file
        </Button>
    </Stack>
);
