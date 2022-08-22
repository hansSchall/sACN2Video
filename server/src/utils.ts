export function splitcomma(joined: string, char: string = ",") {
    new RegExp(`(?<!\\\\)${char}`, "g");
    /(?<!\\),/g;
    return joined.split(new RegExp(`(?<!\\\\)${escapeRegExp(char)}`, "g")).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

export function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function joincomma(splitted: string[], char: string = ",") {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").split(char).join("\\" + char)).join(char);
}