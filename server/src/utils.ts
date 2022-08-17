export function splitcomma(joined: string) {
    return joined.split(/(?<!\\),/g).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

export function joincomma(splitted: string[]) {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").replace(/,/g, "\\,")).join(",");
}