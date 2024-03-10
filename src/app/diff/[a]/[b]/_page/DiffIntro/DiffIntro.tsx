import { type ElementRef, forwardRef, type ReactNode } from "react";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Stack, { type StackProps } from "^/components/ui/Stack";
import { cx } from "^/lib/cva";
import { type NpmDiffOptions } from "^/lib/npmDiff";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import contentVisibility from "^/lib/utils/contentVisibility";
import Halfs from "./Halfs";
import Options from "./Options";
import SpecBox from "./SpecBox";

export interface DiffIntroProps extends StackProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    services: ReactNode;
    options: NpmDiffOptions;
}

const DiffIntro = forwardRef<ElementRef<typeof Stack>, DiffIntroProps>(
    ({ a, b, services, options, className, ...props }, ref) => {
        if (a.name == null) {
            a.name = "ERROR";
        }
        if (b.name == null) {
            b.name = "ERROR";
        }

        return (
            <Stack
                align="center"
                className={cx(contentVisibility("700px"), className)}
                {...props}
                ref={ref}
            >
                <Heading className="mb-6 w-full text-center text-sm">
                    <span>Comparing</span>
                    <Halfs
                        left={<SpecBox pkg={a} pkgClassName="rounded-r-none" />}
                        center={
                            <span>
                                <Code className="rounded-none">...</Code>
                            </span>
                        }
                        right={
                            <SpecBox pkg={b} pkgClassName="rounded-l-none" />
                        }
                    />
                </Heading>
                {services}
                <Heading h={3} className="mt-4 text-sm">
                    npm diff
                </Heading>
                <Options options={options} />
                {/* <Command
                    aName={a.name}
                    aVersion={a.version}
                    bName={b.name}
                    bVersion={b.version}
                    options={options}
                /> */}
            </Stack>
        );
    },
);
DiffIntro.displayName = "DiffIntro";

export default DiffIntro;
