import { Stack } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import ExamplesList from "components/ExamplesList";
import Intro from "components/Intro";
import Layout from "components/Layout";
import MainForm from "components/MainForm";
import OptionsForm from "components/OptionsForm";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export interface IndexProps {}

export interface IndexState {
    isLoading: boolean;
    overrideA: string | null;
    overrideB: string | null;
    diffFiles: string;
}

const IndexPage: NextPage<IndexProps> = () => {
    const [state, setState] = useState<IndexState>({
        overrideA: null,
        overrideB: null,
        isLoading: false,
        diffFiles: "**/!(*.map|*.min.js)",
    });
    const router = useRouter();

    const setInput = (a: string | null, b: string | null) => {
        setState({
            ...state,
            overrideA: a,
            overrideB: b,
        });
    };

    const exampleClicked = () => {
        setState({
            ...state,
            isLoading: true,
        });
    };

    const goToDiff = (a: string | undefined, b: string | undefined): void => {
        setState({
            ...state,
            isLoading: true,
        });

        router.push({
            pathname: `/${a}...${b}`,
            query: {
                diffFiles: state.diffFiles,
            },
        });
    };

    return (
        <Layout>
            <Intro as={Stack} />
            <Stack>
                <MainForm
                    overrideA={state.overrideA}
                    overrideB={state.overrideB}
                    isLoading={state.isLoading}
                    handleSubmit={goToDiff}
                />
                <OptionsForm
                    files={state.diffFiles}
                    filesChange={(files) =>
                        setState({ ...state, diffFiles: files })
                    }
                />
            </Stack>
            <ExamplesList
                exampleMouseOver={(a, b) => setInput(a, b)}
                exampleMouseOut={() => setInput(null, null)}
                exampleClicked={exampleClicked}
                queryParams={{
                    diffFiles: state.diffFiles,
                }}
            />
        </Layout>
    );
};

export default withTheme(IndexPage);
