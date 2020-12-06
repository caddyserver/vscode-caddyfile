# Caddyfile Support
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/matthewpi.caddyfile-support?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=matthewpi.caddyfile-support)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/matthewpi.caddyfile-support?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=matthewpi.caddyfile-support)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/matthewpi.caddyfile-support?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=matthewpi.caddyfile-support)

Adds support for [`Caddyfile`](https://caddyserver.com/docs/caddyfile/concepts) syntax highlighting and automatic formatting.

This is essentially an updated version of [`vscode-caddyfile-syntax`](https://github.com/Zamerick/vscode-caddyfile-syntax) with additional features.

## Configuration
- `caddyfile.executable`: Location of the `caddy` executable to use for code formatting and linting. (Default: `""`)

## Features
- Syntax Highlighting
- Automatic Formatting (supports Format on Save)
- Support for Caddyfile v2
- Basic Language Server with suggestions and descriptions

## Requirements
- [caddy v2.2.0](https://github.com/caddyserver/caddy/releases/tag/v2.2.0) or [later](https://github.com/caddyserver/caddy/releases/latest) (required for Automatic Formatting)

## Known Issues
- None

## Changelog
See [CHANGELOG.md](https://github.com/matthewpi/vscode-caddyfile-support/blob/master/CHANGELOG.md)
