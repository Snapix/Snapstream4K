import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCatalog } from '../lib/api';
import { Play, Loader2, Info, TrendingUp, Star, Calendar } from 'lucide-react';

interface Meta {
  id: string;
  imdb_id?: string;
  name: string;
  poster: string;
  background?: string;
  year?: string;
  type: 'movie' | 'series';
  description?: string;
}

interface Catalog {
  title: string;
  items: Meta[];
  icon: any;
  loading: boolean;
}

export default function Home() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([
    { title: "Trending Movies", items: [], icon: <TrendingUp size={24} className="text-primary" />, loading: true },
    { title: "Trending Series", items: [], icon: <TrendingUp size={24} className="text-primary" />, loading: true },
    { title: "Popular Movies", items: [], icon: <Star size={24} className="text-primary" />, loading: true },
    { title: "Popular Series", items: [], icon: <Star size={24} className="text-primary" />, loading: true },
    { title: "New Releases", items: [], icon: <Calendar size={24} className="text-primary" />, loading: true },
    { title: "Top Rated Movies", items: [], icon: <Star size={24} className="text-primary" />, loading: true },
  ]);
  const [heroMovie, setHeroMovie] = useState<Meta | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCatalog = async (index: number, type: 'movie' | 'series', id: string, setHero: boolean, skip = 0) => {
      try {
        const items = await fetchCatalog(type, id, skip);
        if (mounted) {
          setCatalogs(prev => {
            const next = [...prev];
            next[index] = { ...next[index], items, loading: false };
            return next;
          });
          if (setHero && items.length > 0 && !heroMovie) {
            setHeroMovie(items[0]);
          }
        }
      } catch (err) {
        if (mounted) {
          setCatalogs(prev => {
            const next = [...prev];
            next[index] = { ...next[index], loading: false };
            return next;
          });
        }
      }
    };

    loadCatalog(0, 'movie', 'tmdb.trending', true);
    loadCatalog(1, 'series', 'tmdb.trending', false);
    loadCatalog(2, 'movie', 'tmdb.top', false);
    loadCatalog(3, 'series', 'tmdb.top', false);
    loadCatalog(4, 'movie', 'tmdb.year', false);
    loadCatalog(5, 'movie', 'tmdb.top', false, 1); // skip 1 to show different top movies

    return () => { mounted = false; };
  }, []);

  return (
    <div className="pb-24 px-4 md:px-8 lg:px-12">
      {!heroMovie && catalogs[0].loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
           <Loader2 size={64} className="animate-spin text-primary mb-4" />
           <p className="font-bold tracking-widest uppercase text-gray-500 text-sm md:text-base">Loading Catalogs...</p>
        </div>
      ) : heroMovie ? (
        <div className="relative w-full h-[50vh] md:h-[70vh] flex items-end bg-[#0a0a0c] mb-12 md:mb-20 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
          <div className="absolute inset-0">
            <img 
              src={heroMovie.background || heroMovie.poster} 
              alt={heroMovie.name} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full md:w-3/4 lg:w-1/2" />
          </div>
          
          <div className="relative z-10 p-6 md:p-16 max-w-3xl w-full">
            <span className="inline-block glass-panel text-primary font-bold px-4 py-1.5 text-[10px] md:text-xs tracking-widest mb-4 md:mb-6 uppercase rounded-full">
              Featured {heroMovie.type}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-none text-white drop-shadow-2xl">
              {heroMovie.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-bold text-gray-300 mb-4 md:mb-6 uppercase tracking-wider">
              <span className="glass-panel px-3 py-1 rounded-full">{heroMovie.year}</span>
              <span className="glass-panel px-3 py-1 rounded-full">{heroMovie.type}</span>
            </div>
            <p className="text-gray-400 text-sm md:text-lg font-medium mb-6 md:mb-10 line-clamp-2 md:line-clamp-3 max-w-2xl">
              {heroMovie.description}
            </p>
            <div className="flex gap-4">
              <Link 
                to={`/details/${heroMovie.type}/${encodeURIComponent(heroMovie.id)}`}
                className="inline-flex items-center gap-2 md:gap-3 bg-primary text-primary-text px-6 md:px-8 py-3 md:py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-2xl shadow-[0_0_30px_rgba(155,240,11,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] text-sm md:text-base"
              >
                <Play size={20} fill="currentColor" />
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-12 md:gap-20">
        {catalogs.map((catalog, idx) => (
          <CatalogRow key={idx} title={catalog.title} items={catalog.items} icon={catalog.icon} loading={catalog.loading} />
        ))}
      </div>
    </div>
  );
}

function CatalogRow({ title, items, icon, loading }: { title: string; items: Meta[]; icon: any; loading: boolean; key?: React.Key }) {
  if (!loading && (!items || items.length === 0)) return null;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
        {icon}
        {title}
      </h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-1 scrollbar-hide snap-x">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-[140px] md:w-[200px] aspect-[2/3] snap-start bg-[#111] animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : (
          items.map((item) => (
            <Link 
              key={item.id} 
              to={`/details/${item.type}/${encodeURIComponent(item.id)}`}
              className="flex-none w-[140px] md:w-[200px] aspect-[2/3] group relative focus:outline-none snap-start"
            >
              <div className="poster-card w-full h-full border-none rounded-xl overflow-hidden shadow-md">
                {item.poster ? (
                  <img 
                    src={item.poster} 
                    alt={item.name} 
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-[#111] flex items-center justify-center p-4 text-center">
                    <span className="font-bold text-gray-500 uppercase text-xs">{item.name}</span>
                  </div>
                )}
                
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                
                <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end text-white">
                  <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="bg-primary p-3 md:p-4 rounded-full text-primary-text shadow-xl">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  
                  <div className="relative z-30 pointer-events-none">
                    <h3 className="font-black text-sm md:text-base leading-tight text-white drop-shadow-md line-clamp-2">{item.name}</h3>
                    {item.year && <p className="text-[10px] md:text-xs text-gray-300 font-bold mt-1">{item.year}</p>}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
