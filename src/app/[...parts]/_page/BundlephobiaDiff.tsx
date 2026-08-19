import { cacheLife } from "next/cache";
import bundlephobia from "^/lib/api/bundlephobia";
import { Bundlephobia } from "^/lib/Services";
import suspense from "^/lib/suspense";
import measuredPromise from "^/lib/utils/measuredPromise";
import BundlephobiaFlags, {
    BundlephobiaFlagsSkeleton,
} from "./DiffIntro/BundlePhobiaFlags";
import { SizeChips, SizeChipsSkeleton } from "./PackageMetrics";

export interface BundlephobiaDiffProps {
    specs: [string, string];
}

const { name } = Bundlephobia;

const BundlephobiaDiffInner = async ({ specs }: BundlephobiaDiffProps) => {
    "use cache";

    // The shortest cacheLife that `bundlephobia` uses is hours, so we can use that here too.
    cacheLife("hours");

    const { result, time } = await measuredPromise(bundlephobia(specs));

    if (result == null) {
        console.warn(`${name} result is null`, { specs });
        return null;
    }

    console.log(name, { specs, time });

    return (
        <SizeChips
            flags={<BundlephobiaFlags data={result} />}
            sizeRows={[
                {
                    name: "Minified",
                    a: {
                        bytes: result.a.size,
                    },
                    b: {
                        bytes: result.b.size,
                    },
                },
                {
                    name: "Gzipped",
                    a: {
                        bytes: result.a.gzip,
                    },
                    b: {
                        bytes: result.b.gzip,
                    },
                },
                {
                    name: "Dependencies",
                    a: {
                        count: result.a.dependencyCount,
                    },
                    b: {
                        count: result.b.dependencyCount,
                    },
                },
            ]}
        />
    );
};

const BundlephobiaDiffSkeleton = () => (
    <SizeChipsSkeleton
        flags={<BundlephobiaFlagsSkeleton />}
        sizeRows={[
            { name: "Minified" },
            { name: "Gzipped" },
            { name: "Dependencies" },
        ]}
    />
);

const BundlephobiaDiff = suspense(
    BundlephobiaDiffInner,
    BundlephobiaDiffSkeleton,
);

export default BundlephobiaDiff;
