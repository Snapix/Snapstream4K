import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStreams } from '../lib/api';
import { ArrowLeft, Loader2, Play, ExternalLink, Server, Wifi, LayoutGrid, X, Check, Copy } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

function parseStreamInfo(stream: any) {
  let quality = (stream.name || '').replace(/Torrentio\n?/i, '').trim() || 'Link';
  let peers = '0';
  let size = '';
  
  if (stream.title) {
    const titleParts = stream.title.split('\n');
    if (titleParts.length > 0) {
      const pMatch = stream.title.match(/👤\s*(\d+)/);
      if (pMatch) peers = pMatch[1];
      
      const sMatch = stream.title.match(/💾\s*([\d.]+\s*[A-Z]+)/);
      if (sMatch) size = sMatch[1];

      if (titleParts[0].includes('4K')) quality = '4K';
      else if (titleParts[0].includes('1080p')) quality = '1080p';
      else if (titleParts[0].includes('720p')) quality = '720p';
      else if (titleParts[0].includes('HDR')) quality = 'HDR';
    }
  }
  
  return { quality, peers, size, title: stream.title || stream.name };
}

export default function Watch() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [promptStream, setPromptStream] = useState<any>(null);
  const { settings, updateSettings } = useSettings();
  const [dontShowAgain, setDontShowAgain] = useState(settings.dontShowExternalPlayerPopup);

  const isSeries = type === 'series';
  const [imdbId, season, episode] = (id || '').split(':');

  useEffect(() => {
    let mounted = true;
    async function loadStreams() {
      if (type && id) {
        setLoading(true);
        setError('');
        try {
          const data = await fetchStreams(type as 'movie' | 'series', id);
          if (mounted) {
            if (!data || data.length === 0) {
              setError('No streams available for this content');
            } else {
              setStreams(data);
            }
            setLoading(false);
          }
        } catch (err) {
          if (mounted) {
            setError('Failed to fetch streams');
            setLoading(false);
          }
        }
      }
    }
    loadStreams();
    return () => { mounted = false; };
  }, [type, id]);

  const handleStreamClick = (stream: any) => {
    if (settings.dontShowExternalPlayerPopup) {
      openExternal(stream);
    } else {
      setPromptStream(stream);
      setDontShowAgain(settings.dontShowExternalPlayerPopup);
    }
  };

  const openExternal = (stream: any) => {
    if (stream.url) {
      window.location.href = stream.url;
    } else if (stream.infoHash) {
      const magnet = `magnet:?xt=urn:btih:${stream.infoHash}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`;
      window.location.href = magnet;
    }
  };

  const handleConfirmPlay = () => {
    if (dontShowAgain) {
      updateSettings({ dontShowExternalPlayerPopup: true });
    }
    openExternal(promptStream);
    setPromptStream(null);
  };

  const SourcesList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-10">
      {streams.map((stream, idx) => {
        const { quality, peers, size, title } = parseStreamInfo(stream);
        const isTorrent = !!stream.infoHash;
        
        return (
          <button
            key={idx}
            onClick={() => handleStreamClick(stream)}
            className={`group relative glass-panel p-4 md:p-5 text-left transition-all hover:-translate-y-1 ${
              promptStream === stream ? 'border-primary/50 bg-primary/10' : ''
            } hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]`}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
            
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <span className={`font-black text-xs md:text-sm uppercase tracking-widest px-2.5 md:px-3 py-1 rounded-md ${
                quality === '4K' ? 'bg-[#E50914] text-white' : 
                quality === '1080p' ? 'bg-[var(--primary)] text-[var(--primary-text)]' : 
                'bg-white/10 text-white'
              }`}>
                {quality}
              </span>
              
              {isTorrent ? (
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-gray-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                  <Wifi size={12} className={parseInt(peers) > 0 ? "text-[var(--primary)]" : "text-gray-500"} />
                  {peers} Peers
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-gray-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                  <Server size={12} className="text-[var(--primary)]" />
                  Direct
                </div>
              )}
            </div>
            
            <h4 className="font-bold text-white text-xs md:text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors pr-6">
              {title}
            </h4>
            
            <div className="flex justify-between items-end mt-auto pt-2">
              <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                {size && <span>{size}</span>}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                Play
              </span>
            </div>
            
            <Play size={20} className="shrink-0 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col min-h-[90vh] bg-[#050505] p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-white hover:text-[var(--primary)] transition-colors font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:border-[var(--primary)] text-xs md:text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 size={64} className="animate-spin mb-6 md:mb-8 text-[var(--primary)]" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white mb-2">Finding Sources</h2>
            <p className="text-gray-500 font-bold tracking-widest text-xs md:text-sm uppercase">Searching the decentralized network...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-white p-6 w-full">
            <div className="glass-panel p-8 md:p-12 text-center max-w-lg w-full flex flex-col items-center">
              <LayoutGrid size={48} className="text-gray-600 mb-6" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-4 text-red-400">
                {error}
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full max-w-5xl mx-auto">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4 shrink-0">
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <span className="w-2 h-6 bg-[var(--primary)] rounded-full inline-block"></span>
                  Sources
                </h2>
                {isSeries && (
                  <span className="text-xs md:text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">
                    Season {season} • Episode {episode}
                  </span>
                )}
              </div>
              <span className="text-xs font-black bg-white/10 text-white px-3 py-1 rounded-full uppercase tracking-widest mt-1">
                {streams.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
              <SourcesList />
            </div>
          </div>
        )}
      </div>

      {/* Playback Choice Modal */}
      {promptStream && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/80 backdrop-blur-xl p-4">
          <div className="glass-panel w-full max-w-lg flex flex-col border border-white/20 shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setPromptStream(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X size={24} />
            </button>
            <div className="relative z-10 p-6 md:p-10 w-full">
              <div className="w-16 h-16 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mb-6">
                <ExternalLink size={32} className="text-[var(--primary)]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-md">
                Open External Player
              </h3>
              <p className="text-gray-300 font-medium text-sm md:text-base mb-8 leading-relaxed">
                This will open an external video player such as VLC or your default torrent client to play this source.
              </p>
              
              <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => setDontShowAgain(!dontShowAgain)}>
                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${dontShowAgain ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-gray-500 group-hover:border-white'}`}>
                  {dontShowAgain && <Check size={16} className="text-[var(--primary-text)]" />}
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                  Don't show this popup again
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmPlay}
                  className="bg-[var(--primary)] text-[var(--primary-text)] font-black uppercase tracking-widest py-4 px-6 hover:bg-white transition-all flex justify-center items-center rounded-xl shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_20%,transparent)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  Open External Player
                </button>
                
                {promptStream && (
                  <div className="mt-2 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Fallback Link</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={promptStream.url || `magnet:?xt=urn:btih:${promptStream.infoHash}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`}
                        className="flex-1 bg-[#050505] text-xs text-gray-300 px-4 py-3 rounded-xl border border-white/10 outline-none font-mono"
                      />
                      <button
                        onClick={() => {
                          const link = promptStream.url || `magnet:?xt=urn:btih:${promptStream.infoHash}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`;
                          navigator.clipboard.writeText(link);
                        }}
                        className="bg-white/10 hover:bg-[var(--primary)] hover:text-[var(--primary-text)] transition-colors p-3 rounded-xl text-white flex-shrink-0"
                        title="Copy Link"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setPromptStream(null)}
                  className="mt-2 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors text-xs md:text-sm text-center py-4 rounded-xl border border-transparent hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
