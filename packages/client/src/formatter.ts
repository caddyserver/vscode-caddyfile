import { ChildProcess, spawn } from 'node:child_process';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { treeKill } from 'tree-kill';

export class CaddyfileDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
	public provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		_: vscode.FormattingOptions,
		token: vscode.CancellationToken,
	): vscode.ProviderResult<vscode.TextEdit[]> {
		if (vscode.window.visibleTextEditors.every(e => e.document.fileName !== document.fileName)) {
			return [];
		}

		return this.runFormatter(document, token).then(
			edits => edits,
			err => {
				if (err) {
					console.log(err);
					return Promise.reject('Check the console in dev tools to find errors when formatting.');
				}

				return;
			},
		);
	}

	private runFormatter(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
		const executablePath = vscode.workspace.getConfiguration('caddyfile').get<string>('executable');

		return new Promise<vscode.TextEdit[]>((resolve, reject) => {
			let executable: string;
			if (executablePath !== undefined && executablePath !== null && executablePath !== '') {
				if (!path.isAbsolute(executablePath)) {
					vscode.window.showInformationMessage('Invalid executable path for caddy.');
					return reject();
				}

				executable = executablePath;
			} else {
				executable = 'caddy';
			}

			const cwd = path.dirname(document.fileName);
			let stdout = '';
			let stderr = '';

			// Use spawn instead of exec to avoid maxBufferExceeded error
			const p = spawn(executable, ['fmt', '-'], { cwd });
			token.onCancellationRequested(() => !p.killed && killProcessTree(p));

			p.stdout.setEncoding('utf8');
			p.stdout.on('data', data => (stdout += data));
			p.stderr.on('data', data => (stderr += data));

			p.on('error', err => {
				if (err && (<any>err).code === 'ENOENT') {
					vscode.window.showInformationMessage('Caddy was not found in your $PATH');
					return reject();
				}
			});

			p.on('close', code => {
				if (code !== 0) {
					return reject(stderr);
				}

				// Return the complete file content in the edit.
				// VS Code will calculate minimal edits to be applied
				const fileStart = new vscode.Position(0, 0);
				const fileEnd = document.lineAt(document.lineCount - 1).range.end;
				const textEdits: vscode.TextEdit[] = [
					new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout),
				];

				return resolve(textEdits);
			});

			if (p.pid) {
				p.stdin.end(document.getText());
			}
		});
	}
}

export function killProcessTree(p: ChildProcess, logger?: (...args: any[]) => void): Promise<void> {
	if (!logger) {
		logger = console.log;
	}

	const pid = p.pid;
	if (pid === undefined || p.exitCode !== null) {
		return Promise.resolve();
	}

	return new Promise(resolve => {
		treeKill(pid, undefined, err => {
			if (err) {
				logger?.(`Error killing process ${p.pid}: ${err}`);
			}

			return resolve();
		});
	});
}
