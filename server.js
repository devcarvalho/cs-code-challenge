const http = require('http');
const fs = require('fs');

const server = http.createServer((request, res) => {
  switch (request.url) {
    case '/main.css':
      res.writeHead(200, { 'content-type': 'text/css' });
      fs.createReadStream('exercise-1/css/main.css').pipe(res);
      break;
    case '/app.js':
      res.writeHead(200, { 'content-type': 'application/javascript' });
      fs.createReadStream('exercise-1/js/app.js').pipe(res);
      break;
    default:
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream('exercise-1/index.html').pipe(res);
  }
});

server.listen(3000);
