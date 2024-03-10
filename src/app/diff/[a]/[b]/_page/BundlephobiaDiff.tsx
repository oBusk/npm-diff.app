import bundlephobia from "^/lib/api/bundlephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import { Bundlephobia } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import measuredPromise from "^/lib/utils/measuredPromise";
import BundlephobiaFlags, {
    BundlephobiaFlagsSkeleton,
} from "./DiffIntro/BundlePhobiaFlags";
import SizeComparison, { SizeComparisonSkeleton } from "./SizeComparison";

export interface BundlephobiaDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

const { name } = Bundlephobia;

const BundlephobiaDiffInner = async ({
    specs,
    a,
    b,
}: BundlephobiaDiffProps) => {
    const { result, time } = await measuredPromise(bundlephobia(specs));

    if (result == null) {
        console.warn(`${name} result is null`, { specs });
        return null;
    }

    if (result === TIMED_OUT) {
        console.warn(`${name} timed out`, { specs });
        return null;
    }

    console.log(name, { specs, time });

    return (
        <SizeComparison
            serviceName={name}
            flags={<BundlephobiaFlags data={result} />}
            a={a}
            b={b}
            sizeRows={[
                {
                    name: "Size",
                    a: {
                        bytes: result.a.size,
                    },
                    b: {
                        bytes: result.b.size,
                    },
                },
                {
                    name: "Gzip",
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
    <SizeComparisonSkeleton
        serviceName={name}
        flags={<BundlephobiaFlagsSkeleton />}
        sizeRows={[
            {
                name: "Size",
                a: 42,
                b: 84,
            },
            {
                name: "Gzip",
                a: 42,
                b: 84,
            },
            {
                name: "Dependencies",
                a: 16,
                b: 32,
            },
        ]}
    />
);

const BundlephobiaDiff = suspense(
    BundlephobiaDiffInner,
    BundlephobiaDiffSkeleton,
);

export default BundlephobiaDiff;
