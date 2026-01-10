"use client";

import { usePathname, useRouter } from "next/navigation";
import { type FunctionComponent, useEffect, useRef, useState } from "react";
import { useBoolean } from "react-use";
import Stack from "^/components/ui/Stack";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import ExamplesList from "./_page/ExamplesList";
import MainForm, { type MainFormRef } from "./_page/MainForm/MainForm";
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
    const pathname = usePathname();
    const mainFormRef = useRef<MainFormRef>(null);

    // Reset whenever this route becomes active (including back/forward).
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOverrides({ a: null, b: null });
        setDiffFiles(`${DEFAULT_DIFF_FILES_GLOB}`);
        setLoading(false);

        mainFormRef.current?.focusNext();
    }, [pathname, setOverrides, setDiffFiles, setLoading, mainFormRef]);

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
                    ref={mainFormRef}
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

export default IndexPageClient;
