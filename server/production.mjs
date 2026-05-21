/**
 * Production: serve Vite dist + proxy /api/myhora → myhora.com (same paths as vite dev proxy).
 *
 *   npm run build && npm run start
 *
 * Build must set VITE_MYHORA_ORIGIN=/api/myhora (see .env.production).
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { matchProxyRoute, proxyToUpstream } from './proxy.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '../dist')
const PORT = Number(process.env.PORT) || 8080
const HOST = process.env.HOST ?? '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] ?? '/')
  const normalized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '')
  return normalized.startsWith('/') ? normalized.slice(1) : normalized
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath)
  const type = MIME[ext] ?? 'application/octet-stream'
  const stream = fs.createReadStream(filePath)
  stream.on('error', () => {
    res.writeHead(404)
    res.end('Not found')
  })
  res.writeHead(200, { 'Content-Type': type })
  stream.pipe(res)
}

function serveStatic(urlPath, res) {
  const rel = safePath(urlPath)
  const file = path.join(DIST, rel === '' || rel === '/' ? 'index.html' : rel)

  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    serveFile(file, res)
    return
  }

  const index = path.join(DIST, 'index.html')
  if (fs.existsSync(index)) {
    serveFile(index, res)
    return
  }

  res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Run npm run build first (dist/ missing).')
}

const server = http.createServer((req, res) => {
  const urlPath = req.url?.split('?')[0] ?? '/'
  const route = matchProxyRoute(urlPath)

  if (route) {
    proxyToUpstream(req, res, route.target, route.prefix)
    return
  }

  serveStatic(urlPath, res)
})

if (!fs.existsSync(DIST)) {
  console.warn(`[newhora] Warning: ${DIST} not found — run "npm run build" before start.`)
}

server.listen(PORT, HOST, () => {
  console.log(`[newhora] http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`)
  console.log('[newhora] Static: dist/  |  Proxy: /api/myhora → myhora.com  |  /api/myhora-net → myhora.net')
})
