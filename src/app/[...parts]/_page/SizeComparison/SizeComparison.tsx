import { FunctionComponent, ReactNode } from "react";
import ExternalLink, { ExternalLinkProps } from "^/components/ExternalLink";
import Heading from "^/components/ui/Heading";
import { cx } from "^/lib/cva";
import { Service, ServiceName, Services } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import { prettyByte } from "^/lib/utils/prettyByte";
import Halfs from "../DiffIntro/Halfs";
import ServiceTooltip from "../DiffIntro/ServiceTooltip";

function differance(a: number, b: number): ReactNode {
    const diff = a - b;

    if (diff < 0) {
        return ` (${diff})`;
    } else if (diff > 0) {
        return ` (+${diff})`;
    } else {
        return "";
    }
}

function byteDifferance(a: number, b: number): ReactNode {
    const diff = b - a;

    if (diff < 0) {
        return ` (${prettyByte(diff)})`;
    } else if (diff > 0) {
        return ` (+${prettyByte(diff)})`;
    } else {
        return "";
    }
}

const LinkButton: FunctionComponent<
    ExternalLinkProps & {
        pkg: SimplePackageSpec;
        service: Service;
    }
> = ({ pkg, service, className, ...props }) => {
    return (
        <ServiceTooltip serviceName={service.name} pkg={pkg}>
            <ExternalLink
                className={cx(
                    COMMON_PADDING,
                    "rounded-lg text-center hover:bg-muted",
                    className,
                )}
                href={service.url(pkg)}
                {...props}
            />
        </ServiceTooltip>
    );
};

const SizeText: FunctionComponent<{
    bytes: number;
    color?: string;
    num?: number;
    baseBytes?: number;
}> = ({ bytes, color, baseBytes }) => (
    <p>
        <span color={color}>{prettyByte(bytes)}</span>
        {baseBytes != null && baseBytes != 0 && (
            <small>{byteDifferance(baseBytes, bytes)}</small>
        )}
    </p>
);

const CountText: FunctionComponent<{
    count: number;
    baseCount?: number;
}> = ({ count, baseCount }) => (
    <p>
        <span>{count}</span>
        {baseCount != null && baseCount != 0 && (
            <small>{differance(baseCount, count)}</small>
        )}
    </p>
);

export interface Size {
    bytes?: number;
    count?: number;
    color?: string;
}

export interface SizeComparisonRow {
    /** Like "install" or "gzipped" */
    name: string;
    a: Size;
    b: Size;
}

export interface SizeComparisonProps {
    serviceName: ServiceName;
    flags?: ReactNode;
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    sizeRows: SizeComparisonRow[];
}

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "p-2";

const SizeComparison = ({
    serviceName,
    flags,
    a,
    b,
    sizeRows,
}: SizeComparisonProps) => {
    const service = Services[serviceName];
    return (
        <>
            <Heading className="text-xs">{service.name}</Heading>
            {flags}
            <Halfs
                className="w-full"
                left={
                    <LinkButton service={service} pkg={a}>
                        {sizeRows.map(({ name, a }) => {
                            if (a.bytes != null) {
                                return (
                                    <SizeText
                                        key={name}
                                        bytes={a.bytes}
                                        color={a.color}
                                    />
                                );
                            } else if (a.count != null) {
                                return <CountText key={name} count={a.count} />;
                            } else {
                                return null;
                            }
                        })}
                    </LinkButton>
                }
                center={
                    <section className={cx(COMMON_PADDING, "text-center")}>
                        {sizeRows.map((sizeRow) => (
                            <p key={sizeRow.name}>{sizeRow.name}</p>
                        ))}
                    </section>
                }
                right={
                    <LinkButton service={service} pkg={b}>
                        {sizeRows.map(({ name, a, b }) => {
                            if (b.bytes != null) {
                                return (
                                    <SizeText
                                        key={name}
                                        bytes={b.bytes}
                                        color={b.color}
                                        baseBytes={a.bytes}
                                    />
                                );
                            } else if (b.count != null) {
                                return (
                                    <CountText
                                        key={name}
                                        count={b.count}
                                        baseCount={a.count}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </LinkButton>
                }
            />
        </>
    );
};

export default SizeComparison;
