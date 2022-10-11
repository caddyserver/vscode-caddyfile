import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Hover,
	MarkupKind,
	TextDocumentChangeEvent,
	DidChangeWatchedFilesParams,
	HoverParams,
	DidChangeConfigurationParams,
	Range,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { descriptions as directiveDescriptions } from './directives';
import { completions as globalOptionCompletions, descriptions as globalOptionDescriptions } from './globalOptions';
import { getGlobalOptionsPosition, isInGlobalOptions } from './lexer';

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
	hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,

			completionProvider: {
				resolveProvider: true,
			},

			hoverProvider: true,
		},
	};

	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
			},
		};
	}

	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}

	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

interface ExampleSettings {
	maxNumberOfProblems: number;
}

const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration((change: DidChangeConfigurationParams) => {
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(change.settings.languageServerExample || defaultSettings);
	}

	documents.all().forEach(validateTextDocument);
});

documents.onDidClose((e: TextDocumentChangeEvent<TextDocument>) => {
	documentSettings.delete(e.document.uri);
});

documents.onDidChangeContent((change: TextDocumentChangeEvent<TextDocument>) => {
	validateTextDocument(change.document);
});

interface Option {
	name: string;
	range: Range;
}

async function validateTextDocument(document: TextDocument): Promise<void> {
	const diagnostics: Diagnostic[] = [];

	const globalOptionsPosition = getGlobalOptionsPosition(document);
	if (globalOptionsPosition !== null) {
		const options: Option[] = [];

		for (let i = globalOptionsPosition.start.line + 1; i < globalOptionsPosition.end.line; i++) {
			const line = document.getText({ start: { line: i, character: 0 }, end: { line: i + 1, character: 0 } });
			const trimmed = line.trim();
			let option: string;

			if (trimmed.includes(' ')) {
				const sections = trimmed.split(' ');
				option = sections[0];
			} else {
				option = trimmed;
			}

			if (option === '') {
				return;
			}

			const start = line.indexOf(trimmed.charAt(0));

			options.push({
				name: option,

				range: {
					start: { line: i, character: start },
					end: { line: i, character: start + option.length },
				},
			});
		}

		// Fancy way of only getting duplicate directives.
		// const map = new Map();
		// options.forEach(a => map.set(a.name, (map.get(a.name) || 0) + 1));
		// options
		// 	.filter(a => map.get(a.name) > 1)
		// 	.forEach((a: Option) => {
		// 		// servers is the only option that would require having duplicates.
		// 		if (a.name === 'servers') {
		// 			return;
		// 		}

		// 		diagnostics.push({
		// 			severity: DiagnosticSeverity.Warning,
		// 			range: a.range,
		// 			message: `Duplicate global option "${a.name}"`,
		// 			source: 'caddyfile',
		// 		});
		// 	});

		// Janky way of checking for any other global option blocks.
		let start: number = 0;
		for (let i = globalOptionsPosition.end.line + 1; i < document.lineCount; i++) {
			const line = document.getText({
				start: { line: i, character: 0 },
				end: { line: i + 1, character: 0 },
			});

			if (line === '{\n') {
				start = i;
				continue;
			}

			if (start === 0 || line !== '}\n') {
				continue;
			}

			diagnostics.push({
				severity: DiagnosticSeverity.Error,
				message: 'Only one global option block is allowed.',
				source: 'caddyfile',

				range: {
					start: { line: start, character: 0 },
					end: { line: i + 1, character: 0 },
				},
			});
			start = 0;
		}
	}

	connection.sendDiagnostics({
		uri: document.uri,
		diagnostics: diagnostics,
	});
}

connection.onDidChangeWatchedFiles((_: DidChangeWatchedFilesParams) => {
	connection.console.log('We received an file change event');
});

connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
	const document = documents.get(params.textDocument.uri);
	if (document === undefined) {
		return [];
	}

	if (isInGlobalOptions(document, params)) {
		return globalOptionCompletions;
	}

	return [];
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return item;
});

connection.onHover((params: HoverParams): Hover | null => {
	const document = documents.get(params.textDocument.uri);
	if (document === undefined) {
		return null;
	}

	if (isInGlobalOptions(document, params)) {
		const line = document
			.getText({
				start: { line: params.position.line, character: 0 },
				end: { line: params.position.line + 1, character: 0 },
			})
			.trim();

		let option: string;
		if (line.includes(' ')) {
			const sections = line.split(' ');
			option = sections[0];
		} else {
			option = line;
		}

		const description = globalOptionDescriptions[option];
		if (description === undefined) {
			return null;
		}

		return {
			contents: {
				kind: MarkupKind.Markdown,
				value: description,
			},
		};
	}

	const line = document
		.getText({
			start: { line: params.position.line, character: 0 },
			end: { line: params.position.line + 1, character: 0 },
		})
		.trim();

	let directive: string;
	if (line.includes(' ')) {
		const sections = line.split(' ');
		directive = sections[0];
	} else {
		directive = line;
	}

	const description = directiveDescriptions[directive];
	if (description === undefined) {
		return null;
	}

	return {
		contents: {
			kind: MarkupKind.Markdown,
			value: description,
		},
	};
});

documents.listen(connection);

connection.listen();
