import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMeta } from '../lib/api';
import { Play, ArrowLeft, Loader2, Calendar, Clock, Film } from 'lucide-react';

export default function Details() {
  const { type, id } = useParams<{ type: 'movie' | 'series'; id: string }>();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadMeta() {
      if (type && id) {
        setLoading(true);
        try {
          const data = await fetchMeta(type, decodeURIComponent(id));
          if (mounted) {
            setMeta(data);
            setLoading(false);
          }
        } catch (err) {
          if (mounted) setLoading(false);
        }
      }
    }
    loadMeta();
    return () => { mounted = false; };
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 size={64} className="animate-spin text-primary mb-6" />
        <p className="font-black uppercase tracking-widest text-gray-400 text-sm md:text-base">Fetching Details...</p>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#050505] p-6">
        <div className="glass-panel p-12 text-center max-w-lg">
          <p className="font-black text-2xl md:text-4xl uppercase tracking-widest text-red-500 mb-8">Load Failed</p>
          <button onClick={() => navigate(-1)} className="bg-white/10 text-white px-8 md:px-10 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-2xl w-full text-xs md:text-sm border border-white/20">Return to Safety</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Backdrop */}
      <div className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] bg-[#111] mx-4 md:mx-8 lg:mx-12 mt-4 md:mt-6 rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/5">
        <div className="absolute inset-0">
          <img 
            src={meta.background || meta.poster} 
            alt={meta.name} 
            className="w-full h-full object-cover opacity-40 md:opacity-50 blur-[4px] md:blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 -mt-32 md:-mt-48 relative z-10 pb-24">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 md:mb-10 inline-flex items-center gap-2 text-white font-black uppercase tracking-widest hover:text-primary transition-colors bg-white/5 backdrop-blur-md border border-white/10 px-5 md:px-6 py-2 md:py-3 rounded-full hover:bg-white/10 text-xs md:text-sm"
        >
          <ArrowLeft size={16} className="md:w-5 md:h-5"/>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Poster */}
          <div className="w-48 sm:w-64 md:w-80 shrink-0 mx-auto lg:mx-0">
            <div className="poster-card shadow-2xl">
              <img 
                src={meta.poster} 
                alt={meta.name} 
                className="w-full h-auto rounded-[16px]"
              />
            </div>
          </div>

          {/* Info */}
          <div className="pt-4 md:pt-12 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-none drop-shadow-lg">
              {meta.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 text-xs md:text-sm font-bold text-gray-300 mb-6 md:mb-8 uppercase tracking-widest">
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm"><Calendar size={14} className="md:w-4 md:h-4 text-primary"/> {meta.year}</span>
              {meta.runtime && <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm"><Clock size={14} className="md:w-4 md:h-4 text-primary"/> {meta.runtime}</span>}
              <span className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm"><Film size={14} className="md:w-4 md:h-4"/> {meta.type}</span>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mb-8 md:mb-10">
              {meta.genres && meta.genres.map((genre: string) => (
                <span key={genre} className="bg-white/10 px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-300 rounded-xl backdrop-blur-sm">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-sm sm:text-base md:text-xl font-medium mb-10 md:mb-12 max-w-4xl leading-relaxed mx-auto lg:mx-0">
              {meta.description}
            </p>

            {meta.type === 'movie' && (
              <Link
                to={`/watch/movie/${meta.imdb_id || meta.id}`}
                className="inline-flex items-center justify-center gap-3 md:gap-4 bg-primary text-primary-text px-8 md:px-10 py-4 md:py-5 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all text-sm md:text-lg rounded-2xl shadow-[0_0_30px_rgba(155,240,11,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] w-full sm:w-auto"
              >
                <Play size={20} className="md:w-6 md:h-6" fill="currentColor" />
                Find Sources
              </Link>
            )}
          </div>
        </div>

        {/* Episodes for Series */}
        {meta.type === 'series' && meta.videos && meta.videos.length > 0 && (
          <div className="mt-20 md:mt-32">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 md:mb-10 text-white flex items-center gap-3 md:gap-4 border-l-4 border-primary pl-4">
              Episodes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {meta.videos.map((video: any) => (
                <Link
                  key={video.id}
                  to={`/watch/series/${meta.imdb_id || meta.id}:${video.season}:${video.episode}`}
                  className="group relative glass-panel p-5 md:p-6 hover:border-primary/50 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(155,240,11,0.15)] overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="bg-white/10 text-white font-black px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs tracking-widest uppercase rounded-xl backdrop-blur-md">
                      S{String(video.season).padStart(2, '0')} E{String(video.episode).padStart(2, '0')}
                    </div>
                    <div className="bg-black/50 p-2 md:p-3 rounded-full group-hover:bg-primary transition-colors border border-white/10 group-hover:border-transparent">
                      <Play size={16} className="md:w-5 md:h-5 text-white group-hover:text-primary-text" fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="font-black text-lg md:text-xl text-white group-hover:text-primary transition-colors mb-2 line-clamp-1 pr-4">
                    {video.name || `Episode ${video.episode}`}
                  </h3>
                  {video.released && (
                    <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-500">
                      {new Date(video.released).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
