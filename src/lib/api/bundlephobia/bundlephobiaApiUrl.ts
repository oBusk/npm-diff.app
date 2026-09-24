export default function bundlephobiaApiUrl(spec: string): string {
    const url = new URL("https://bundlephobia.com/api/size");
    url.searchParams.set("package", spec);
    return url.toString();
}
