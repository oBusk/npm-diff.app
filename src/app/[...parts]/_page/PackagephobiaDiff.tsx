import packagephobia from "^/lib/api/packagephobia";
import { Packagephobia } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import measuredPromise from "^/lib/utils/measuredPromise";
import SizeComparison, { SizeComparisonSkeleton } from "./SizeComparison";

export interface PackagephobiaDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

const { name } = Packagephobia;

const PackagephobiaDiffInner = async ({
    specs,
    a,
    b,
}: PackagephobiaDiffProps) => {
    const { result, time } = await measuredPromise(packagephobia(specs));

    if (result == null) {
        console.warn(`${name} result is null`, { specs });
        return null;
    }

    console.log(name, { specs, time });

    return (
        <SizeComparison
            serviceName={name}
            a={a}
            b={b}
            sizeRows={[
                {
                    name: "Publish",
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
                    name: "Install",
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
    <SizeComparisonSkeleton
        serviceName={name}
        sizeRows={[
            {
                name: "Publish",
                a: 59,
                b: 112,
            },
            {
                name: "Install",
                a: 59,
                b: 112,
            },
        ]}
    />
);

const SuspendedPackagephobia = suspense(
    PackagephobiaDiffInner,
    PackagephobiaDiffSkeleton,
);

export default SuspendedPackagephobia;
