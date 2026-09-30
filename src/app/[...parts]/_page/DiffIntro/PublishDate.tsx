import ClientDate from "^/components/ClientDate";
import Skeleton from "^/components/ui/Skeleton";
import getPublishTime from "^/lib/api/packageVersions/publishTime";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";

export interface PublishDateProps {
    className?: string;
    pkg: SimplePackageSpec;
}

const shared = cx("my-1 flex h-5 items-center justify-center");

async function PublishDate({ pkg, className }: PublishDateProps) {
    const time = await getPublishTime(pkg.name, pkg.version);

    if (!time) {
        return null;
    }

    return (
        <ClientDate
            time={time}
            className={cx(shared!, "cursor-help", className!)}
        />
    );
}

function PublishDateFallback({ className }: PublishDateProps) {
    return (
        <div className={cx(shared!, className!)}>
            <Skeleton className="h-2 w-16" />
        </div>
    );
}

const SuspensedPublishDate = suspense(PublishDate, PublishDateFallback);

export default SuspensedPublishDate;
