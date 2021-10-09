import { NextPage } from "next";
import Landing from "^/components/Landing";

export interface IndexProps {}

export interface IndexState {
    isLoading: boolean;
    overrideA: string | null;
    overrideB: string | null;
    diffFiles: string;
}

const IndexPage: NextPage<IndexProps> = () => {
    return <Landing />;
};

export default IndexPage;
