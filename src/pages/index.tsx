import router from "next/router";
import { Component } from "react";
import Layout from "components/Layout";

class IndexPage extends Component<{}> {
    render(): JSX.Element {
        return (
            <Layout>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="a"
                        placeholder="package@version"
                    ></input>
                    <input
                        type="text"
                        name="b"
                        placeholder="version or package@version"
                    ></input>
                    <input type="submit" value="Package Diff! 📦🔃" />
                </form>
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

export default IndexPage;
