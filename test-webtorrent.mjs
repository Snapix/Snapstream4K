import WebTorrent from 'webtorrent';
console.log("WebTorrent imported:", WebTorrent);
const client = new WebTorrent();
console.log("Client created:", client);
const torrent = client.add('magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10');
console.log("Torrent.on exists:", typeof torrent.on === 'function');
client.destroy();
