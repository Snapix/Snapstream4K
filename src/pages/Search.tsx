import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchSearch } from '../lib/api';
import { Search as SearchIcon, Play, Loader2 } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputQuery, setInputQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);
    const res = await fetchSearch(q);
    setResults(res);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 min-h-full">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 md:mb-10 text-white flex items-center gap-4">
          <SearchIcon size={36} className="text-primary" />
          Search
        </h1>
        
        <form onSubmit={handleSubmit} className="relative mb-12 md:mb-16 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Movies, Series, Actors..."
              className="w-full bg-[#111] border border-white/10 focus:border-primary rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-lg md:text-xl text-white font-bold focus:outline-none transition-all placeholder-gray-600 shadow-inner"
              autoFocus
            />
            <SearchIcon className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
          </div>
          <button 
            type="submit"
            className="bg-primary text-primary-text px-8 md:px-10 py-4 md:py-5 font-black uppercase tracking-widest hover:bg-white transition-all rounded-2xl shrink-0 shadow-[0_0_20px_rgba(155,240,11,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-sm md:text-base w-full sm:w-auto"
          >
            Search DB
          </button>
        </form>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 text-gray-400">
            <Loader2 size={64} className="animate-spin mb-6 text-primary" />
            <p className="font-bold tracking-widest uppercase text-sm md:text-base">Querying Library...</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-20 md:py-32 glass-panel">
            <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase text-gray-300">No Results Found</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs md:text-sm">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item) => (
              <Link 
                key={item.id} 
                to={`/details/${item.type}/${encodeURIComponent(item.id)}`}
                className="group relative focus:outline-none aspect-[2/3]"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
