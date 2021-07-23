function parseString(str: undefined | string | string[]): undefined | string {
    // If the param is multiple times, we take last value. Assumption is user
    // threw it on the end.
    if (Array.isArray(str)) {
        return str.filter((t) => t != null).pop();
    } else {
        return str;
    }
}

export default parseString;
