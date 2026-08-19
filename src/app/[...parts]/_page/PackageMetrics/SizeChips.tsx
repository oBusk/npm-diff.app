import { type ReactNode } from "react";
import { prettyByte } from "^/lib/utils/prettyByte";
import MetricChip from "./MetricChip";

export interface Size {
    bytes?: number;
    count?: number;
    color?: string;
}

export interface SizeComparisonRow {
    /** Like "Install" or "Gzipped" */
    name: string;
    a: Size;
    b: Size;
}

export interface SizeChipsProps {
    flags?: ReactNode;
    sizeRows: SizeComparisonRow[];
}

function byteDelta(a: number, b: number): ReactNode {
    const diff = b - a;
    if (diff === 0) return "no change";
    return diff > 0 ? `+${prettyByte(diff)}` : prettyByte(diff);
}

function countDelta(a: number, b: number): ReactNode {
    const diff = b - a;
    if (diff === 0) return "no change";
    return diff > 0 ? `+${diff}` : `${diff}`;
}

/**
 * Deltas are always neutral — a size or dependency change is not
 * inherently good or bad, so it must never read as a red/green warning.
 */
const SizeChips = ({ flags, sizeRows }: SizeChipsProps) => (
    <>
        {flags}
        {sizeRows.map(({ name, a, b }) => {
            if (a.bytes != null && b.bytes != null) {
                return (
                    <MetricChip
                        key={name}
                        name={name}
                        a={prettyByte(a.bytes)}
                        b={prettyByte(b.bytes)}
                        delta={byteDelta(a.bytes, b.bytes)}
                    />
                );
            } else if (a.count != null && b.count != null) {
                return (
                    <MetricChip
                        key={name}
                        name={name}
                        a={a.count}
                        b={b.count}
                        delta={countDelta(a.count, b.count)}
                    />
                );
            } else {
                return null;
            }
        })}
    </>
);

export default SizeChips;
