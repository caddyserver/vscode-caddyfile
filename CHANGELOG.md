# Change Log
All notable changes to the `vscode-caddyfile-support` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.1.1] - 2020-12-06
### Fixed
- language-server: fix "Duplicated global option" inspection ([#7](https://github.com/matthewpi/vscode-caddyfile-support/issues/7))

### Changed
- language-server: update global option descriptions and suggestions ([ba726e5](https://github.com/matthewpi/vscode-caddyfile-support/commit/ba726e5324cae28e1ba4ceafa96bdfe1976423ce))

## [v0.1.0] - 2020-12-06
### Added
- Language Server ([#6](https://github.com/matthewpi/vscode-caddyfile-support/pull/6))

## [v0.0.4] - 2020-10-13
### Fixed
- `acme_ca_root` not being highlighted in global options ([26079b4](https://github.com/matthewpi/vscode-caddyfile-support/commit/26079b4753a640db2289f5f8f5ae2ad68a677fc4))
- Paths connected to a domain not being properly highlighted ([#5](https://github.com/matthewpi/vscode-caddyfile-support/issues/5))

## [v0.0.3] - 2020-08-30
### Fixed
- `localhost` not being treated as a domain ([#3](https://github.com/matthewpi/vscode-caddyfile-support/issues/3#issuecomment-678527482))
- Domains not being properly highlighted after matchers ([#4](https://github.com/matthewpi/vscode-caddyfile-support/issues/4))
- `:<PORT>` not being highlighted as a domain ([#4](https://github.com/matthewpi/vscode-caddyfile-support/issues/4))

### Changed
- Format command is now `caddy fmt -` instead of `caddy fmt -stdin` ([ref](https://github.com/caddyserver/caddy/pull/3680#discussion_r475123239))

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
