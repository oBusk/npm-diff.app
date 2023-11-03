import { forwardRef, HTMLAttributes } from "react";
import ExternalLink from "^/components/ExternalLink";
import Code from "^/components/ui/Code";

export interface IntroProps extends HTMLAttributes<HTMLElement> {}

const Intro = forwardRef<HTMLElement, IntroProps>((props, ref) => (
    <section {...props} ref={ref}>
        <p className="text-center">
            <ExternalLink href="https://docs.npmjs.com/cli/v7/commands/npm-diff">
                <Code>npm diff</Code>
            </ExternalLink>{" "}
            online!
        </p>
        <p className="text-center">
            Web tool to compare versions, or branches, of NPM packages.
        </p>
    </section>
));
Intro.displayName = "Intro";

export default Intro;
