import { type ComponentPropsWithoutRef } from "react";
import ClientDate from "^/components/ClientDate";
import Skeleton from "^/components/ui/Skeleton";
import getVersionData from "^/lib/api/npm/getVersionData";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";

export interface PublishDateProps extends ComponentPropsWithoutRef<"div"> {
    pkg: SimplePackageSpec;
}

const shared = cx("my-1 flex h-5 items-center justify-center");

async function PublishDate({ pkg, className, ...props }: PublishDateProps) {
    const versionData = await getVersionData(pkg);

    const time = versionData[pkg.version]?.time ?? null;

    return (
        <ClientDate
            time={time}
            className={cx(shared, "cursor-help", className)}
            {...props}
        />
    );
}

function PublishDateFallback({ className }: PublishDateProps) {
    return (
        <div className={cx(shared, className)}>
            <Skeleton className="h-2 w-16" />
        </div>
    );
}

const SuspensedPublishDate = suspense(PublishDate, PublishDateFallback);

export default SuspensedPublishDate;
