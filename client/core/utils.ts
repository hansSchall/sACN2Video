function splitcomma(joined: string, char: string = ",") {
    new RegExp(`(?<!\\\\)${char}`, "g");
    /(?<!\\),/g;
    return joined.split(new RegExp(`(?<!\\\\)${escapeRegExp(char)}`, "g")).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function joincomma(splitted: string[], char: string = ",") {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").split(char).join("\\" + char)).join(char);
}

function interpolate(rangeStart: number, valueOfRangeStart: number, rangeEnd: number, valueOfRangeEnd: number, val: number) {
    return valueOfRangeStart + (
        (
            (val - rangeStart)
            *
            (valueOfRangeEnd - valueOfRangeStart)
        )
        /
        (rangeEnd - rangeStart)
    )
}

function convertToNumberIfPossible(val: number | string, type: "int" | "float" | ((val: number | string) => number) = "float") {
    if (typeof val == "number")
        return val;
    const converter = typeof type == "function" ? type : (type == "int" ? parseInt : parseFloat);
    const asNum = converter(val as string);
    if (isNaN(asNum)) {
        return val;
    } else {
        return asNum;
    }
}
