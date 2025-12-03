export interface Product {
  id: string;
  artist: string;
  album: string;
  price: number;
  originalPrice?: number; // For sales
  coverImage: string;
  condition: 'Mint' | 'Near Mint' | 'Very Good+' | 'Good';
  rarity: 'Common' | 'Rare' | 'Very Rare' | 'One-of-a-kind';
  genre: string;
  year: string;
  description: string;
  audioPreview?: string; // URL
  format: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum FilterType {
  ALL = 'All',
  HIP_HOP = 'Hip-hop / Rap',
  ROCK = 'Rock',
  JAZZ = 'Jazz',
  POP = 'Pop',
  METAL = 'Metal',
  SOUNDTRACKS = 'Soundtracks'
}
