const http = require('http');
const maxmind = require('maxmind');
const path = require('path');

// Load the MaxMind database
const dbPath = path.join(__dirname, 'GeoLite2-City.mmdb');
let lookup;

maxmind.open(dbPath).then((cityLookup) => {
  lookup = cityLookup;
});

const server = http.createServer(async (req, res) => {
  let ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress;

  // Handle localhost cases
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = '8.8.8.8';
  }

  let locationData = { error: 'Location data not available' };

  if (lookup) {
    const geo = lookup.get(ip);
    if (geo) {
      locationData = {
        ip: ip,
        city: geo.city?.names?.en || "Unknown",
        country: geo.country?.names?.en || "Unknown",
        latitude: geo.location?.latitude || "Unknown",
        longitude: geo.location?.longitude || "Unknown",
      };
    }
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(locationData, null, 2));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
