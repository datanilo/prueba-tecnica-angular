export interface Artist {
  id: string;
  name: string;
  images: Image[];
  followers: {
    total: number;
  };
  genres: string[];
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
  release_date: string;
  artists: Artist[];
}

export interface Track {
  id: string;
  name: string;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Image[];
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
    items?: {
      track: Track;
    }[];
  };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  images: Image[];
  email: string;
}

export interface SearchResponse {
  artists: {
    items: Artist[];
  };
}

export interface ArtistAlbumsResponse {
  items: Album[];
}

export interface AlbumTracksResponse {
  items: Track[];
}

export interface PlaylistTracksResponse {
  items: {
    track: Track;
  }[];
}

export interface UserPlaylistsResponse {
  items: Playlist[];
} 