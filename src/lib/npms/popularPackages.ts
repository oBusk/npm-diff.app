import search from "./search";

export default function popularPackages() {
    return search("not:deprecated");
}
