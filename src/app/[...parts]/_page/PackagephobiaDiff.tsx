import { cacheLife } from "next/cache";
import packagephobia from "^/lib/api/packagephobia";
import { Packagephobia } from "^/lib/Services";
import suspense from "^/lib/suspense";
import measuredPromise from "^/lib/utils/measuredPromise";
import { SizeChips, SizeChipsSkeleton } from "./PackageMetrics";

export interface PackagephobiaDiffProps {
    specs: [string, string];
}

const { name } = Packagephobia;

const PackagephobiaDiffInner = async ({ specs }: PackagephobiaDiffProps) => {
    "use cache";

    // Cache for the shortest window that packagephobia is cached
    cacheLife("hours");

    const { result, time } = await measuredPromise(packagephobia(specs));

    if (result == null) {
        console.warn(`${name} result is null`, { specs });
        return null;
    }

    console.log(name, { specs, time });

    return (
        <SizeChips
            sizeRows={[
                {
                    name: "Publish size",
                    a: {
                        bytes: result.a.publish.bytes,
                        color: result.a.publish.color,
                    },
                    b: {
                        bytes: result.b.publish.bytes,
                        color: result.b.publish.color,
                    },
                },
                {
                    name: "Install size",
                    a: {
                        bytes: result.a.install.bytes,
                        color: result.a.install.color,
                    },
                    b: {
                        bytes: result.b.install.bytes,
                        color: result.b.install.color,
                    },
                },
            ]}
        />
    );
};

const PackagephobiaDiffSkeleton = () => (
    <SizeChipsSkeleton
        sizeRows={[{ name: "Publish size" }, { name: "Install size" }]}
    />
);

const SuspendedPackagephobia = suspense(
    PackagephobiaDiffInner,
    PackagephobiaDiffSkeleton,
);

export default SuspendedPackagephobia;
