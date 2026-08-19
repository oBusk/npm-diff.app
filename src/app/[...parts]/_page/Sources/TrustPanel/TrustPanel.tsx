import {
    GitCommitHorizontal,
    ShieldAlert,
    ShieldCheck,
    ShieldOff,
    User,
    Workflow,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import {
    type SourceInformation,
    type TrustAuditFinding,
} from "^/lib/api/npm/sourceInformation";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import SourceCompareButton from "../SourceCompareButton";
import SignalRow from "./SignalRow";

export interface TrustPanelProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    sourceA: SourceInformation | null;
    sourceB: SourceInformation | null;
    findings: TrustAuditFinding[];
    className?: string;
}

type TrustState = "attested" | "no-provenance" | "downgrade";

const STATE_CONFIG: Record<
    TrustState,
    {
        icon: typeof ShieldCheck;
        pill: string;
        accent: string;
        borderClass: string;
        titleClass: string;
    }
> = {
    attested: {
        icon: ShieldCheck,
        pill: "Attested",
        accent: "#4ade80",
        borderClass: "border-add/30",
        titleClass: "text-foreground",
    },
    "no-provenance": {
        icon: ShieldOff,
        pill: "Unverifiable",
        accent: "#7dd3fc",
        borderClass: "border-line-strong",
        titleClass: "text-foreground",
    },
    downgrade: {
        icon: ShieldAlert,
        pill: "Downgrade",
        accent: "#f87171",
        borderClass: "border-[#5a2530]",
        titleClass: "text-[#fde4e4]",
    },
};

function signalRows(
    source: SourceInformation | null,
    tone: "add" | "remove" | "muted",
) {
    const provenance = source?.provenance ?? null;

    return (
        <>
            <SignalRow
                icon={provenance ? ShieldCheck : ShieldOff}
                label="Provenance"
                value={provenance ? "attested · npm registry" : "none"}
                tone={tone}
            />
            <SignalRow
                icon={GitCommitHorizontal}
                label="Source commit"
                value={
                    provenance
                        ? `${provenance.repositoryPath}@${provenance.commitHash.slice(0, 7)}`
                        : "unknown"
                }
                tone={tone}
            />
            <SignalRow
                icon={Workflow}
                label="Built by"
                value={
                    provenance
                        ? `${provenance.buildPlatform} · ${provenance.buildFileName}`
                        : "unknown machine"
                }
                tone={tone}
            />
            <SignalRow
                icon={User}
                label="Published by"
                value={
                    source?.publishedBy
                        ? source.hasTrustedPublisher
                            ? `${source.publishedBy} · trusted publisher`
                            : source.publishedBy
                        : "unknown"
                }
                tone={tone}
            />
        </>
    );
}

const TrustPanel = ({
    a,
    b,
    sourceA,
    sourceB,
    findings,
    className,
}: TrustPanelProps) => {
    const aStr = simplePackageSpecToString(a);
    const bStr = simplePackageSpecToString(b);

    const hasA = Boolean(sourceA?.provenance);
    const hasB = Boolean(sourceB?.provenance);
    const hasRedFinding = findings.some(
        (finding) => finding.severity === "red",
    );

    const state: TrustState =
        !hasA && !hasB
            ? "no-provenance"
            : hasA && hasB && !hasRedFinding
              ? "attested"
              : "downgrade";

    const config = STATE_CONFIG[state];
    const Icon = config.icon;

    let title: string;
    let sub: ReactNode;
    let foot: ReactNode;

    if (state === "no-provenance") {
        title = "Neither release can be traced to source";
        sub =
            "No provenance attestation on either version — the diff below cannot be checked against a commit, so you are trusting the publisher.";
        foot = "No provenance attestation was found for either release.";
    } else if (state === "attested") {
        title = "Both releases are attested";
        sub =
            "Provenance is verified for both versions — you can compare the exact commits that produced each release.";
        foot =
            "Provenance links this package to the exact commit and workflow that built it.";
    } else {
        // The full-loss framing below only makes sense when the target
        // dropped provenance entirely — for the other downgrade triggers
        // (repository/workflow changes, or lost trusted-publisher status
        // while both still have provenance) a generic notice points at the
        // specific findings rendered below instead.
        const fullLoss = hasA && !hasB;
        if (fullLoss) {
            title = "Trust downgrade — every signal is lost";
            sub = (
                <>
                    {aStr} is attested and traceable to a commit built by CI.{" "}
                    {bStr} has no attestation at all, so moving to it gives up
                    all verification you have today.
                </>
            );
        } else {
            title = "Trust signals changed";
            sub =
                "This release has fewer or different trust signals than the source — see the findings below for details.";
        }
        foot =
            "Downgrades are flagged whenever the target release has fewer trust signals than the source.";
    }

    return (
        <section
            className={cx(
                "w-full rounded-xl border bg-card",
                config.borderClass,
                className!,
            )}
        >
            <div
                className="flex items-start justify-between gap-4 rounded-t-xl border-b p-4"
                style={{
                    borderColor: state === "downgrade" ? "#5a2530" : undefined,
                    backgroundImage: `linear-gradient(to right, ${config.accent}1f, transparent)`,
                }}
            >
                <div className="flex items-start gap-3">
                    <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-[9px]"
                        style={{ backgroundColor: `${config.accent}22` }}
                    >
                        <Icon
                            className="size-[19px]"
                            style={{ color: config.accent }}
                        />
                    </span>
                    <div className="flex flex-col gap-1">
                        <h3
                            className={cx(
                                "text-[16px] font-semibold tracking-[-0.01em]",
                                config.titleClass,
                            )}
                        >
                            {title}
                        </h3>
                        <p className="text-[13.5px] leading-5 text-pretty text-muted-foreground">
                            {sub}
                        </p>
                    </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                    <span
                        className="rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-widest uppercase"
                        style={{
                            borderColor: `${config.accent}55`,
                            backgroundColor: `${config.accent}1f`,
                            color: config.accent,
                        }}
                    >
                        {config.pill}
                    </span>
                    {state === "attested" &&
                    sourceA?.provenance &&
                    sourceB?.provenance ? (
                        <SourceCompareButton
                            sourceA={sourceA.provenance}
                            sourceB={sourceB.provenance}
                            prominent
                        />
                    ) : null}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-3.5 border-b border-line p-4 sm:border-r sm:border-b-0">
                    <span className="truncate font-mono text-[12.5px] text-secondary-foreground">
                        {aStr}
                    </span>
                    {signalRows(
                        sourceA,
                        state === "downgrade"
                            ? "add"
                            : state === "attested"
                              ? "add"
                              : "muted",
                    )}
                </div>
                <div
                    className={cx(
                        "flex flex-col gap-3.5 p-4",
                        state === "downgrade" && "bg-remove/5",
                    )}
                >
                    <span className="truncate font-mono text-[12.5px] text-secondary-foreground">
                        {bStr}
                    </span>
                    {signalRows(
                        sourceB,
                        state === "downgrade"
                            ? "remove"
                            : state === "attested"
                              ? "add"
                              : "muted",
                    )}
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-xl border-t border-line bg-background px-4 py-3 text-[12.5px] text-faint">
                <span>{foot}</span>
                <Link
                    href="/-/about/source-trust"
                    className="text-secondary-foreground hover:text-foreground"
                >
                    How trust checks work →
                </Link>
            </div>
        </section>
    );
};

export default TrustPanel;
