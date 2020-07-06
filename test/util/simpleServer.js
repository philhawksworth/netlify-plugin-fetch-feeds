const http = require('http');

module.exports = async function simpleServer ({ content, contentType, statusCode = 200 }) {
  const server = http.createServer((_, res) => {
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.statusCode = statusCode;
    res.end(content);
  });
  await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(resolve);
  });
  return { server, url: `http://localhost:${server.address().port}` };
}
