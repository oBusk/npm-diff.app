import { Heading, Code, Text } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import Layout from "components/Layout";
import MainForm from "components/MainForm";
import EXAMPLES from "lib/examples";
import Link from "next/link";
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
                <Text align="center">
                    <a
                        href="https://docs.npmjs.com/cli/v7/commands/npm-diff"
                        rel="noopener noreferrer"
                    >
                        <Code>npm diff</Code>
                    </a>{" "}
                    online!
                    <br />
                    Web tool to compare versions, or branches, of NPM packages.
                </Text>
                <MainForm
                    overrideA={this.state.overrideA}
                    overrideB={this.state.overrideB}
                    isLoading={this.state.isLoading}
                    handleSubmit={this.goToDiff}
                />
                <Heading color="gray.300" size="md">
                    Examples
                </Heading>
                {EXAMPLES.map((ex) => (
                    <Link key={ex} href={`/${ex}`}>
                        <a
                            onMouseOver={() => this.exampleMouseOver(ex)}
                            onMouseOut={() => this.exampleMouseOut()}
                            onClick={() => this.exampleClicked()}
                        >
                            {ex}
                        </a>
                    </Link>
                ))}
            </Layout>
        );
    }

    private exampleMouseOver = (ex: string) => {
        const [a, b] = ex.split("...");

        this.setState({
            overrideA: a,
            overrideB: b,
        });
    };

    private exampleMouseOut = () => {
        this.setState({
            overrideA: null,
            overrideB: null,
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
