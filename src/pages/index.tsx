import { Flex, FlexProps } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import ExamplesList from "components/ExamplesList";
import Intro from "components/Intro";
import Layout from "components/Layout";
import MainForm from "components/MainForm";
import OptionsForm from "components/OptionsForm";
import router from "next/router";
import { Component, FunctionComponent } from "react";

export interface IndexProps {}

export interface IndexState {
    isLoading: boolean;
    overrideA: string | null;
    overrideB: string | null;
    diffFiles: string;
}

/** To unify main styles of top/bottom half of the page */
const HalfSegment: FunctionComponent<FlexProps> = ({ children, ...props }) => (
    <Flex flex="1 0 0px" direction="column" overflow="hidden" {...props}>
        {children}
    </Flex>
);

class IndexPage extends Component<IndexProps, IndexState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            overrideA: null,
            overrideB: null,
            isLoading: false,
            diffFiles: "**/!(*.map|*.min.js)",
        };
    }

    render() {
        return (
            <Layout>
                <HalfSegment>
                    {/* Top half */}
                    <Intro />
                </HalfSegment>
                {/* Center segment */}
                <MainForm
                    overrideA={this.state.overrideA}
                    overrideB={this.state.overrideB}
                    isLoading={this.state.isLoading}
                    handleSubmit={this.goToDiff}
                />
                <HalfSegment justifyContent="space-between">
                    {/* Bottom half */}
                    <OptionsForm
                        overflow="auto"
                        files={this.state.diffFiles}
                        filesChange={(files) =>
                            this.setState({ diffFiles: files })
                        }
                    />
                    <ExamplesList
                        exampleMouseOver={(a, b) => this.setInput(a, b)}
                        exampleMouseOut={() => this.setInput(null, null)}
                        exampleClicked={this.exampleClicked}
                        queryParams={{
                            diffFiles: this.state.diffFiles,
                        }}
                    />
                </HalfSegment>
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

        router.push({
            pathname: `/${a}...${b}`,
            query: {
                diffFiles: this.state.diffFiles,
            },
        });
    };
}

export default withTheme(IndexPage);
