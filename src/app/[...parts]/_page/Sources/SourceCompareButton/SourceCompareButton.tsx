import { type SourceInformation } from "^/lib/api/npm/sourceInformation";
import { CompareButton } from "./CompareButton";

export interface SourceCompareButtonProps {
    sourceA: SourceInformation;
    sourceB: SourceInformation;
}

export default function SourceCompareButton({
    sourceA,
    sourceB,
}: SourceCompareButtonProps) {
    if (sourceA.repositoryUrl !== sourceB.repositoryUrl) {
        return null;
    } else if (sourceA.repositoryUrl.startsWith("https://github.com")) {
        return (
            <CompareButton
                commitA={sourceA.commitHash}
                commitB={sourceB.commitHash}
                compareUrl={`${sourceA.repositoryUrl}/compare/${sourceA.commitHash}...${sourceB.commitHash}`}
                serviceName="GitHub.com"
            />
        );
    } else if (sourceA.repositoryUrl.startsWith("https://gitlab.com")) {
        return (
            <CompareButton
                commitA={sourceA.commitHash}
                commitB={sourceB.commitHash}
                compareUrl={`${sourceA.repositoryUrl}/-/compare/${sourceA.commitHash}...${sourceB.commitHash}`}
                serviceName="GitLab.com"
            />
        );
    } else {
        throw new Error(
            `Unsupported repository host for comparison: ${sourceA.repositoryUrl}`,
        );
    }
}
