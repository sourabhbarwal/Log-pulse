import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initIO } from './lib/socket';
import { startLogListener } from './lib/logListener';
import dbConnect from './lib/mongodb';
import { getIO } from './lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = initIO(httpServer);

  // Connect to MongoDB
  await dbConnect();

  // Start Log Listener
  startLogListener((log) => {
    console.log('Broadcasting log:', log.message);
    io.emit('new-log', log);
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
