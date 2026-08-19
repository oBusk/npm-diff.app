import { ArrowRight } from "lucide-react";
import { type ElementRef, forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";
import { type NpmDiffOptions } from "^/lib/npmDiff";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import contentVisibility from "^/lib/utils/contentVisibility";
import DiffSummaryLine from "./DiffSummaryLine";
import TitleActions from "./TitleActions";

export interface DiffIntroProps extends HTMLAttributes<HTMLElement> {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
    options: NpmDiffOptions;
}

const LONG_SPEC_THRESHOLD = 20;

const DiffIntro = forwardRef<ElementRef<"section">, DiffIntroProps>(
    ({ a, b, specs, options, className, ...props }, ref) => {
        const aStr = simplePackageSpecToString(a);
        const bStr = simplePackageSpecToString(b);
        const isLong =
            aStr.length > LONG_SPEC_THRESHOLD ||
            bStr.length > LONG_SPEC_THRESHOLD;

        return (
            <section
                className={cx(
                    "flex w-full flex-wrap items-end justify-between gap-4",
                    contentVisibility("200px"),
                    className!,
                )}
                ref={ref}
                {...props}
            >
                <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                        Comparing
                    </span>
                    <h1
                        className={cx(
                            "flex flex-wrap items-center gap-3.5 font-mono font-medium tracking-[-0.02em] text-foreground",
                            isLong ? "text-xl" : "text-[28px]",
                        )}
                    >
                        <span>{aStr}</span>
                        <ArrowRight className="size-5 shrink-0 text-glyph" />
                        <span>{bStr}</span>
                    </h1>
                    <DiffSummaryLine
                        suspenseKey={`diff-summary-${specs.join("...")}`}
                        a={a}
                        b={b}
                        specs={specs}
                        options={options}
                    />
                </div>
                <TitleActions specs={specs} />
            </section>
        );
    },
);
DiffIntro.displayName = "DiffIntro";

export default DiffIntro;
