const http = require('http');

const server = http.createServer((req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Handle localhost cases
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = 'Public IP not available (Running Locally)';
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  const key = ip;
  console.log(key)
  // res.end(`Your IP address is: ${ip}`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
