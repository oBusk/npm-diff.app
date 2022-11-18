const decodePartts = (parts: string | string[] | undefined) =>
    parts == null
        ? parts
        : Array.isArray(parts)
        ? parts.map(decodeURIComponent)
        : decodeURIComponent(parts);

export default decodePartts;
