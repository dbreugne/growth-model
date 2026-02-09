const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3456;
const DATA_FILE = path.join(__dirname, 'data.json');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoint to save data
    if (req.method === 'POST' && req.url === '/api/save') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Saved!' }));
                console.log(`[${new Date().toLocaleTimeString()}] Data saved to data.json`);
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API endpoint to load data
    if (req.method === 'GET' && req.url === '/api/data') {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No data file found' }));
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   📈 Growth Model Server                                  ║
║                                                           ║
║   Open: http://localhost:${PORT}                           ║
║                                                           ║
║   Data file: data.json                                    ║
║   Press Ctrl+C to stop                                    ║
║                                                           ║
║   Powered by Otomato - https://otomato.xyz                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
});
