import { Stack, useBoolean } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import Layout from "^/components/Layout";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import ExamplesList from "./ExamplesList";
import Intro from "./Intro";
import MainForm from "./MainForm";
import OptionsForm from "./OptionsForm";

export interface LandingProps {}

const Landing: FunctionComponent<LandingProps> = () => {
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

        router.push({
            pathname: `/${a}...${b}`,
            query,
        });
    };

    return (
        <Layout>
            <Intro as={Stack} />
            <Stack>
                <MainForm
                    overrideA={overrides.a}
                    overrideB={overrides.b}
                    isLoading={isLoading}
                    handleSubmit={goToDiff}
                />
                <OptionsForm files={diffFiles} filesChange={setDiffFiles} />
            </Stack>
            <ExamplesList
                exampleMouseOver={(a, b) => setInput(a, b)}
                exampleMouseOut={() => setInput(null, null)}
                exampleClicked={exampleClicked}
                queryParams={query}
            />
        </Layout>
    );
};

export default Landing;
