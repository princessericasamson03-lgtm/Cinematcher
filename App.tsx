
import React, { useState, useEffect, useRef } from 'react';
import { 
  Clapperboard, 
  Search, 
  Sparkles, 
  History, 
  Trash2, 
  ExternalLink, 
  Play, 
  Bookmark, 
  BookmarkCheck,
  ChevronDown,
  Info,
  Loader2,
  Clock,
  Zap
} from 'lucide-react';
import { TimeOption, Recommendation, CineMatcherResponse } from './types';
import { TIME_OPTIONS_CONFIG, SURPRISE_ELEMENTS } from './constants';
import { getCineMatch } from './services/geminiService';

const App: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<TimeOption | "">("");
  const [elements, setElements] = useState<string[]>(Array(10).fill(""));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CineMatcherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<Recommendation[]>([]);
  const [history, setHistory] = useState<CineMatcherResponse[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('cineMatcher_watchlist');
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));

    const savedHistory = localStorage.getItem('cineMatcher_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('cineMatcher_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cineMatcher_history', JSON.stringify(history));
  }, [history]);

  const handleElementChange = (index: number, value: string) => {
    const newElements = [...elements];
    newElements[index] = value;
    setElements(newElements);
  };

  const handleSurpriseMe = () => {
    const shuffled = [...SURPRISE_ELEMENTS].sort(() => 0.5 - Math.random());
    setElements(shuffled.slice(0, 10));
    const randomTimeKeys = Object.values(TimeOption);
    setSelectedTime(randomTimeKeys[Math.floor(Math.random() * randomTimeKeys.length)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setError("Hero, abbiamo bisogno del tuo tempo disponibile!");
      return;
    }

    // Filtriamo solo gli elementi non vuoti
    const activeElements = elements.filter(el => el.trim().length > 0);
    
    if (activeElements.length === 0) {
      setError("Dimmi almeno una cosa che cerchi per iniziare la missione!");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await getCineMatch(selectedTime as TimeOption, activeElements);
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 10));
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Un villain ha interrotto la connessione. Riprova!");
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (rec: Recommendation) => {
    const exists = watchlist.find(w => w.title === rec.title);
    if (exists) {
      setWatchlist(watchlist.filter(w => w.title !== rec.title));
    } else {
      setWatchlist([...watchlist, rec]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cineMatcher_history');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-[#c9302c] p-2 comic-border rotate-[-3deg] group-hover:rotate-0 transition-transform">
              <Clapperboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-black tracking-tighter uppercase italic">
              CineMatcher <span className="text-yellow-400">AI</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
            >
              <History className="w-6 h-6" />
              {history.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 border-2 border-black rounded-full"></span>}
            </button>
            <button 
              className="hidden md:flex items-center space-x-2 bg-yellow-400 text-black comic-border px-4 py-1 font-bold text-sm hover:translate-y-[-2px] transition-transform"
              onClick={() => resultsRef.current?.scrollIntoView({behavior: 'smooth'})}
            >
              <Bookmark className="w-4 h-4" />
              <span>Watchlist ({watchlist.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-32">
        {/* Hero */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block bg-[#c9302c] text-white font-black text-xs px-3 py-1 comic-border mb-2 rotate-1">
            MISSIONE: TROVA IL TUO FILM
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-black leading-none italic uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_#c9302c]">
            Il Tuo Match <br />
            <span className="text-yellow-400">Cinematografico.</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium bg-black/40 p-4 rounded-xl border-l-4 border-yellow-400">
            "Ciao! Sono CineMatcher AI, il tuo consulente super-eroistico. Dimmi il tuo tempo e qualche indizio, e scoverò il capolavoro perfetto."
          </p>
        </div>

        {/* Form Section */}
        <section className="glass rounded-none p-8 shadow-2xl relative overflow-hidden border-4 border-black">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] -z-10"></div>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Time */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <span className="flex items-center justify-center w-10 h-10 bg-yellow-400 text-black comic-border font-black text-xl rotate-[-5deg]">1</span>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Quanto tempo hai, Eroe?</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TIME_OPTIONS_CONFIG.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTime(opt.id)}
                    className={`p-4 flex flex-col items-center justify-center space-y-2 border-4 transition-all marvel-pop ${
                      selectedTime === opt.id 
                      ? 'border-yellow-400 bg-yellow-400/20 rotate-1' 
                      : 'border-black bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className={selectedTime === opt.id ? 'text-yellow-400' : 'text-gray-400'}>
                      {opt.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Elements */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-10 h-10 bg-[#c9302c] text-white comic-border font-black text-xl rotate-[5deg]">2</span>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Indizi per la ricerca</h3>
                </div>
                <button 
                  type="button"
                  onClick={handleSurpriseMe}
                  className="bg-white text-black text-[10px] font-black uppercase comic-border px-3 py-1 hover:bg-yellow-400 transition-colors"
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Sorprendimi!
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-6 font-bold italic border-l-2 border-[#c9302c] pl-4">Non serve riempirli tutti! Dimmi solo cosa ti ispira oggi.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elements.map((el, i) => (
                  <div key={i} className="relative">
                    <input
                      type="text"
                      placeholder={i === 0 ? "Es: Noir" : i === 1 ? "Es: Marvel style" : `Altro indizio...`}
                      value={el}
                      onChange={(e) => handleElementChange(i, e.target.value)}
                      className="w-full bg-white/5 border-2 border-black rounded-none px-4 py-3 focus:outline-none focus:border-yellow-400 transition-all font-bold placeholder:text-gray-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-700 font-black">#{i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-600 text-white font-black uppercase italic text-xs comic-border flex items-center space-x-3 animate-bounce">
                <Zap className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* CTA */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#c9302c] text-white font-black text-2xl uppercase italic tracking-tighter comic-border shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all flex items-center justify-center space-x-4 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>Scansione in corso...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-8 h-8" />
                    <span>LANCIA IL MATCH!</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        {result && (
          <section ref={resultsRef} className="mt-32 space-y-20">
            <div className="text-center">
              <div className="inline-block bg-yellow-400 text-black font-black text-sm px-4 py-1 comic-border mb-4 rotate-[-2deg]">
                RISULTATI DELLA MISSIONE
              </div>
              <h2 className="text-5xl font-serif font-black italic uppercase tracking-tighter">I Tuoi Tre Match</h2>
            </div>

            <div className="grid grid-cols-1 gap-20">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="glass rounded-none overflow-hidden flex flex-col md:flex-row group border-4 border-black relative">
                  {/* Numero di classifica stile fumetto */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-400 text-black border-4 border-black flex items-center justify-center font-black text-3xl rotate-[-15deg] z-20">
                    {i+1}
                  </div>

                  {/* Poster Side */}
                  <div className="md:w-1/3 relative h-96 md:h-auto overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black">
                    <img 
                      src={rec.posterUrl || `https://picsum.photos/400/600?random=${i}`} 
                      alt={rec.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#c9302c] text-white text-[10px] font-black uppercase border-2 border-black">
                          {rec.type}
                        </span>
                        <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase border-2 border-black">
                          {rec.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Side */}
                  <div className="md:w-2/3 p-10 flex flex-col justify-between bg-white/5">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-4xl font-serif font-black mb-2 leading-none uppercase italic tracking-tighter">
                            {rec.title}
                          </h3>
                          <p className="text-yellow-400 font-black uppercase text-xs tracking-widest">{rec.year} • {rec.genre}</p>
                        </div>
                        <button 
                          onClick={() => toggleWatchlist(rec)}
                          className="p-3 bg-black border-2 border-white/20 hover:border-yellow-400 transition-all"
                        >
                          {watchlist.find(w => w.title === rec.title) ? (
                            <BookmarkCheck className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <Bookmark className="w-6 h-6 text-white" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-black border-2 border-white/10">
                          <p className="text-[10px] uppercase font-black text-gray-500 mb-1">DURATA</p>
                          <p className="text-sm font-black italic">{rec.totalDuration}</p>
                        </div>
                        <div className="p-4 bg-black border-2 border-white/10">
                          <p className="text-[10px] uppercase font-black text-gray-500 mb-1">IMPEGNO</p>
                          <p className="text-sm font-black italic">{rec.timeNeeded}</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-xs font-black uppercase text-yellow-400 tracking-[0.2em] mb-3 flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          PERCHÉ LO ADORERAI
                        </h4>
                        <p className="text-sm text-gray-200 leading-relaxed font-medium italic border-l-4 border-yellow-400 pl-4">{rec.reason}</p>
                      </div>

                      <div className="mb-10">
                        <h4 className="text-xs font-black uppercase text-gray-500 tracking-[0.2em] mb-3">SINTESI MISSIONE</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                          {rec.plot}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y-2 border-white/5 mb-10">
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-600 mb-1">REGIA</p>
                          <p className="text-xs font-black italic">{rec.technicalDetails.director}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] uppercase font-black text-gray-600 mb-1">CAST</p>
                          <p className="text-xs font-black italic line-clamp-1">{rec.technicalDetails.cast[0]}, {rec.technicalDetails.cast[1]}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-600 mb-1">RATING</p>
                          <p className="text-xs font-black italic text-yellow-400">★ {rec.technicalDetails.rating}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-600 mb-1">STREAMING</p>
                          <p className="text-xs font-black italic truncate">{rec.whereToWatch}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href={rec.trailerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-4 bg-[#c9302c] text-white font-black uppercase italic comic-border flex items-center justify-center space-x-2 hover:translate-y-[-2px] transition-all"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        <span>Guarda Trailer</span>
                      </a>
                      <div className="flex-1 py-4 px-6 border-4 border-black bg-white/5 flex items-center justify-center space-x-2 text-[11px] font-black uppercase italic text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>{rec.suggestedPacing}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Footer */}
            <div className="glass rounded-none p-12 border-4 border-black relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                   <h3 className="text-3xl font-serif font-black italic uppercase tracking-tighter mb-6">Analisi Tattica</h3>
                   <p className="text-gray-300 text-sm leading-relaxed font-medium italic">{result.comparativeExplanation}</p>
                 </div>
                 <div>
                   <h3 className="text-3xl font-serif font-black italic uppercase tracking-tighter mb-6">Logistica Temporale</h3>
                   <p className="text-gray-300 text-sm leading-relaxed font-medium italic">{result.timeManagement}</p>
                 </div>
               </div>
               <div className="mt-12 pt-10 border-t-4 border-black text-center">
                 <p className="text-yellow-400 font-black uppercase text-sm mb-6 italic tracking-widest">Pronto per una nuova avventura?</p>
                 <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="px-10 py-4 bg-white text-black font-black uppercase italic comic-border hover:bg-yellow-400 transition-colors"
                 >
                   Ricomincia Missione
                 </button>
               </div>
            </div>
          </section>
        )}

        {/* Watchlist Mini Drawer */}
        {watchlist.length > 0 && (
          <div className="mt-32 border-t-4 border-black pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-serif font-black italic uppercase tracking-tighter">La Tua Base Operativa</h2>
              <span className="bg-yellow-400 text-black px-3 py-1 font-black uppercase text-xs comic-border">{watchlist.length} Salvati</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {watchlist.map((item, idx) => (
                <div key={idx} className="group relative aspect-[2/3] comic-border overflow-hidden bg-black">
                   <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                   <div className="absolute inset-0 bg-[#c9302c]/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <h4 className="font-serif font-black text-sm mb-4 uppercase italic leading-none">{item.title}</h4>
                      <button 
                        onClick={() => toggleWatchlist(item)}
                        className="p-3 bg-black text-white rounded-none border-2 border-white/50 hover:bg-white hover:text-black transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* History Drawer Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0a1128] h-full border-l-4 border-black shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-serif font-black uppercase italic tracking-tighter">Archivio Missioni</h3>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-none border-2 border-white/20">
                <ChevronDown className="w-6 h-6 rotate-[-90deg]" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <History className="w-20 h-20 mx-auto mb-6" />
                <p className="font-black uppercase italic">Nessun dato registrato</p>
              </div>
            ) : (
              <div className="space-y-8">
                <button 
                  onClick={clearHistory}
                  className="w-full py-3 text-xs font-black uppercase italic text-red-500 border-2 border-red-500/30 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Elimina Archivio</span>
                </button>
                {history.map((h, i) => (
                  <div 
                    key={i} 
                    className="p-6 bg-white/5 border-2 border-black hover:border-yellow-400 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => {
                      setResult(h);
                      setShowHistory(false);
                      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-2">
                       <div className="flex -space-x-4">
                         {h.recommendations.map((r, ri) => (
                           <img key={ri} src={r.posterUrl} className="w-10 h-14 border-2 border-black object-cover rotate-[-5deg] group-hover:rotate-0 transition-transform" />
                         ))}
                       </div>
                       <div className="flex-1 pl-4">
                          <p className="text-sm font-black italic uppercase truncate text-yellow-400">{h.recommendations[0].title}</p>
                          <p className="text-[10px] font-black uppercase text-gray-500 italic">Rapporto Missione #{history.length - i}</p>
                       </div>
                       <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-yellow-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-40 py-24 border-t-8 border-black bg-[#05091a]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-10">
            <div className="bg-yellow-400 p-2 comic-border rotate-3">
              <Clapperboard className="w-8 h-8 text-black" />
            </div>
            <span className="font-serif text-4xl font-black uppercase italic tracking-tighter">CineMatcher <span className="text-yellow-400">AI</span></span>
          </div>
          <p className="text-gray-500 text-sm mb-12 italic font-bold max-w-lg mx-auto leading-relaxed">
            "Da grandi poteri derivano grandi raccomandazioni cinematografiche."
          </p>
          <div className="flex justify-center space-x-10 mb-16">
            {['Instagram', 'Twitter', 'Letterboxd'].map(social => (
              <a key={social} href="#" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors border-b-2 border-transparent hover:border-yellow-400 pb-1">{social}</a>
            ))}
          </div>
          <p className="text-[10px] text-gray-700 font-black uppercase italic tracking-[0.4em]">
            © 2024 CineMatcher AI • Realizzato nella Bat-Caverna
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
