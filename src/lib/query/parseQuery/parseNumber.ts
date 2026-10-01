import parseString from "./parseString";

function parseNumber(str: undefined | string | string[]): undefined | number {
    str = parseString(str);

    if (str == null || str.length === 0) {
        return undefined;
    }

    return /^-?\d+$/.test(str) ? Number(str) : NaN;
}

export default parseNumber;
