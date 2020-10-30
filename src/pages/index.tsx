import { Button, Input } from "@chakra-ui/core";
import Hero from "components/Hero";
import Layout from "components/Layout";
import { withTheme } from "emotion-theming";
import { EXAMPLES } from "examples";
import Link from "next/link";
import router from "next/router";
import { Component, createRef, RefObject } from "react";

class IndexPage extends Component {
    a: RefObject<HTMLInputElement>;
    b: RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this.a = createRef();
        this.b = createRef();
    }

    render(): JSX.Element {
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
                        placeholder="package@version"
                        ref={this.a}
                    ></Input>
                    <Input
                        type="text"
                        name="b"
                        placeholder="version or package@version"
                        ref={this.b}
                    ></Input>
                    <Button width="400px" type="submit">
                        Package Diff! 📦🔃
                    </Button>
                </Hero>
            </Layout>
        );
    }

    private clickedExample = (ex: string) => {
        const [a, b] = ex.split("...");
        this.a.current.value = a;
        this.b.current.value = b;
    };

    private handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            // Defined named children
            a: HTMLInputElement;
            b: HTMLInputElement;
        };
        const a = target.a.value;
        const b = target.b.value;

        void router.push(`/${a}...${b}`);
    };
}

export default withTheme(IndexPage);
