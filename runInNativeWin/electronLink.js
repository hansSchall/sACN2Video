"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableEditorSplitscreen = exports.electron = void 0;
const electron_1 = __importDefault(require("electron"));
exports.electron = electron_1.default;
var run_js_1 = require("./run.js");
Object.defineProperty(exports, "enableEditorSplitscreen", { enumerable: true, get: function () { return run_js_1.enableEditorSplitscreen; } });
