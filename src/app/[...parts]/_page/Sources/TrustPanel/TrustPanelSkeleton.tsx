import Skeleton from "^/components/ui/Skeleton";

const TrustPanelSkeleton = () => (
    <section className="w-full rounded-xl border border-line bg-card">
        <div className="flex items-center gap-3 border-b border-line p-4">
            <Skeleton className="size-9 shrink-0 rounded-[9px]" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3.5 w-full max-w-md" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col gap-3 border-b border-line p-4 sm:border-r sm:border-b-0">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    </section>
);

export default TrustPanelSkeleton;
