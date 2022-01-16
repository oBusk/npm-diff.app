import DEFAULT_TIMEOUT from "^/lib/default-timeout";
import wait from "^/lib/wait";
import TIMED_OUT from "../TimedOut";
import PackagephobiaResponse from "./PackagephobiaResponse";
import PackagephobiaResults from "./PackagephobiaResult";

async function getPackage(spec: string): Promise<PackagephobiaResponse> {
    const response = await fetch(
        `https://packagephobia.com/v2/api.json?p=${spec}`,
    );
    const json: PackagephobiaResponse = await response.json();
    return json;
}

async function getPackages(
    aSpec: string,
    bSpec: string,
): Promise<PackagephobiaResults | null> {
    const [a, b] = await Promise.all([getPackage(aSpec), getPackage(bSpec)]);

    return (a && b && { a, b }) || null;
}

function timedOut() {
    return wait(DEFAULT_TIMEOUT).then(() => TIMED_OUT);
}

export default async function packagephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<PackagephobiaResults | null | TIMED_OUT> {
    return Promise.race([timedOut(), getPackages(aSpec, bSpec)]);
}
