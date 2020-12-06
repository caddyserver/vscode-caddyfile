import * as path from "path";
import { languages, workspace, ExtensionContext } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient";

import { CaddyfileDocumentFormattingEditProvider } from "./formatter";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    languages.registerDocumentFormattingEditProvider("caddyfile", new CaddyfileDocumentFormattingEditProvider);

    const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));

    const debugOptions = {
        execArgv: ["--nolazy", "--inspect=6009"],
    };

    const serverOptions: ServerOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc,
        },

        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            {
                scheme: "file",
                language: "caddyfile",
            },
        ],

        synchronize: {
            fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };

    client = new LanguageClient(
        "caddyfileLanguageServer",
        "Caddyfile Language Server",
        serverOptions,
        clientOptions,
    );

    client.start();
};

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }

    return client.stop();
};
