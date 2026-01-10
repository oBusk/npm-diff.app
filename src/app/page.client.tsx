"use client";

import { useRouter } from "next/navigation";
import { type FunctionComponent, useEffect, useState } from "react";
import { useBoolean } from "react-use";
import Stack from "^/components/ui/Stack";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import ExamplesList from "./_page/ExamplesList";
import MainForm from "./_page/MainForm/MainForm";
import OptionsForm from "./_page/OptionsForm";

export interface LandingProps {
    fallbackSuggestions: AutocompleteSuggestion[];
}

const IndexPageClient: FunctionComponent<LandingProps> = ({
    fallbackSuggestions,
}) => {
    const [overrides, setOverrides] = useState<{
        a: string | null;
        b: string | null;
    }>({
        a: null,
        b: null,
    });
    const [diffFiles, setDiffFiles] = useState(`${DEFAULT_DIFF_FILES_GLOB}`);
    const [isLoading, setLoading] = useBoolean(false);
    const router = useRouter();

    const query = {
        // If the value matches the default, we don't need to send it
        ...(diffFiles.trim() === DEFAULT_DIFF_FILES_GLOB ? {} : { diffFiles }),
    };

    const setInput = (a: string | null, b: string | null) => {
        setOverrides({
            a,
            b,
        });
    };

    const exampleClicked = () => {
        setLoading(true);
    };

    const goToDiff = (a: string | undefined, b: string | undefined): void => {
        setLoading(true);

        router.push(
            `/${a}...${b}?${Object.entries(query)
                .map(([k, v]) => `${k}=${v}`)
                .join("&")}`,
        );
    };

    return (
        <>
            <Stack>
                <MainForm
                    overrideA={overrides.a}
                    overrideB={overrides.b}
                    isLoading={isLoading}
                    handleSubmit={goToDiff}
                    fallbackSuggestions={fallbackSuggestions}
                />
                <OptionsForm files={diffFiles} filesChange={setDiffFiles} />
            </Stack>
            <ExamplesList
                exampleMouseOver={(a, b) => !isLoading && setInput(a, b)}
                exampleMouseOut={() => !isLoading && setInput(null, null)}
                exampleClicked={() => !isLoading && exampleClicked()}
                queryParams={query}
            />
        </>
    );
};

// Wrapper to reset state on unmount
// This is to handle nexjts stupid assumption with cacheComponents
// that all pages are wrapped in <Activity> which maintains state across navigations
// See:
// https://nextjs.org/docs/app/getting-started/cache-components#navigation-uses-activity
// https://github.com/vercel/next.js/discussions/85502
// https://github.com/vercel/next.js/issues/86577
const IndexPageClientWrapper: FunctionComponent<LandingProps> = ({
    fallbackSuggestions,
}) => {
    const [key, setKey] = useState(0);

    useEffect(() => {
        return function onUnmount() {
            setKey((prev) => prev + 1);
        };
    }, []);

    return (
        <IndexPageClient fallbackSuggestions={fallbackSuggestions} key={key} />
    );
};

export default IndexPageClientWrapper;
