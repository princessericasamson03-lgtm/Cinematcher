
import React from 'react';
import { 
  Zap, 
  Film, 
  Clock, 
  Tv, 
  Popcorn, 
  Tent, 
  Target, 
  RefreshCw 
} from 'lucide-react';
import { TimeOption } from './types';

export const TIME_OPTIONS_CONFIG = [
  { id: TimeOption.VELOCE, label: "⚡ Veloce", desc: "30-60 min", icon: <Zap className="w-5 h-5" /> },
  { id: TimeOption.FILM_STANDARD, label: "🎬 Film Standard", desc: "90-120 min", icon: <Film className="w-5 h-5" /> },
  { id: TimeOption.FILM_LUNGO, label: "🎭 Film Lungo", desc: "2-3 ore", icon: <Clock className="w-5 h-5" /> },
  { id: TimeOption.MINISERIE, label: "📺 Miniserie", desc: "3-6 ore", icon: <Tv className="w-5 h-5" /> },
  { id: TimeOption.WEEKEND, label: "🍿 Weekend", desc: "6-12 ore", icon: <Popcorn className="w-5 h-5" /> },
  { id: TimeOption.MARATONA_LUNGA, label: "🎪 Maratona", desc: "12-24 ore", icon: <Tent className="w-5 h-5" /> },
  { id: TimeOption.SERIE_LUNGA, label: "🎯 Serie Lunga", desc: "24+ ore", icon: <Target className="w-5 h-5" /> },
  { id: TimeOption.FLESSIBILE, label: "🔄 Flessibile", desc: "Scegli tu", icon: <RefreshCw className="w-5 h-5" /> },
];

export const SURPRISE_ELEMENTS = [
  "Cyberpunk", "Misterioso", "Anni 80", "Noir", "Distopico", 
  "Inseguimenti", "Paranoia", "Plot Twist", "Venezia", "Noir",
  "Spaziale", "Introspettivo", "Violento", "Sognante", "Tecnologico",
  "Dramma familiare", "Vendetta", "Amore proibito", "Magia", "Post-apocalittico"
];
