import { ElementRef, forwardRef, ReactNode } from "react";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Stack, { StackProps } from "^/components/ui/Stack";
import { cx } from "^/lib/cva";
import { NpmDiffOptions } from "^/lib/npmDiff";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
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
                        left={<SpecBox pkg={a} />}
                        center={
                            <span>
                                <Code>...</Code>
                            </span>
                        }
                        right={<SpecBox pkg={b} />}
                    />
                </Heading>
                {services}
                <h3 className="text-sm">npm diff</h3>
                <Options options={options} />
                {/* <Command
                    aName={aName}
                    aVersion={aVersion}
                    bName={bName}
                    bVersion={bVersion}
                    options={options}
                /> */}
            </Stack>
        );
    },
);
DiffIntro.displayName = "DiffIntro";

export default DiffIntro;
