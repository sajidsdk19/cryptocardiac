const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.join(__dirname, 'build');
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const sendFile = (res, filePath) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Internal server error');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const isStaticAsset = filePath.includes(`${path.sep}static${path.sep}`);

        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Cache-Control': isStaticAsset
                ? 'public, max-age=31536000, immutable'
                : 'no-cache'
        });
        res.end(data);
    });
};

const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const cleanPath = urlPath.replace(/^\/+/, '');
    const requestedPath = path.normalize(path.join(root, cleanPath));

    if (!requestedPath.startsWith(root)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }

    fs.stat(requestedPath, (statError, stats) => {
        if (!statError && stats.isFile()) {
            sendFile(res, requestedPath);
            return;
        }

        sendFile(res, path.join(root, 'index.html'));
    });
});

server.listen(port, host, () => {
    console.log(`Serving production build at http://${host}:${port}`);
});
