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
    aValue: string;
    bValue: string;
}

class IndexPage extends Component<IndexProps, IndexState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            aValue: "",
            bValue: "",
            isLoading: false,
        };
    }

    render() {
        return (
            <Layout>
                {EXAMPLES.map((ex) => (
                    <Link key={ex} href={`/${ex}`}>
                        <a onClick={() => this.clickedExample(ex)}>{ex}</a>
                    </Link>
                ))}
                <MainForm
                    aValue={this.state.aValue}
                    bValue={this.state.bValue}
                    isLoading={this.state.isLoading}
                    handleSubmit={this.goToDiff}
                />
            </Layout>
        );
    }

    private clickedExample = (ex: string) => {
        const [a, b] = ex.split("...");

        this.setState({
            aValue: a,
            bValue: b,
        });

        this.goToDiff(a, b);
    };

    private goToDiff = (a: string | undefined, b: string | undefined): void => {
        this.setState({ isLoading: true });

        void router.push(`/${a}...${b}`);
    };
}

export default withTheme(IndexPage);
