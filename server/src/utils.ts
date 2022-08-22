export function splitcomma(joined: string, char: string = ",") {
    return joined.split(new RegExp(`(?<!\\\\)${escapeRegExp(char)}`, "g")).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

export function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function joincomma(splitted: string[], char: string = ",") {
    return splitted.filter(_ => typeof _ == "string").map(_ => _.replace(/\\/g, "\\\\").split(char).join("\\" + char)).join(char);
}