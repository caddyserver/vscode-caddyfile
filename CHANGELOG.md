# Change Log
All notable changes to the `vscode-caddyfile-support` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- `localhost` not being treated as a domain ([#3](https://github.com/matthewpi/vscode-caddyfile-support/issues/3#issuecomment-678527482))

## [v0.0.2] - 2020-08-21
### Added
- `caddyfile.executable` configuration option
- Basic support for highlighting [matchers](https://caddyserver.com/docs/caddyfile/concepts#matchers)

### Removed
- `Wedgefile` association. ([#2](https://github.com/matthewpi/vscode-caddyfile-support/pull/2))

### Fixed
- Formatter will no longer overwrite the file with it's previous content. ([#1](https://github.com/matthewpi/vscode-caddyfile-support/issues/1))

### Changed
- Rewrote the entire syntax highlighter ([`caddyfile.tmLanguage.json`](https://github.com/matthewpi/vscode-caddyfile-support/blob/master/syntaxes/caddyfile.tmLanguage.json))

## [v0.0.1] - 2020-08-17
- Initial Release
