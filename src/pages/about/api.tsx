import cn from "classnames";
import Layout from "components/Layout";
import { EXAMPLES } from "examples";
import { NextPage } from "next";

const BASE_PATH = "https://package-diff.vercel.app";
const API_PATH = `${BASE_PATH}/api`;
const EXAMPLE_QUERY = EXAMPLES[0];
const EXAMPLE_URL = `${API_PATH}/${EXAMPLE_QUERY}`;

const EXAMPLE_DIFF = `
--- package/LICENSE
+++ package/LICENSE
@@ -1,4 +1,4 @@
-Copyright JS Foundation and other contributors <https://js.foundation/>
+Copyright OpenJS Foundation and other contributors <https://openjsf.org/>

 Based on Underscore.js, copyright Jeremy Ashkenas,
 DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>--- package/_baseClone.js
 `;

const ApiPage: NextPage<null> = () => {
    return (
        <Layout>
            <div className={cn(["shadow-md", "p-8"])}>
                <h2 className={cn(["text-2xl", "font-bold", "mb-5"])}>
                    package-diff API
                </h2>
                <p>
                    There is a very simple API to get the difference between two
                    versions of a package
                </p>

                <div
                    className={cn([
                        "font-mono",
                        "text-sm",
                        "mb-7",
                        "bg-gray-200",
                    ])}
                >
                    GET <a href={EXAMPLE_URL}>{EXAMPLE_URL}</a>
                </div>
                <p>
                    will return a <i>diff</i> of the two provided packages
                </p>
                <pre className={cn(["text-sm", "bg-gray-200"])}>
                    {EXAMPLE_DIFF}
                </pre>
            </div>
        </Layout>
    );
};

export default ApiPage;
