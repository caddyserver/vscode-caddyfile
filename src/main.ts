import vscode = require("vscode");

import { CaddyfileDocumentFormattingEditProvider } from "./formatter";

export function activate(ctx: vscode.ExtensionContext) {
    vscode.languages.registerDocumentFormattingEditProvider("caddyfile", new CaddyfileDocumentFormattingEditProvider);
};
