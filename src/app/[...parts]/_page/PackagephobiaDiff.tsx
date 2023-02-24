import packagephobia from "^/lib/api/packagephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import measuredPromise from "^/lib/measuredPromise";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import SizeComparison from "./DiffIntro/SizeComparison";

export interface PackagephobiaDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

const PackagephobiaDiff = async ({ specs, a, b }: PackagephobiaDiffProps) => {
    const { result, time } = await measuredPromise(packagephobia(specs));

    if (result == null) {
        console.warn("Packagephobia result is null", { specs });
        return null;
    }

    if (result === TIMED_OUT) {
        console.warn("Packagephobia timed out", { specs });
        return null;
    }

    console.log("Packagephobia", { specs, time });

    return (
        <SizeComparison
            serviceName="packagephobia"
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
            width="100%"
        />
    );
};

export default PackagephobiaDiff;
