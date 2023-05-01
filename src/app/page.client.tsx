"use client";
import { Stack, useBoolean } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import ExamplesList from "./_page/ExamplesList";
import Intro from "./_page/Intro";
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
        setLoading.on();
    };

    const goToDiff = (a: string | undefined, b: string | undefined): void => {
        setLoading.on();

        router.push(
            `/${a}...${b}?${Object.entries(query)
                .map(([k, v]) => `${k}=${v}`)
                .join("&")}`,
        );
    };

    return (
        <>
            <Intro />
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

export default IndexPageClient;
