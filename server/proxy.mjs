import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
])

/**
 * Forward request to upstream (changeOrigin). Used for /api/myhora → myhora.com
 */
export function proxyToUpstream(clientReq, clientRes, targetOrigin, stripPrefix) {
  const target = new URL(targetOrigin)
  const incoming = new URL(clientReq.url ?? '/', 'http://127.0.0.1')
  let pathname = incoming.pathname
  if (pathname.startsWith(stripPrefix)) {
    pathname = pathname.slice(stripPrefix.length) || '/'
  }
  const path = pathname + incoming.search

  const headers = { ...clientReq.headers, host: target.host }
  for (const name of HOP_BY_HOP) {
    delete headers[name]
  }

  const transport = target.protocol === 'https:' ? https : http
  const port = target.port || (target.protocol === 'https:' ? 443 : 80)

  const upstream = transport.request(
    {
      hostname: target.hostname,
      port,
      method: clientReq.method,
      path,
      headers,
    },
    (upstreamRes) => {
      const resHeaders = { ...upstreamRes.headers }
      for (const name of HOP_BY_HOP) {
        delete resHeaders[name]
      }
      clientRes.writeHead(upstreamRes.statusCode ?? 502, resHeaders)
      upstreamRes.pipe(clientRes)
    },
  )

  upstream.on('error', (err) => {
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    }
    clientRes.end(`myhora proxy error: ${err.message}`)
  })

  clientReq.pipe(upstream)
}

export const MYHORA_PROXY_ROUTES = [
  { prefix: '/api/myhora', target: 'https://myhora.com' },
  { prefix: '/api/myhora-net', target: 'https://myhora.net' },
]

export function matchProxyRoute(urlPath) {
  return MYHORA_PROXY_ROUTES.find((r) => urlPath.startsWith(r.prefix))
}
