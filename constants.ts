

import { Product } from './types';

export const WHATSAPP_NUMBER = "989122050669";
export const TELEGRAM_LINK = "https://t.me/+8ETRinn0OhdiNDZk";
export const EMAIL_ADDRESS = "tehranrecords@gmail.com";
export const HERO_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/Tehran%20Records.mp4";
export const FREE_MUSIC_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/Sean%20and%20Aria%20Music%20Studio.mp4";
export const RARITY_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/Led%20Zeppelin.mp4";
export const ABOUT_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/Beatles.mp4";
export const CONTACT_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/TEHRAN%20RECORDS%201.mp4";
export const GENRES_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/GENRES.mp4";
export const OWNER_VIDEO_URL = "https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/MR.RAHMANI.mp4";

export const IMAGES = {
  aboutHero: "https://images.unsplash.com/photo-1542208998-f6dbbb566226?q=80&w=2000&auto=format&fit=crop",
  showroom: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1920&auto=format&fit=crop",
  rarities: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1920&auto=format&fit=crop",
  contact: "https://images.unsplash.com/photo-1594434533760-02e0f3faaa68?q=80&w=2000&auto=format&fit=crop",
  genres: {
    hiphop: "https://images.unsplash.com/photo-1619983081593-e2ba5b543e60?q=80&w=800&auto=format&fit=crop",
    rock: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=800&auto=format&fit=crop",
    jazz: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    pop: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop",
    metal: "https://images.unsplash.com/photo-1576435728678-38d01d52e38b?q=80&w=800&auto=format&fit=crop",
    soundtracks: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    soul: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    blues: "https://images.unsplash.com/photo-1525926477800-7a3be5800ecb?q=80&w=800&auto=format&fit=crop",
    reggae: "https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?q=80&w=800&auto=format&fit=crop",
    electronic: "https://images.unsplash.com/photo-1558470598-a5dda9640f6b?q=80&w=800&auto=format&fit=crop",
    world: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop",
    experimental: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=800&auto=format&fit=crop"
  }
};

// Extracted and curated from the provided text data
export const PRODUCTS: Product[] = [
  {
    id: "1",
    artist: "Mac Miller",
    album: "Swimming",
    price: 32.00,
    originalPrice: 32.00,
    coverImage: "https://vinyl.com/cdn/shop/files/8448090997041_85quality_Mac_Miller_-_Swimming_2LP.webp?v=1734325758&width=600",
    condition: "Mint",
    rarity: "Common",
    genre: "Hip-hop / Rap",
    year: "2018",
    description: "2LP set. Mac Miller's fifth studio album. A modern classic.",
    format: "2LP"
  },
  {
    id: "2",
    artist: "Pink Floyd",
    album: "The Dark Side Of The Moon",
    price: 34.99,
    coverImage: "https://vinyl.com/cdn/shop/files/9089832321329_85quality_DARK-SIDE-50_1024x1024_9bcc2782-a4d8-46b4-961e-8f28edab9858.webp?v=1734325789&width=600",
    condition: "Near Mint",
    rarity: "Rare",
    genre: "Rock",
    year: "1973",
    description: "50th Anniversary Edition. The masterpiece of progressive rock.",
    format: "LP"
  },
  {
    id: "3",
    artist: "SZA",
    album: "CTRL",
    price: 29.99,
    originalPrice: 29.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258503573809_85quality_SZA_vinyl_ctrl_2LP.webp?v=1734325779&width=600",
    condition: "Mint",
    rarity: "Common",
    genre: "Soul / R&B",
    year: "2017",
    description: "Green 2LP. SZA's critically acclaimed debut album.",
    format: "2LP"
  },
  {
    id: "4",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    price: 29.99,
    coverImage: "https://vinyl.com/cdn/shop/files/9095824376113_85quality_led-zeppelin-led-zeppelin-iv-clear-vinyl-atl75-vinyl-lp.webp?v=1734325732&width=600",
    condition: "Mint",
    rarity: "Rare",
    genre: "Rock",
    year: "1971",
    description: "ATL75 Edition on Clear Vinyl. Includes 'Stairway to Heaven'.",
    format: "LP"
  },
  {
    id: "5",
    artist: "Tyler Childers",
    album: "Purgatory",
    price: 21.99,
    originalPrice: 21.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258506031409_85quality_Tyler_Childers_-_Purgatory.webp?v=1734325785&width=600",
    condition: "Very Good+",
    rarity: "Common",
    genre: "Country",
    year: "2017",
    description: "Breakout album produced by Sturgill Simpson.",
    format: "LP"
  },
  {
    id: "6",
    artist: "Daft Punk",
    album: "Tron: Legacy",
    price: 34.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8335096119601_85quality_daft-punk-tron-legacy-vinyl-141307-0-1657065437.webp?v=1734325769&width=600",
    condition: "Mint",
    rarity: "Very Rare",
    genre: "Soundtracks",
    year: "2010",
    description: "Original Motion Picture Soundtrack. 2LP Set.",
    format: "2LP"
  },
  {
    id: "7",
    artist: "Dr. Dre",
    album: "2001",
    price: 34.99,
    originalPrice: 34.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258496692529_85quality_Dr_Dre_-_2001_2LP.webp?v=1734325735&width=600",
    condition: "Near Mint",
    rarity: "Common",
    genre: "Hip-hop / Rap",
    year: "1999",
    description: "The iconic sequel to The Chronic. 2LP.",
    format: "2LP"
  },
  {
    id: "8",
    artist: "Norah Jones",
    album: "Come Away With Me",
    price: 29.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258504589617_85quality_NJ_CAWM_PROD_SHOT_1024x1024_52585d27-597d-4c7a-955c-6c4b40493837.webp?v=1734325742&width=600",
    condition: "Mint",
    rarity: "Common",
    genre: "Jazz",
    year: "2002",
    description: "20th Anniversary Edition. A jazz-pop masterpiece.",
    format: "LP"
  },
  {
    id: "9",
    artist: "Tame Impala",
    album: "Currents",
    price: 37.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258511339825_85quality_Tame_Impala_-_Currents_2LP.webp?v=1734325796&width=600",
    condition: "Mint",
    rarity: "Common",
    genre: "Dance / EDM",
    year: "2015",
    description: "2LP. A psychedelic pop journey.",
    format: "2LP"
  },
  {
    id: "10",
    artist: "Fleetwood Mac",
    album: "Greatest Hits",
    price: 25.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258513928497_85quality_Fleetwood_Mac_-_Greatest_Hits_1975_-_1988.webp?v=1734325758&width=600",
    condition: "Very Good+",
    rarity: "Common",
    genre: "Pop",
    year: "1988",
    description: "Essential collection from 1975-1988.",
    format: "LP"
  },
  {
    id: "11",
    artist: "Green Day",
    album: "Dookie",
    price: 27.99,
    coverImage: "https://vinyl.com/cdn/shop/files/9036791939377_85quality_green_day_dookie_30th_anniversary_blue_vinyl.webp?v=1734325776&width=600",
    condition: "Mint",
    rarity: "Rare",
    genre: "Punk",
    year: "1994",
    description: "30th Anniversary Edition on Baby Blue Vinyl.",
    format: "LP"
  },
  {
    id: "12",
    artist: "Metallica",
    album: "Master Of Puppets",
    price: 29.99,
    coverImage: "https://vinyl.com/cdn/shop/files/8258502361393_85quality_metallica_master_of_puppets_vinyl.webp?v=1734325749&width=600",
    condition: "Good",
    rarity: "Common",
    genre: "Metal",
    year: "1986",
    description: "Thrash metal essential.",
    format: "LP"
  }
];