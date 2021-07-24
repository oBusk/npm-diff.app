import { Button, Input } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import Hero from "components/Hero";
import Layout from "components/Layout";
import EXAMPLES from "lib/examples";
import Link from "next/link";
import router from "next/router";
import { Component, createRef, FormEvent, RefObject } from "react";

export interface IndexProps {}

export interface IndexState {
    isLoading: boolean;
}

class IndexPage extends Component<IndexProps, IndexState> {
    a: RefObject<HTMLInputElement>;
    b: RefObject<HTMLInputElement>;

    constructor(props: {}) {
        super(props);
        this.a = createRef();
        this.b = createRef();

        this.state = {
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
                <Hero as="form" onSubmit={this.handleSubmit}>
                    <Input
                        type="text"
                        name="a"
                        placeholder="package@1.2.3, package@^1, package@2.X"
                        disabled={this.state.isLoading}
                        ref={this.a}
                    ></Input>
                    <Input
                        type="text"
                        name="b"
                        placeholder="^3.0.1, ~1.0.0, package-b@~3.0.0"
                        disabled={this.state.isLoading}
                        ref={this.b}
                    ></Input>
                    <Button
                        isLoading={this.state.isLoading}
                        width="400px"
                        type="submit"
                    >
                        npm diff! 📦🔃
                    </Button>
                </Hero>
            </Layout>
        );
    }

    private clickedExample = (ex: string) => {
        const [a, b] = ex.split("...");

        if (!this.a.current || !this.b.current) {
            throw new Error("No input elements");
        }

        this.a.current.value = a ?? "";
        this.b.current.value = b ?? "";

        this.setState({ isLoading: true });
    };

    private handleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            // Defined named children
            a: HTMLInputElement;
            b: HTMLInputElement;
        };
        const a = target.a.value;
        const b = target.b.value;

        this.setState({ isLoading: true });

        void router.push(`/${a}...${b}`);
    };
}

export default withTheme(IndexPage);
