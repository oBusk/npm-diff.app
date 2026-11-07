import { type ComponentRef, forwardRef, type ReactNode } from "react";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Skeleton from "^/components/ui/Skeleton";
import Stack, { type StackProps } from "^/components/ui/Stack";
import { cx } from "^/lib/cva";
import { type NpmDiffOptions } from "^/lib/npmDiff";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import contentVisibility from "^/lib/utils/contentVisibility";
import Halfs from "./Halfs";
import Options from "./Options";
import SpecBox, { SpecBoxSkeleton } from "./SpecBox";

interface DiffIntroLayoutProps extends StackProps {
    left: ReactNode;
    right: ReactNode;
    services: ReactNode;
    options: ReactNode;
}

const DiffIntroLayout = forwardRef<
    ComponentRef<typeof Stack>,
    DiffIntroLayoutProps
>(({ left, right, services, options, className, ...props }, ref) => (
    <Stack
        align="center"
        className={cx(contentVisibility("700px"), className!)}
        {...props}
        ref={ref}
    >
        <Heading className="mb-6 w-full text-center text-sm">
            <span>Comparing</span>
            <Halfs
                left={left}
                center={
                    <span>
                        <Code className="rounded-none">...</Code>
                    </span>
                }
                right={right}
            />
        </Heading>
        {services}
        <Heading h={3} className="mt-4 text-sm">
            npm diff
        </Heading>
        {options}
    </Stack>
));
DiffIntroLayout.displayName = "DiffIntroLayout";

export interface DiffIntroProps extends StackProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    services: ReactNode;
    options: NpmDiffOptions;
}

const DiffIntro = forwardRef<ComponentRef<typeof Stack>, DiffIntroProps>(
    ({ a, b, options, ...props }, ref) => (
        <DiffIntroLayout
            {...props}
            ref={ref}
            left={
                <SpecBox
                    pkg={{ ...a, name: a.name ?? "ERROR" }}
                    pkgClassName="rounded-r-none"
                />
            }
            right={
                <SpecBox
                    pkg={{ ...b, name: b.name ?? "ERROR" }}
                    pkgClassName="rounded-l-none"
                />
            }
            options={
                <>
                    <Options options={options} />
                    {/* <Command
                        aName={a.name}
                        aVersion={a.version}
                        bName={b.name}
                        bVersion={b.version}
                        options={options}
                    /> */}
                </>
            }
        />
    ),
);
DiffIntro.displayName = "DiffIntro";

export interface DiffIntroSkeletonProps extends StackProps {
    services: ReactNode;
}

export const DiffIntroSkeleton = (props: DiffIntroSkeletonProps) => (
    <DiffIntroLayout
        {...props}
        left={<SpecBoxSkeleton pkgClassName="rounded-r-none" />}
        right={<SpecBoxSkeleton pkgClassName="rounded-l-none" />}
        options={<Skeleton className="my-2 h-20 w-64" />}
    />
);

export default DiffIntro;
