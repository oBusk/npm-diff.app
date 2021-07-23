import parseString from "./parseString";

function parseBoolean(str: undefined | string | string[]): undefined | boolean {
    str = parseString(str);

    if (str == null) {
        return undefined;
    } else if (
        // 0, 00, 000 etc.
        parseInt(str) == 0 ||
        str.toLowerCase() == "no" ||
        str.toLowerCase() == "false"
    ) {
        return false;
    } else {
        // 1, 2, yes, true, '' etc.
        return true;
    }
}

export default parseBoolean;
