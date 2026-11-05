import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import BundlephobiaDiff, { BundlephobiaDiffSkeleton } from "./BundlephobiaDiff";
import PackagephobiaDiff, {
    PackagephobiaDiffSkeleton,
} from "./PackagephobiaDiff";
import Sources, { SourcesFallback } from "./Sources/Sources";

export interface DiffServicesProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

export const DiffServices = ({ a, b, specs }: DiffServicesProps) => {
    const key = specs.join("...");

    return (
        <>
            <Sources a={a} b={b} suspenseKey={"sources-" + key} />
            <BundlephobiaDiff
                a={a}
                b={b}
                specs={specs}
                suspenseKey={"bundlephobia-" + key}
            />
            <PackagephobiaDiff
                a={a}
                b={b}
                specs={specs}
                suspenseKey={"packagephobia-" + key}
            />
        </>
    );
};

export const DiffServicesSkeleton = () => (
    <>
        <SourcesFallback />
        <BundlephobiaDiffSkeleton />
        <PackagephobiaDiffSkeleton />
    </>
);
