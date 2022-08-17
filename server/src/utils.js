"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joincomma = exports.splitcomma = void 0;
function splitcomma(joined) {
    return joined.split(/(?<!\\),/g).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"));
}
exports.splitcomma = splitcomma;
function joincomma(splitted) {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").replace(/,/g, "\\,")).join(",");
}
exports.joincomma = joincomma;
