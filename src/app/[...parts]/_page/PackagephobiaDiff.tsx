import packagephobia from "^/lib/api/packagephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import measuredPromise from "^/lib/measuredPromise";
import SizeComparison, { ComparedPackage } from "./DiffIntro/SizeComparison";

export interface PackagephobiaDiffProps {
    a: ComparedPackage;
    b: ComparedPackage;
    specs: [string, string];
}

const PackagephobiaDiff = async ({ specs, a, b }: PackagephobiaDiffProps) => {
    const { result, time } = await measuredPromise(packagephobia(specs));

    if (result == null) {
        throw new Error("Packagephobia result is null");
    }

    if (result === TIMED_OUT) {
        throw new Error("Packagephobia timed out");
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
