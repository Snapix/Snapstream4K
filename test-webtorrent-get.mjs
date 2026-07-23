import WebTorrent from 'webtorrent';
const client = new WebTorrent();
const mag = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10';
const t = client.add(mag);
const t2 = client.get(mag);
console.log("t === t2:", t === t2);
console.log("typeof t2.on:", typeof t2?.on);
client.destroy();
