import { Button, Input } from "@chakra-ui/core";
import Hero from "components/Hero";
import Layout from "components/Layout";
import { withTheme } from "emotion-theming";
import router from "next/router";
import { Component } from "react";

class IndexPage extends Component<{}> {
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

    private handleSubmit = (event: any): void => {
        event.preventDefault();
        const a = event.target.a.value;
        const b = event.target.b.value;
        router.push(`/${a}...${b}`);
    };
}

export default withTheme(IndexPage);
