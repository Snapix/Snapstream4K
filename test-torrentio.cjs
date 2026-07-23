const https = require('https');
const options = {
  hostname: 'torrentio.strem.fun',
  path: '/lite/stream/movie/tt10366206.json',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.streams.slice(0, 3), null, 2));
    } catch(e) {
      console.error("Parse error:", data.substring(0, 200));
    }
  });
});
