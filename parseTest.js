const title = "John Wick Chapter 4 2023 2160p HDR WEB-DL DDP5.1 HEVC-CMRG\n👤 405 💾 15.68 GB ⚙️ RARBG\n🇬🇧 🇪🇸";
const name = "Torrentio\n[RD+] 4k";

function parseStream(stream) {
  let quality = (stream.name || '').replace(/Torrentio\n?/i, '').trim() || 'Unknown Quality';
  
  const lines = (stream.title || '').split('\n');
  const releaseName = lines[0] || 'Unknown Release';
  
  let peers = '0';
  let size = 'Unknown';
  let source = 'Unknown';
  let flags = [];
  
  if (lines.length > 1) {
    const statsLine = lines[1];
    
    const peersMatch = statsLine.match(/👤\s*(\d+)/);
    if (peersMatch) peers = peersMatch[1];
    
    const sizeMatch = statsLine.match(/💾\s*([\d.]+\s*[A-Z]+)/i);
    if (sizeMatch) size = sizeMatch[1];
    
    const sourceMatch = statsLine.match(/⚙️\s*([^\n]+)/);
    if (sourceMatch) source = sourceMatch[1].trim();
  }
  
  if (lines.length > 2) {
     flags = lines[2].trim().split(' ').filter(f => f.trim().length > 0);
  }
  
  return { quality, releaseName, peers, size, source, flags };
}

console.log(parseStream({ name, title }));

const pirateBayTitle = "John Wick 4.mkv";
const pirateBayName = "ThePirateBay\n500S / 100L";
console.log(parseStream({ name: pirateBayName, title: pirateBayTitle }));

