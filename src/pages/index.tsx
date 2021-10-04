import Landing from "_/components/Landing";
import { NextPage } from "next";

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
