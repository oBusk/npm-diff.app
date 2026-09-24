export default function packagephobiaApiUrl(spec: string): string {
    const url = new URL("https://packagephobia.com/v2/api.json");
    url.searchParams.set("p", spec);
    return url.toString();
}
