import { ChevronsRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Heading from "^/components/ui/Heading";
import { cx } from "^/lib/cva";

export function NewFeatureSourceTrust() {
    return (
        <Link
            href="/about/source-trust"
            className={cx(
                "mx-auto w-full max-w-sm lg:max-w-md",
                "rounded-xl border",
                "p-2",
                "bg-gradient-to-b from-blue-900/25 to-transparent",
                "hover:bg-gradient-to-b hover:from-blue-900/50 ",
            )}
        >
            <Heading h={4} className="text-center text-base lg:text-xl">
                New Feature: Source and Trust
            </Heading>
            <div className="flex">
                <ShieldCheck
                    className={cx("mr-2 size-16 text-blue-400", "lg:size-28")}
                />
                <div className="flex flex-col justify-center gap-2 text-xs text-muted-foreground lg:text-sm">
                    <p>
                        Diff view now shows source information and trust
                        warnings
                    </p>
                    <p>
                        Click to read more{" "}
                        <ChevronsRight className="inline size-4" />
                    </p>
                </div>
            </div>
        </Link>
    );
}
