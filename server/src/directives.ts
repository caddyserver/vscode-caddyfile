interface Descriptions {
	[key: string]: string;
}

export const descriptions: Descriptions = {
	// https://caddyserver.com/docs/caddyfile/directives/root
	root: `Sets the root path of the site, used by various matchers and directives that access the file system.  If unset, the default site root is the current working directory.

Specifically, this directive sets the \`{http.vars.root}\` placeholder.  It is mutually exclusive to other \`root\` directives in the same block, so it is safe to define multiple roots with matchers that intersect: they will not cascade and overwrite each other.

This directive does not automatically enable serving static files, so it is often used in conjunction with the [\`file_server\` directive](https://caddyserver.com/docs/caddyfile/directives/file_server) or the [\`php_fastcgi\` directive](https://caddyserver.com/docs/caddyfile/directives/php_fastcgi).

---

\`\`\`caddyfile
root [<matcher>] <path>
\`\`\`

- **&lt;path&gt;** is the path to use for the site root.

Note that the \`<path>\` argument could be confused by the parser as a [matcher token](https://caddyserver.com/docs/caddyfile/matchers#syntax) if the it begins with \`/\`.  To disambiguate, specify a wildcard matcher token (\`*\`).  See examples below.`,

	// https://caddyserver.com/docs/caddyfile/directives/header
	header: `Manipulates HTTP header fields on the response.  It can set, add, and delete header values, or perform replacements using regular expressions.

By default, header operations are performed immediately unless any of the headers are being deleted, in which case the header operations are automatically deferred until the time they are being written to the client.

---

\`\`\`caddyfile
header [<matcher>] [[+|-]<field> [<value>|<find>] [<replace>]] {
	<field> <find> <replace>
	[+]<field> <value>
	-<field>
	[defer]
}
\`\`\`

- **&lt;field&gt;** is the name of the header field.  By default, will overwrite any existing field of the same name.  Prefix with \`+\` to add the field instead of replace, or prefix with \`-\` to remove the field.
- **&lt;value&gt;** is the header field value, if adding or setting a field.
- **&lt;default_value&gt;** is the header field value that will be set only if the header does not already exist.
- **&lt;find&gt;** is the substring or regular expression to search for.
- **&lt;replace&gt;** is the replacement value; required if performing a search-and-replace.
- **defer** will force the header operations to be deferred until the response is written out to the client.  This is automatically enabled if any of the header fields are being deleted.

For multiple header manipulations, you can open a block and specify one manipulation per line in the same way.`,

	// https://caddyserver.com/docs/caddyfile/directives/redir
	redir: `Issues an HTTP redirect to the client.

This directive implies that a matched request is to be rejected.  It is ordered very early in the handler chain (before [\`rewrite\`](https://caddyserver.com/docs/caddyfile/directives/rewrite)).

---

\`\`\`caddyfile
redir [<matcher>] <to> [<code>]
\`\`\`

- **&lt;to&gt;** is the target location.  Becomes the response's Location header.
- **&lt;code&gt;** is the HTTP status code to use for the redirect.  Can be:
	- A positive integer in the 3xx range
	- \`temporary\` for a temporary redirect (302; default)
	- \`permanent\` for a permanent redirect (301)
	- \`html\` to use an HTML document to perform the redirect (useful for redirecting browsers but not API clients)`,

	// https://caddyserver.com/docs/caddyfile/directives/rewrite
	rewrite: `Rewrites the request internally.  A rewrite changes some or all of the request URI.

The \`rewrite\` directive implies the intent to accept the request, but with modifications.  It is mutually exclusive to other \`rewrite\` directives in the same block, so it is safe to define rewrites that would otherwise cascade into each other; only the first matching rewrite will be executed.

Because \`rewrite\` essentially performs an internal redirect, the Caddyfile adapter will not fold any subsequent, adjacent handlers into the same route if their matchers happen to be exactly the same.  This allows the matchers of the next handlers to be deferred until after the rewrite.  In other words, a matcher that matches a request before the \`rewrite\` might not match the same request after the \`rewrite\`.  If you want your \`rewrite\` to share a route with other handlers, use the [\`route\`](https://caddyserver.com/docs/caddyfile/directives/route) or handle [\`directives\`](https://caddyserver.com/docs/caddyfile/directives/handle).

---

\`\`\`caddyfile
rewrite [<matcher>] <to>
\`\`\`

- **&lt;to&gt;** is the URI to set on the request.  Only designated parts will be replaced.  The URI path is any substring that comes before \`?\`.  If \`?\` is omitted, then the whole token is considered to be the path.`,

	// https://caddyserver.com/docs/caddyfile/directives/uri
	uri: `Manipulates a request's URI.  It can strip path prefix/suffix or replace substrings on the whole URI.

This directive is distinct from [\`rewrite\`](https://caddyserver.com/docs/caddyfile/directives/rewrite) in that \`uri\` partially changes the URI, rather than setting it to something completely different as \`rewrite\` does.  While \`rewrite\` is treated specially as an internal redirect, \`uri\` is just another handler.

---

\`\`\`caddyfile
uri [<matcher>] strip_prefix|strip_suffix|replace \
	<target> \
	[<replacement> [<limit>]]
\`\`\`

- The first (non-matcher) argument specifies the operation:
	- **strip_prefix** strips a prefix from the path, if it has the prefix.
	- **strip_suffix** strips a suffix from the path, if it has the suffix.
	- **replace** performs a substring replacement across the whole URI.
- **&lt;target&gt;** is the prefix, suffix, or search string/regular expression.  If a prefix, the leading forward slash may be omitted, since paths always start with a forward slash.
- **&lt;replacement&gt;** is the replacement string (only valid with \`replace\`).
- **&lt;limit&gt;** is an optional limit to the maximum number of replacements (only valid with \`replace\`).`,

	// https://caddyserver.com/docs/caddyfile/directives/try_files
	try_files: `Rewrites the request URI path to the first of the listed files which exists in the site root.  If no files match, no rewrite is performed.

---

\`\`\`caddyfile
try_files <files...>
\`\`\`

- **&lt;files...&gt;** is the list of files to try.  The URI will be rewritten to the first one that exists.  To match directories, append a trailing forward slash \`/\` to the path.  All file paths are relative to the site [root](https://caddyserver.com/docs/caddyfile/directives/root).  Each argument may also contain a query string, in which case the query string will also be changed if it matches that particular file.`,

	// https://caddyserver.com/docs/caddyfile/directives/basicauth
	basicauth: `Enables HTTP Basic Authentication, which can be used to protect directories and files with a username and hashed password.

**Note that basic auth is not secure over plain HTTP.** Use discretion when deciding what to protect with HTTP Basic Authentication.

When a user requests a resource that is protected, the browser will prompt the user for a username and password if they have not already supplied one.  If the proper credentials are present in the Authorization header, the server will grant access to the resource.  If the header is missing or the credentials are incorrect, the server will respond with HTTP 401 Unauthorized.

Caddy configuration does not accept plaintext passwords; you MUST hash them before putting them into the configuration.  The [\`caddy hash-password\`](https://caddyserver.com/docs/command-line#caddy-hash-password) command can help with this.

---

\`\`\`caddyfile
basicauth [<matcher>] [<hash_algorithm> [<realm>]] {
	<username> <hashed_password_base64> [<salt_base64>]
	...
}
\`\`\`

- **&lt;hash_algorithm&gt;** is the name of the password hashing algorithm (or KDF) used for the hashes in this configuration.  Can be \`bcrypt\` (default) or \`scrypt\`.
- **&lt;realm&gt;** is a custom realm name.
- **&lt;username&gt;** is a username or user ID.
- **&lt;hashed_password_base64&gt;** is the base-64 encoding of the hashed password.
- **&lt;salt_base64&gt;** is the base-64 encoding of the password salt, if an external salt is required.`,

	// https://caddyserver.com/docs/caddyfile/directives/request_header
	request_header: `Manipulates HTTP header fields on the request.  It can set, add, and delete header values, or perform replacements using regular expressions.

---

\`\`\`caddyfile
request_header [<matcher>] [[+|-]<field> [<value>|<find>] [<replace>]]
\`\`\`

- **&lt;field&gt;** is the name of the header field.  By default, will overwrite any existing field of the same name.  Prefix with \`+\` to add the field instead of replace, or prefix with \`-\` to remove the field.
- **&lt;value&gt;** is the header field value, if adding or setting a field.
- **&lt;find&gt;** is the substring or regular expression to search for.
- **&lt;replace&gt;** is the replacement value; required if performing a search-and-replace.`,

	// https://caddyserver.com/docs/caddyfile/directives/encode
	encode: `Encodes responses using the configured encoding(s).  A typical use for encoding is compression.

---

\`\`\`caddyfile
encode [<matcher>] <formats...> {
	gzip [<level>]
	zstd
}
\`\`\`

- **&lt;formats...&gt;** is the list of encoding formats to enable.
- **gzip** enables Gzip compression, optionally at the specified level.
- **zstd** enables Zstandard compression.`,

	// https://caddyserver.com/docs/caddyfile/directives/templates
	templates: `Executes the response body as a [template](https://caddyserver.com/docs/modules/http.handlers.templates) document.  Templates provide functional primitives for making simple dynamic pages.  Features include HTTP subrequests, HTML file includes, Markdown rendering, JSON parsing, basic data structures, randomness, time, and more.

---

\`\`\`caddyfile
templates [<matcher>] {
	mime    <types...>
	between <open_delim> <close_delim>
	root    <path>
}
\`\`\`

- **mime** are the MIME types the templates middleware will act on; any responses that do not have a qualifying Content-Type will not be evaluated as templates.  Default: \`text/html text/plain\`.
- **between** are the opening and closing delimiters for template actions.  Default: \`{{printf "{{ }}"}}\`.  You can change them if they interfere with the rest of your document.
- **root** is the site root, when using functions that access the file system.`,

	// https://caddyserver.com/docs/caddyfile/directives/handle
	handle: `Evaluates a group of directives mutually exclusively from other \`handle\` blocks at the same level of nesting.

The \`handle\` directive is kind of similar to the \`location\` directive from nginx config: the first matching \`handle\` block will be evaluated.  Handle blocks can be nested if needed.  Only HTTP handler directives can be used inside handle blocks.

---

\`\`\`caddyfile
handle [<matcher>] {
	<directives...>
}
\`\`\`

- **&lt;directives...&gt;** is a list of HTTP handler directives or directive blocks, one per line, just like would be used outside of a handle block.`,

	// https://caddyserver.com/docs/caddyfile/directives/handle_path
	handle_path: `Same as the [\`handle\` directive](https://caddyserver.com/docs/caddyfile/directives/handle), but implicitly strips the matched path prefix.

Handling a request matching a certain path (while stripping that path from the request URI) is a common enough use case that it has its own directive for convenience.

---

\`\`\`caddyfile
handle_path <path_matcher> {
	<directives...>
}
\`\`\`

- **&lt;directives...&gt;** is a list of HTTP handler directives or directive blocks, one per line, just like would be used outside of a handle_path block.

Note that only a single path matcher is accepted and required; you cannot use other kinds of matchers with handle_path.`,

	// https://caddyserver.com/docs/caddyfile/directives/route
	route: `Evaluates a group of directives literally and as a single unit.

Directives contained in a route block will not be reordered internally.  Only HTTP handler directives (directives which add handlers or middleware to the chain) can be used in a route block.

This directive is a special case in that its subdirectives are also regular directives.

---

\`\`\`caddyfile
route [<matcher>] {
	<directives...>
}
\`\`\`

- **&lt;directives...&gt;** is a list of directives or directive blocks, one per line, just like outside of a route block; except these directives will not be reordered.  Only HTTP handler directives can be used.`,

	// https://caddyserver.com/docs/caddyfile/directives/respond
	respond: `Writes a hard-coded/static response to the client.

---

\`\`\`caddyfile
respond [<matcher>] <status>|<body> [<status>] {
	body <text>
	close
}
\`\`\`

- **&lt;status&gt;** is the HTTP status code to write.  Default 200.
- **&lt;body&gt;** is the response body to write.
- **body** is an alternate way to provide a body; convenient if it is multiple lines.
- **close** will close the client's connection to the server after writing the response.

To clarify, the first non-matcher argument can be either a 3-digit status code or a response body string.  If it is a body, the next argument can be the status code.`,

	// https://caddyserver.com/docs/caddyfile/directives/metrics
	metrics: `Configures a Prometheus metrics exposition endpoint so the gathered metrics can
be exposed for scraping.

Note that a \`/metrics\` endpoint is also attached to the [admin API](https://caddyserver.com/docs/api),
which is not configurable, and is not available when the admin API is disabled.

This endpoint will return metrics in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format)
or, if negotiated, in the [OpenMetrics exposition format](https://pkg.go.dev/github.com/prometheus/client_golang@v1.7.1/prometheus/promhttp#HandlerOpts)
(\`application/openmetrics-text\`).

See also [Monitoring Caddy with Prometheus metrics](https://caddyserver.com/docs/metrics).

---

\`\`\`caddyfile
metrics [<matcher>]
\`\`\``,

	// https://caddyserver.com/docs/caddyfile/directives/reverse_proxy
	reverse_proxy: `Proxies requests to one or more backends with configurable transport, load balancing, health checking, header manipulation, and buffering options.

---

\`\`\`caddyfile
reverse_proxy [<matcher>] [<upstreams...>] {
    # backends
    to <upstreams...>
	...

    # load balancing
    lb_policy       <name> [<options...>]
    lb_try_duration <duration>
    lb_try_interval <interval>

    # active health checking
    health_path     <path>
    health_port     <port>
    health_interval <interval>
    health_timeout  <duration>
    health_status   <status>
    health_body     <regexp>

    # passive health checking
    fail_duration     <duration>
    max_fails         <num>
    unhealthy_status  <status>
    unhealthy_latency <duration>
    unhealthy_request_count <num>

    # streaming
    flush_interval <duration>

    # header manipulation
    header_up   [+|-]<field> [<value|regexp> [<replacement>]]
    header_down [+|-]<field> [<value|regexp> [<replacement>]]

    # round trip
    transport <name> {
        ...
    }
}
\`\`\`

### Upstreams

- **&lt;upstreams...&gt;** is a list of upstreams (backends) to which to proxy.
- **to** is an alternate way to specify the list of upstreams, one (or more) per line.

Upstream addresses can take the form of a conventional [Caddy network address](https://caddyserver.com/docs/conventions#network-addresses) or a URL that contains only scheme and host/port, with a special exception that the scheme may be prefixed by \`srv+\` to enable SRV DNS record lookups for load balancing.  Valid examples:

- \`localhost:4000\`
- \`127.0.0.1:4000\`
- \`http://localhost:4000\`
- \`https://example.com\`
- \`h2c://127.0.0.1\`
- \`example.com\`
- \`unix//var/php.sock\`
- \`srv+http://internal.service.consul\`
- \`srv+https://internal.service.consul\`

Note: Schemes cannot be mixed, since they modify the common transport configuration (a TLS-enabled transport cannot carry both HTTPS and plaintext HTTP).  Specifying ports 80 and 443 are the same as specifying the HTTP and HTTPS schemes, respectively.  Any explicit transport configuration will not be overwritten, and omitting schemes or using other ports will not assume a particular transport.  Additionally, schemes cannot contain paths or query strings, as that would imply simultaneous rewriting the request while proxying, which behavior is not defined or supported.  If the address is not a URL (i.e.  does not have a scheme), then placeholders can be used, but this makes the upstream dynamic.

### Load balancing

Load balancing is used whenever more than one upstream is defined.

- **lb_policy** is the name of the load balancing policy, along with any options.  Default: \`random\`.  Can be:
	- \`first\` - choose first available upstream
	- \`header\` - map request header to sticky upstream
	- \`ip_hash\` - map client IP to sticky upstream
	- \`least_conn\` - choose upstream with fewest number of current requests
	- \`random\` - randomly choose an upstream
	- \`random_choose <n>\` - selects two or more upstreams randomly, then chooses one with least load (\`n\` is usually 2)
	- \`round_robin\` - iterate each upstream in turn
	- \`uri_hash\` - map URI to sticky upstream
	- \`cookie [<name> [<secret>]]\` - based on the given cookie (default name is \`lb\` if not specified), which value is hashed; optionally with a secret for HMAC-SHA256

- **lb_try_duration** is a [duration value](https://caddyserver.com/docs/conventions#durations) that defines how long to try selecting available backends for each request if the next available host is down.  By default, this retry is disabled.  Clients will wait for up to this long while the load balancer tries to find an available upstream host.
- **lb_try_interval** is a [duration value](https://caddyserver.com/docs/conventions#durations) that defines how long to wait between selecting the next host from the pool.  Default is \`250ms\`.  Only relevant when a request to an upstream host fails.  Be aware that setting this to 0 with a non-zero \`lb_try_duration\` can cause the CPU to spin if all backends are down and latency is very low.

#### Active health checks

Active health checks perform health checking in the background on a timer:

- **health_path** is the URI path for active health checks.
- **health_port** is the port to use for active health checks, if different from the upstream's port.
- **health_interval** is a [duration value](https://caddyserver.com/docs/conventions#durations) that defines how often to perform active health checks.
- **health_timeout** is a [duration value](https://caddyserver.com/docs/conventions#durations) that defines how long to wait for a reply before marking the backend as down.
- **health_status** is the HTTP status code to expect from a healthy backend.  Can be a 3-digit status code or a status code class ending in \`xx\`, for example: \`200\` (default) or \`2xx\`.
- **health_body** is a substring or regular expression to match on the response body of an active health check.  If the backend does not return a matching body, it will be marked as down.

#### Passive health checks

Passive health checks happen inline with actual proxied requests:

- **fail_duration**  is a [duration value](https://caddyserver.com/docs/conventions#durations) that defines how long to remember a failed request.  A duration > 0 enables passive health checking.
- **max_fails** is the maximum number of failed requests within fail_timeout that are needed before considering a backend to be down; must be >= 1; default is 1.
- **unhealthy_status** counts a request as failed if the response comes back with one of these status codes.  Can be a 3-digit status code or a status code class ending in \`xx\`, for example: \`404\` or \`5xx\`.
- **unhealthy_latency** is a [duration value](https://caddyserver.com/docs/conventions#durations) that counts a request as failed if it takes this long to get a response.
- **unhealthy_request_count** is the permissible number of simultaneous requests to a backend before marking it as down.

### Streaming

The proxy **buffers responses** by default for wire efficiency:

- **flush_interval** is a [duration value](/docs/conventions#durations) that defines how often Caddy should flush the buffered response body to the client.  Set to -1 to disable buffering.  It is set to -1 automatically for requests that have a \`text/event-stream\` response or for HTTP/2 requests where the Content-Length is unspecified.
- **buffer_requests** will cause the proxy to read the entire request body into a buffer before sending it upstream.  This is very inefficient and should only be done if the upstream requires reading request bodies without delay (which is something the upstream application should fix).

### Headers

It can also **manipulate headers** between itself and the backend:

- **header_up** Sets, adds, removes, or performs a replacement in a request header going upstream to the backend.
- **header_down** Sets, adds, removes, or performs a replacement in a response header coming downstream from the backend.

By default, Caddy passes thru incoming headers to the backend&mdash;including the \`Host\` header&mdash;without modifications, with two exceptions:

- It adds or augments the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) header field.
- It sets the [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) header field.

Since these header fields are only de-facto standards, Caddy may stop setting them implicitly in the future if the standardized [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header field becomes more widely adopted.

### Transports

Caddy's proxy **transport** is pluggable:

- **transport** defines how to communicate with the backend.  Default is \`http\`.


#### The \`http\` transport

\`\`\`caddyfile
transport http {
	read_buffer             <size>
	write_buffer            <size>
	max_response_header     <size>
	dial_timeout            <duration>
	dial_fallback_delay     <duration>
	response_header_timeout <duration>
	expect_continue_timeout <duration>
	tls
	tls_client_auth <automate_name> | <cert_file> <key_file>
	tls_insecure_skip_verify
	tls_timeout <duration>
	tls_trusted_ca_certs <pem_files...>
    tls_server_name <sni>
	keepalive [off|<duration>]
	keepalive_idle_conns <max_count>
    versions <versions...>
    compression off
    max_conns_per_host <count>
    max_idle_conns_per_host <count>
}
\`\`\`

- **read_buffer** is the size of the read buffer in bytes.
- **write_buffer** is the size of the write buffer in bytes.
- **max_response_header** is the maximum amount of bytes to read from response headers.
- **dial_timeout** is how long to wait when connecting to the upstream socket.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).
- **dial_fallback_delay** is how long to wait before spawning an RFC 6555 Fast Fallback connection.  A negative value disables this.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).
- **response_header_timeout** is how long to wait for reading response headers from the upstream.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).
- **expect_continue_timeout** is how long to wait for the upstreams's first response headers after fully writing the request headers if the request has the header \`Expect: 100-continue\`.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).
- **tls** uses HTTPS with the backend.  This will be enabled automatically if you specify backends using the \`https://\` scheme or port \`:443\`.
- **tls_client_auth** enables TLS client authentication one of two ways: (1) by specifying a domain name for which Caddy should obtain a certificate and keep it renewed, or (2) by specifying a certificate and key file to present for TLS client authentication with the backend.
- **tls_insecure_skip_verify** turns off security.  _Do not use in production._
- **tls_timeout** is a [duration value](/docs/conventions#durations) that specifies how long to wait for the TLS handshake to complete.
- **tls_trusted_ca_certs** is a list of PEM files that specify CA public keys to trust when connecting to the backend.
- **tls_server_name** sets the ServerName (SNI) to put in the ClientHello; only needed if the remote server requires it.
- **keepalive** is either \`off\` or a [duration value](/docs/conventions#durations) that specifies how long to keep connections open.
- **keepalive_idle_conns** defines the maximum number of connections to keep alive.
- **versions** allows customizing which versions of HTTP to support.  As a special case, "h2c" is a valid value which will enable cleartext HTTP/2 connections to the upstream (however, this is a non-standard feature that does not use Go's default HTTP transport, so it is exclusive of other features; subject to change or removal).  Default: \`1.1 2\`, or if scheme is \`h2c://\`, \`h2c 2\`
- **compression** can be used to disable compression to the backend by setting it to \`off\`.
- **max_conns_per_host** optionally limits the total number of connections per host, including connections in the dialing, active, and idle states.  Has no limit by default.
- **max_idle_conns_per_host** if non-zero, controls the maximum idle (keepalive) connections to keep per-host.  Default: \`2\`



#### The \`fastcgi\` transport

\`\`\`caddyfile
transport fastcgi {
	root  <path>
	split <at>
	env   <key> <value>
	resolve_root_symlink
	dial_timeout  <duration>
	read_timeout  <duration>
	write_timeout <duration>
}
\`\`\`

- **root** is the root of the site.  Default: \`{http.vars.root}\` or current working directory.
- **split** is where to split the path to get PATH_INFO at the end of the URI.
- **env** sets an extra environment variable to the given value.  Can be specified more than once for multiple environment variables.
- **resolve_root_symlink** enables resolving the \`root\` directory to its actual value by evaluating a symbolic link, if one exists.
- **dial_timeout** is how long to wait when connecting to the upstream socket.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).  Default: no timeout.
- **read_timeout** is how long to wait when reading from the FastCGI server.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).  Default: no timeout.
- **write_timeout** is how long to wait when sending to the FastCGI server.  Accepts [duration value](https://caddyserver.com/docs/conventions#durations).  Default: no timeout.`,

	// https://caddyserver.com/docs/caddyfile/directives/php_fastcgi
	php_fastcgi: `An opinionated directive that proxies requests to a PHP FastCGI server such as php-fpm.

Caddy's [reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy) is capable of serving any FastCGI application, but this directive is tailored specifically for PHP apps.  This directive is actually just a convenient way to use a longer, more common configuration (below).

It expects that any \`index.php\` at the site root acts as a router.  If that is not desirable, either perform your own URI rewrite or use something like the [expanded form](#expanded-form) below and customize it to your needs.

It supports all the subdirectives of [reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy) and passes them through to the underlying reverse_proxy handler, plus a few subdirectives that customize the FastCGI transport specifically.

**Most modern PHP apps work fine without extra subdirectives or customization.** Subdirectives are usually only used in certain edge cases or with legacy PHP apps.

---

\`\`\`caddyfile
php_fastcgi [<matcher>] <php-fpm_gateways...> {
	split <substrings...>
	env [<key> <value>]
	root <path>
	index <filename>

	<any other reverse_proxy subdirectives...>
}
\`\`\`

- **&lt;php-fpm_gateways...&gt;** are the [addresses](https://caddyserver.com/docs/conventions#network-addresses) of the FastCGI servers.
- **root** sets the root folder to the site.  Default: [\`root\` directive](https://caddyserver.com/docs/caddyfile/directives/root).
- **split** sets the substrings for splitting the URI into two parts.  The first matching substring will be used to split the "path info" from the path.  The first piece is suffixed with the matching substring and will be assumed as the actual resource (CGI script) name.  The second piece will be set to PATH_INFO for the CGI script to use.  Default: \`.php\`
- **env** sets an extra environment variable to the given value.  Can be specified more than once for multiple environment variables.
- **index** specifies the filename to treat as the directory index file.  This affects the file matcher in the [expanded form](https://caddyserver.com/docs/caddyfile/directives/php_fastcgi#expanded-form).  Default: \`index.php\``,

	// https://caddyserver.com/docs/caddyfile/directives/file_server
	file_server: `A static file server.  It works by appending the request's URI path to the [site's root path](https://caddyserver.com/docs/caddyfile/directives/root).  By default, it enforces canonical URIs; if necessary, requests to directories will be redirected to have a trailing forward slash, and requests to files will be redirected to strip the trailing slash.

Most often, the \`file_server\` directive is paired with the [\`root\`](https://caddyserver.com/docs/caddyfile/directives/root) directive to set file root for the whole site.

---

\`\`\`caddyfile
file_server [<matcher>] [browse] {
	root   <path>
	hide   <files...>
	index  <filenames...>
	browse [<template_file>]
}
\`\`\`

- **browse** enables file listings for requests to directories that do not have an index file.
- **root** sets the path to the site root for just this file server instance, overriding any other.  Default: \`{http.vars.root}\` or the current working directory.  Note: This subdirective only changes the root for this directive. For other directives (like [\`try_files\`](https://caddyserver.com/docs/caddyfile/directives/try_files) or [\`templates\`](https://caddyserver.com/docs/caddyfile/directives/templates)) to know the same site root, use the [\`root\`](https://caddyserver.com/docs/caddyfile/directives/root) directive, not this subdirective.
- **hide** is a list of files or folders to hide; if requested, the file server will pretend they do not exist.  Accepts placeholders and glob patterns.  Note that these are _file system_ paths, NOT request paths.  In other words, relative paths use the current working directory as a base, NOT the site root; and all paths are transformed to their absolute form before comparisons (if possible).  Specifying a file name or pattern without a path separator will hide all files with a matching name regardless of its location; otherwise, a path prefix match will be attempted, and then a globular match.  Since this is a Caddyfile config, the active configuration file(s) will be added by default.
- **index** is a list of filenames to look for as index files.  Default: \`index.html index.txt\`
- **&lt;template_file&gt;** is an optional custom template file to use for directory listings.  Defaults to the template that can be found [here in the source code](https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/browsetpl.go).`,

	// https://caddyserver.com/docs/caddyfile/directives/acme_server
	acme_server: `An embedded [ACME protocol](https://tools.ietf.org/html/rfc8555) server handler.  This allows a Caddy instance to issue certificates for any other ACME-compatible software (including other Caddy instances).

When enabled, requests matching the path \`/acme/*\` will be handled by the ACME server.

---

\`\`\`caddyfile
acme_server [<matcher>]
\`\`\``,
};
