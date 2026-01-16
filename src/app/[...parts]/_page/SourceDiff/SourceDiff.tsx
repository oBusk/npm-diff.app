import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import SuspensedCompareSourceButton from "../DiffIntro/CompareSourceButton";
import Halfs from "../DiffIntro/Halfs";
import TrustBadge from "./TrustBadge";

export interface SourceDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

export default function SourceDiff({ a, b }: SourceDiffProps) {
    return (
        <Halfs
            left={
                <TrustBadge
                    suspenseKey={"trustbadge-" + simplePackageSpecToString(a)}
                    pkg={a}
                    comparisonPkg={b}
                    isTarget={false}
                    className="font-normal"
                />
            }
            center={
                <SuspensedCompareSourceButton
                    suspenseKey={"comparesource-" + a.name + b.name}
                    a={a}
                    b={b}
                />
            }
            right={
                <TrustBadge
                    suspenseKey={"trustbadge-" + simplePackageSpecToString(b)}
                    pkg={b}
                    comparisonPkg={a}
                    isTarget={true}
                    className="font-normal"
                />
            }
        />
    );
}
