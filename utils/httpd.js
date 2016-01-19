import http from 'http';
import https from 'https';
import url from 'url';

const PING_INTERVAL = 1000 * 60 * 5; // ms * s = m
const HEROKU_URL = process.env.HEROKU_URL || 'http://localhost:5000';

function pingInterval() {
  return setInterval(()=> {
    if (process.env.HEROKU_URL) {
      return https.get(`${HEROKU_URL}/ping`, (res)=> {
        console.log(`${res.statusCode} keep alive ping.`);
        res.resume();
      });
    }
    http.get(`${HEROKU_URL}/ping`, (res)=> {
      console.log(`${res.statusCode} keep alive ping.`);
      res.resume();
    });
  }, PING_INTERVAL);
}

const handlers = {};

handlers['/'] = (req, res)=> {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('it is running\n');
  res.end();
};

handlers['/ping'] = (req, res)=> {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('pong');
  res.end();
};

export function startHttpd() {
  const server = http.createServer((req, res)=> {
    const parsedUrl = url.parse(req.url);
    const handler = handlers[parsedUrl.pathname];
    if (handler) handler(req, res);
  });

  server.listen((process.env.PORT || 5000), ()=> {
    console.log('httpd server listening...');
    const intervalID = pingInterval();

    server.on('close', ()=> {
      clearInterval(intervalID);
    });
  });
}
