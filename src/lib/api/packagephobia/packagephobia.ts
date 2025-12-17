import { USER_AGENT } from "../user-agent";
import type PackagephobiaResponse from "./PackagephobiaResponse";
import type PackagephobiaResults from "./PackagephobiaResult";

async function getPackage(spec: string): Promise<PackagephobiaResponse | null> {
    const requestHeaders = {
        "User-Agent": USER_AGENT,
    };

    let response: Response | undefined;

    try {
        response = await fetch(
            `https://packagephobia.com/v2/api.json?p=${spec}`,
            {
                signal: AbortSignal.timeout(7_500),
                headers: requestHeaders,
            },
        );

        if (response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const json: PackagephobiaResponse = await response.json();

        return json;
    } catch (e) {
        const echoResponse = await fetch("https://postman-echo.com/get", {
            signal: AbortSignal.timeout(7_500),
            headers: {
                "User-Agent": USER_AGENT,
                "X-Debug-User-Agent": USER_AGENT, // add a second header for comparison
            },
        });

        console.error(`[${spec}] Packagephobia error:`, {
            error: e,
            ["Request Headers"]: requestHeaders,
            ["Response Status"]: response?.status,
            ["Response Status Text"]: response?.statusText,
            ["Response Headers"]: response?.headers
                ? Object.fromEntries(response.headers.entries())
                : undefined,
            ["Echo Response"]: echoResponse.ok
                ? await echoResponse.json()
                : `Failed to fetch echo response: ${echoResponse.status} ${echoResponse.statusText}`,
        });
    }

    return null;
}

async function getPackages(
    aSpec: string,
    bSpec: string,
): Promise<PackagephobiaResults | null> {
    const [a, b] = await Promise.all([getPackage(aSpec), getPackage(bSpec)]);

    return (a && b && { a, b }) || null;
}

export default async function packagephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<PackagephobiaResults | null> {
    return getPackages(aSpec, bSpec);
}
