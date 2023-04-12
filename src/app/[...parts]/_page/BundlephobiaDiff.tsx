import bundlephobia from "^/lib/api/bundlephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import measuredPromise from "^/lib/measuredPromise";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import BundlephobiaFlags from "./DiffIntro/BundlePhobiaFlags";
import SizeComparison from "./SizeComparison";

export interface BundlephobiaDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

const BundlephobiaDiff = async ({ specs, a, b }: BundlephobiaDiffProps) => {
    const { result, time } = await measuredPromise(bundlephobia(specs));

    if (result == null) {
        console.warn("Bundlephobia result is null", { specs });
        return null;
    }

    if (result === TIMED_OUT) {
        console.warn("Bundlephobia timed out", { specs });
        return null;
    }

    console.log("Bundlephobia", { specs, time });

    return (
        <SizeComparison
            serviceName="bundlephobia"
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
            width="100%"
        />
    );
};

export default BundlephobiaDiff;
