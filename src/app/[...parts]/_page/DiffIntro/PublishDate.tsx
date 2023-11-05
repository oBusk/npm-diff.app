import { type ComponentProps } from "react";
import Skeleton from "^/components/ui/Skeleton";
import publishDate from "^/lib/api/npm/publish-date";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";

export interface PublishDateProps extends ComponentProps<"div"> {
    pkg: SimplePackageSpec;
}

const shared = cx("flex h-5 items-center justify-center");

async function PublishDate({ pkg, className, ...props }: PublishDateProps) {
    const time = await publishDate(pkg);

    return (
        <div className={cx(shared, className)} {...props}>
            {new Date(time).toLocaleDateString()}
        </div>
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
