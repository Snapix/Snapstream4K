import WebTorrent from 'webtorrent';
const client = new WebTorrent();
const result = client.add('magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10');
console.log("Is Promise?", result instanceof Promise);
console.log("typeof result.on:", typeof result.on);
client.destroy();
