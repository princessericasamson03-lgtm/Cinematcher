
export enum TimeOption {
  VELOCE = "Veloce (30-60 min)",
  FILM_STANDARD = "Film standard (90-120 min)",
  FILM_LUNGO = "Film lungo (2-3 ore)",
  MINISERIE = "Miniserie (3-6 ore)",
  WEEKEND = "Weekend (6-12 ore)",
  MARATONA_LUNGA = "Maratona lunga (12-24 ore)",
  SERIE_LUNGA = "Serie lunga (24+ ore)",
  FLESSIBILE = "Flessibile"
}

export interface TechnicalDetails {
  director: string;
  cast: string[];
  durationOrSeasons: string;
  rating: string;
}

export interface Recommendation {
  title: string;
  originalTitle?: string;
  year: string;
  type: string;
  country: string;
  genre: string;
  totalDuration: string;
  timeNeeded: string;
  suggestedPacing: string;
  reason: string;
  plot: string;
  technicalDetails: TechnicalDetails;
  whereToWatch: string;
  trailerUrl: string;
  posterUrl: string;
}

export interface CineMatcherResponse {
  recommendations: Recommendation[];
  comparativeExplanation: string;
  timeManagement: string;
}
