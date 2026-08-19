import { FileDiff, type LucideIcon, Scale, ShieldCheck } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
    {
        icon: ShieldCheck,
        title: "Source & trust",
        body: "Provenance, build workflow and publisher changes between the two releases.",
    },
    {
        icon: Scale,
        title: "Size deltas",
        body: "Bundlephobia and Packagephobia numbers, side by side with the difference.",
    },
    {
        icon: FileDiff,
        title: "Every changed file",
        body: "Split or unified, with the published tarball contents — not the git tree.",
    },
];

const FeatureCards = () => (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
                key={title}
                className="flex flex-col gap-1.5 bg-background p-[18px]"
            >
                <Icon className="size-[18px] text-info" />
                <h3 className="text-[14px] font-semibold">{title}</h3>
                <p className="text-[13px] leading-[19px] text-muted-foreground">
                    {body}
                </p>
            </div>
        ))}
    </div>
);

export default FeatureCards;
