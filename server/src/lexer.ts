import { Position, TextDocumentPositionParams } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

function hasGlobalOptions(document: TextDocument): boolean {
	if (document.lineCount < 2) {
		return false;
	}

	const text = document.getText({
		start: { line: 0, character: 0 },
		end: { line: 1, character: 0 },
	});

	return text === "{\n";
};

interface Range {
	start: Position;
	end: Position;
};

export function getGlobalOptionsPosition(document: TextDocument): Range|null {
	// Start at line 1 and work towards the end of the file, we are trying to find the
	// first `}\n` that closes the global options block.
	for (let i = 1; i < document.lineCount; i++) {
		const text = document.getText({
			start: { line: i, character: 0 },
			end: { line: i + 1, character: 0 },
		});

		if (text !== "}\n") {
			continue;
		}

		return {
			start: { line: 0, character: 0 },
			end: { line: i, character: 0 },
		};
	}

	return null;
}

export function isInGlobalOptions(document: TextDocument, params: TextDocumentPositionParams): boolean {
	// Check if the document has a global options block.
	if (!hasGlobalOptions(document)) {
		return false;
	}

	const globalOptions = getGlobalOptionsPosition(document);
	if (globalOptions === null) {
		return false;
	}

	return params.position.line > globalOptions.start.line
		&& params.position.line < globalOptions.end.line;
};
