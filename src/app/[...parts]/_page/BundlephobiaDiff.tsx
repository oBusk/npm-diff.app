import bundlephobia from "^/lib/api/bundlephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import measuredPromise from "^/lib/measuredPromise";
import BundlephobiaFlags from "./DiffIntro/BundlePhobiaFlags";
import SizeComparison, { ComparedPackage } from "./DiffIntro/SizeComparison";

export interface BundlephobiaDiffProps {
    a: ComparedPackage;
    b: ComparedPackage;
    specs: [string, string];
}

const BundlephobiaDiff = async ({ specs, a, b }: BundlephobiaDiffProps) => {
    const { result, time } = await measuredPromise(bundlephobia(specs));

    if (result == null) {
        throw new Error("Bundlephobia result is null");
    }

    if (result === TIMED_OUT) {
        throw new Error("Bundlephobia timed out");
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
