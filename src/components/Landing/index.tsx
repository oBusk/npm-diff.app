import { Stack } from "@chakra-ui/react";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import ExamplesList from "./ExamplesList";
import Intro from "./Intro";
import MainForm from "./MainForm";
import OptionsForm from "./OptionsForm";

export interface LandingProps {}

export interface LandingState {
    isLoading: boolean;
    overrideA: string | null;
    overrideB: string | null;
    diffFiles: string;
}

const Landing: FunctionComponent<LandingProps> = () => {
    const [state, setState] = useState<LandingState>({
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

export default Landing;
