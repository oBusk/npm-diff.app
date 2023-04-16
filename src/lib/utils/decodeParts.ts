export default function decodeParts(parts: string | string[] | undefined) {
    return parts == null
        ? parts
        : Array.isArray(parts)
        ? parts.map(decodeURIComponent)
        : decodeURIComponent(parts);
}
