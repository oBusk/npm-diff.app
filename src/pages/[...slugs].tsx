import { NextPageContext } from "next";
import * as React from "react";
import { getPkgDetails } from "../util/getPkgDetails";
import { parsePackageString } from "../util/npm-parser";
import { fetchTarBall } from "../util/npm-api";

type Props = {
    output: any;
};

class DiffPage extends React.Component<Props> {
    static getInitialProps = async ({
        query,
    }: NextPageContext): Promise<Props> => {
        const { slugs } = query;

        const { name, versionOrTag } = parsePackageString(
            Array.isArray(slugs) ? slugs[0] : slugs,
        );

        const { version, tarballUrl } = await getPkgDetails(name, versionOrTag);

        const files = await fetchTarBall(tarballUrl);

        return { output: { files, version } };
    };

    render(): JSX.Element {
        const { output } = this.props;
        return <pre>{JSON.stringify(output, null, 4)}</pre>;
    }
}

export default DiffPage;
