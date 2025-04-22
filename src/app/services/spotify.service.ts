import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  SearchResponse, 
  ArtistAlbumsResponse, 
  AlbumTracksResponse, 
  SpotifyUser, 
  UserPlaylistsResponse, 
  Playlist,
  Artist,
  Album,
  PlaylistTracksResponse
} from '../models/spotify.models';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private endpoint = 'spotify';

  constructor(private apiService: ApiService) { }

  searchArtists(query: string): Observable<SearchResponse> {
    return this.apiService.get<SearchResponse>(`/${this.endpoint}/search/${query}`);
  }

  getArtistById(artistId: string): Observable<Artist> {
    return this.apiService.get<Artist>(`/${this.endpoint}/artist/${artistId}`);
  }

  getArtistAlbums(artistId: string): Observable<ArtistAlbumsResponse> {
    return this.apiService.get<ArtistAlbumsResponse>(`/${this.endpoint}/artist/${artistId}/albums`);
  }

  getAlbumById(albumId: string): Observable<Album> {
    return this.apiService.get<Album>(`/${this.endpoint}/album/${albumId}`);
  }

  getAlbumTracks(albumId: string): Observable<AlbumTracksResponse> {
    return this.apiService.get<AlbumTracksResponse>(`/${this.endpoint}/album/${albumId}/tracks`);
  }

  getCurrentUser(): Observable<SpotifyUser> {
    return this.apiService.get<SpotifyUser>(`/${this.endpoint}/me`);
  }

  getUserPlaylists(): Observable<UserPlaylistsResponse> {
    return this.apiService.get<UserPlaylistsResponse>(`/${this.endpoint}/me/playlists`);
  }

  followPlaylist(playlistId: string): Observable<any> {
    return this.apiService.put<any>(`/${this.endpoint}/playlists/${playlistId}/follow`, {});
  }

  unfollowPlaylist(playlistId: string): Observable<any> {
    return this.apiService.delete<any>(`/${this.endpoint}/playlists/${playlistId}/follow`);
  }

  checkUserFollowsPlaylist(playlistId: string): Observable<{ following: boolean }> {
    return this.apiService.get<{ following: boolean }>(`/${this.endpoint}/playlists/${playlistId}/followers/contains`);
  }

  getPlaylistDetails(playlistId: string): Observable<Playlist> {
    return this.apiService.get<Playlist>(`/${this.endpoint}/playlists/${playlistId}`);
  }

  getPlaylistTracks(playlistId: string): Observable<PlaylistTracksResponse> {
    return this.apiService.get<PlaylistTracksResponse>(`/${this.endpoint}/playlists/${playlistId}/tracks`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('spotify_token');
  }

  login(): void {
    window.location.href = `/api/auth/login`;
  }

  logout(): void {
    localStorage.removeItem('spotify_token');
  }
} 