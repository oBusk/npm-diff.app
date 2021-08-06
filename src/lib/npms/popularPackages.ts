import search from "./search";

export default function popularPackages(size: number) {
    return search("not:deprecated", size);
}
