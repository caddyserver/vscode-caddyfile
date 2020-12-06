import { CompletionItemKind } from "vscode-languageserver";

// https://caddyserver.com/docs/caddyfile/options#global-options
export const completions = [
	{
		label: "debug",
		detail: "Enables debug mode, which sets all log levels to debug (unless otherwise specified).",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "http_port",
		detail: "Sets the port the server uses for HTTP.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "https_port",
		detail: "Sets the port the server uses for HTTPS.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "default_sni",
		detail: "Sets a default TLS ServerName for when clients do not use SNI in their ClientHello.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "order",
		detail: "Change the order in which HTTP handler directive(s) will be exeucted.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "experimental_http3",
		detail: "Enable experimental HTTP/3 support.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "storage",
		detail: "Configure Caddy's internal storage mechanism.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "acme_ca",
		detail: "Set the URL used for ACME.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "acme_ca_root",
		detail: "Set a trusted root certificate for ACME that is not in the system trust store.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "acme_eab",
		detail: "Sets an External Account Binding to use for all ACME transactions.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "acme_dns",
		detail: "Configure the DNS challenge to be used for ACME transactions.",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "email",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "admin",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "on_demand_tls",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "local_certs",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "key_type",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "auto_https",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
	{
		label: "cert_issuer",
		detail: "",
		kind: CompletionItemKind.Constant,
		data: 1,
	},
];

interface Descriptions {
	[key: string]: string
}

export const descriptions: Descriptions = {
	"debug": "**debug** enables debug mode, which sets all log levels to debug (unless otherwise specified).",
	"http_port": "**http_port** is the port for the server to use for HTTP. For internal use only; does not change the HTTP port for clients. Default: 80",
	"https_port": "**https_port** is the port for the server to use for HTTPS. For internal use only; does not change the HTTPS port for clients. Default: 443",
	"default_sni": "**default_sni** sets a default TLS ServerName for when clients do not use SNI in their ClientHello.",
	"order": "**order** sets or changes the standard order of HTTP handler directive(s). Can set directives to be `first` or `last`, or `before` or `after` another directive.",
	"experimental_http3": "**experimental_http3** enables experimental draft HTTP/3 support. Note that HTTP/3 is not a finished spec and client support is extremely limited. This option will go away in the future. *This option is not subject to compatibility promises.*",
	"storage": "**storage** configures Caddy's storage mechanism. Default: `file_system`",
	"acme_ca": "**acme_ca** specifies the URL to the ACME CA's directory. It is strongly recommended to set this to Let's Encrypt's [staging endpoint](https://letsencrypt.org/docs/staging-environment/) for testing or development. Default: Let's Encrypt's production endpoint.",
	"acme_ca_root": "**acme_ca_root** specifies a PEM file that contains a trusted root certificate for ACME CA endpoints, if not in the system trust store.",
	"acme_eab": "**acme_eab** specifies an External Account Binding to use for all ACME transactions.",
	"acme_dns": "**acme_dns** configures the DNS challenge to use for all ACME transactions.",
	"email": "**email** is your email address. Mainly used when creating an ACME account with your CA, and is highly recommended in case there are problems with your certificates.",
	"admin": "**admin**",
	"on_demand_tls": "**on_demand_tls**",
	"local_certs": "**local_certs** causes all certificates to be issued internally by default, rather than through a (public) ACME CA such as Let's Encrypt. This is useful in development environments.",
	"key_type": "**key_type** specifies the type of key to generate for TLS certificates; only change this if you have a specific need to customize it.",
	"auto_https": "**auto_https** configure automatic HTTPS. It can either disable it entirely (`off`) or disable only HTTP-to-HTTPS redirects (`disable_redirects`). See the [Automatic HTTPS](https://caddyserver.com/docs/automatic-https) page for more details.",
	"cert_issuer": "**cert_issuer** defines the issuer (or source) of TLS certificates.",
};
