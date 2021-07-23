import parseString from "./parse-string";

function parseNumber(str: undefined | string | string[]): undefined | number {
    str = parseString(str);

    if (str == null || str.length === 0) {
        return undefined;
    }

    return parseInt(str);
}

export default parseNumber;
