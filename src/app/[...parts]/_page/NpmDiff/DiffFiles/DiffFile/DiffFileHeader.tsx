import { type FunctionComponent } from "react";
import type { FileData } from "react-diff-view";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Skeleton from "^/components/ui/Skeleton";
import Stack, { type StackProps } from "^/components/ui/Stack";
import Tooltip from "^/components/ui/Tooltip";
import { cx } from "^/lib/cva";
import { unpkg } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import type { CountedChanges } from "^/lib/utils/countChanges";
import ServiceIcon from "../../../ServiceIcon";
import Sparkline from "../Sparkline";

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
        className={cx("w-full gap-3", className!)}
        {...props}
    >
        <Heading
            h={4}
            className="min-w-0 truncate font-mono text-[13.5px] font-normal"
        >
            {type === "delete" ? oldPath : newPath}{" "}
            <Tooltip
                label={`${
                    additions + deletions
                } changes: ${additions} additions & ${deletions} deletions`}
            >
                <span className="text-xs">
                    <span className="px-1 text-add">+{additions}</span>
                    <span className="px-1 text-remove">−{deletions}</span>
                </span>
            </Tooltip>
        </Heading>
        <Sparkline additions={additions} deletions={deletions} />
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
                asChild
                className="h-7 shrink-0 gap-1.5 rounded-[7px] border border-accent px-2.5 text-[12.5px] text-secondary-foreground"
            >
                <ExternalLink
                    href={
                        type === "delete"
                            ? unpkg.url(a, oldPath)
                            : unpkg.url(b, newPath)
                    }
                >
                    <ServiceIcon
                        service={unpkg}
                        className="inline-block size-3"
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
