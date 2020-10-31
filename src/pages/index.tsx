import cn from "classnames";
import Layout from "components/Layout";
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
                <form
                    className={cn(
                        "flex flex-row",
                        "flex-1",
                        "justify-center",
                        "items-center",
                    )}
                    onSubmit={this.handleSubmit}
                >
                    <input
                        className={cn([
                            "rounded",
                            "px-4",
                            "h-10",
                            "w-64",
                            "border",
                            "border-solid",
                            "border-gray-200",
                        ])}
                        type="text"
                        name="a"
                        placeholder="package@version"
                        ref={this.a}
                    ></input>
                    <input
                        className={cn([
                            "rounded",
                            "px-4",
                            "h-10",
                            "w-64",
                            "border",
                            "border-solid",
                            "border-gray-200",
                        ])}
                        type="text"
                        name="b"
                        placeholder="version or package@version"
                        ref={this.b}
                    ></input>
                    <button
                        className={cn([
                            "flex",
                            "h-10",
                            "px-4",
                            "items-center",
                            "whitespace-no-wrap",
                            "bg-gray-200",
                            "hover:bg-gray-300",
                            "font-semibold",
                            "rounded",
                        ])}
                        type="submit"
                    >
                        Package Diff! 📦🔃
                    </button>
                </form>
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

export default IndexPage;
