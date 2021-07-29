import { Box, Flex } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import ExamplesList from "components/ExamplesList";
import Intro from "components/Intro";
import Layout from "components/Layout";
import MainForm from "components/MainForm";
import router from "next/router";
import { Component } from "react";

export interface IndexProps {}

export interface IndexState {
    isLoading: boolean;
    overrideA: string | null;
    overrideB: string | null;
}

class IndexPage extends Component<IndexProps, IndexState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            overrideA: null,
            overrideB: null,
            isLoading: false,
        };
    }

    render() {
        return (
            <Layout>
                <Box flex={1}>
                    {/* Top half */}
                    <Intro />
                </Box>
                {/* Center segment */}
                <MainForm
                    overrideA={this.state.overrideA}
                    overrideB={this.state.overrideB}
                    isLoading={this.state.isLoading}
                    handleSubmit={this.goToDiff}
                    flex={0}
                />
                <Flex flex={1} direction="column" justifyContent="flex-end">
                    {/* Bottom half */}
                    <ExamplesList
                        exampleMouseOver={(a, b) => this.setInput(a, b)}
                        exampleMouseOut={() => this.setInput(null, null)}
                        exampleClicked={this.exampleClicked}
                    />
                </Flex>
            </Layout>
        );
    }

    private setInput = (a: string | null, b: string | null) => {
        this.setState({
            overrideA: a,
            overrideB: b,
        });
    };

    private exampleClicked = () => {
        this.setState({
            isLoading: true,
        });
    };

    private goToDiff = (a: string | undefined, b: string | undefined): void => {
        this.setState({ isLoading: true });

        void router.push(`/${a}...${b}`);
    };
}

export default withTheme(IndexPage);
