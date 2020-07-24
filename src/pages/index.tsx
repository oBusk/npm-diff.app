import { Button, Input } from "@chakra-ui/core";
import Hero from "components/Hero";
import Layout from "components/Layout";
import { withTheme } from "emotion-theming";
import router from "next/router";
import { Component } from "react";

class IndexPage extends Component {
    render(): JSX.Element {
        return (
            <Layout>
                <Hero as="form" onSubmit={this.handleSubmit}>
                    <Input
                        type="text"
                        name="a"
                        placeholder="package@version"
                    ></Input>
                    <Input
                        type="text"
                        name="b"
                        placeholder="version or package@version"
                    ></Input>
                    <Button width="400px" type="submit">
                        Package Diff! 📦🔃
                    </Button>
                </Hero>
            </Layout>
        );
    }

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
