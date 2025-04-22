import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { PlaylistUpdateService } from '../../services/playlist-update.service';
import { Playlist, Track } from '../../models/spotify.models';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pb-8">
      @if (!isAuthenticated) {
        <div class="py-12 text-center bg-zinc-800/40 rounded-lg p-8">
          <div class="text-zinc-400 mb-4">
            <i class="fa-solid fa-lock text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-4">Necesitas iniciar sesión para ver esta playlist</h2>
          <p class="text-zinc-400 mb-6">Inicia sesión con tu cuenta de Spotify para acceder a las playlists.</p>
          <button (click)="login()" class="spotify-btn">
            Iniciar sesión
          </button>
        </div>
      } @else if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      } @else if (playlist) {
        <div class="relative mb-8">
        <button (click)="goBack()" class="absolute top-3 left-3 flex items-center justify-center z-10">
            <i class="fa-solid fa-arrow-left text-white"></i>
          </button>
          
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-gradient-to-b from-zinc-800/80 to-black/40 p-8 rounded-xl">
            <div class="w-48 h-48 md:w-60 md:h-60 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              @if (playlist.images && playlist.images.length > 0) {
                <img [src]="playlist.images[0].url" alt="{{ playlist.name }}" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                  <i class="fa-solid fa-music text-6xl text-zinc-600"></i>
                </div>
              }
            </div>
            <div>
              <span class="text-sm text-zinc-400 font-medium uppercase">Playlist</span>
              <h1 class="text-3xl md:text-5xl font-bold text-white mt-1">{{ playlist.name }}</h1>
              
              <p class="text-zinc-400 mt-2 line-clamp-2">{{ playlist.description || 'Playlist de Spotify' }}</p>
              
              <div class="flex items-center gap-1 mt-3">
                <span class="text-zinc-300">{{ playlist.owner.display_name }}</span>
                <span class="text-zinc-600">•</span>
                <span class="text-zinc-400">{{ playlist.tracks.total }} canciones</span>
              </div>
              
              <div class="mt-6 flex items-center gap-4">
                <button class="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-full flex items-center gap-2">
                  <i class="fa-solid fa-play"></i>
                  <span>Reproducir</span>
                </button>
                
                <button 
                  (click)="toggleFollowPlaylist()"
                  class="bg-transparent border border-zinc-500 hover:border-white text-white font-bold py-2 px-6 rounded-full flex items-center gap-2"
                >
                  @if (isFollowing) {
                    <i class="fa-solid fa-heart text-green-500"></i>
                    <span>Siguiendo</span>
                  } @else {
                    <i class="fa-regular fa-heart"></i>
                    <span>Seguir</span>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">Canciones</h2>
          
          @if (isLoadingTracks) {
            <div class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          } @else if (tracks.length > 0) {
            <div class="bg-zinc-900/30 rounded-lg overflow-hidden">
              <table class="w-full min-w-full divide-y divide-zinc-800">
                <thead class="bg-zinc-800/30">
                  <tr>
                    <th scope="col" class="p-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-12 text-center">#</th>
                    <th scope="col" class="p-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Título</th>
                    <th scope="col" class="p-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:table-cell">Duración</th>
                    <th scope="col" class="p-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-800/50">
                  @for (track of tracks; track track.id; let i = $index) {
                    <tr class="hover:bg-zinc-800/30 transition-colors group">
                      <td class="p-4 text-center">
                        <div class="relative">
                          <span class="text-zinc-400 group-hover:hidden">{{ i + 1 }}</span>
                          <span class="text-white hidden group-hover:block">
                            <i class="fa-solid fa-play"></i>
                          </span>
                        </div>
                      </td>
                      <td class="p-4">
                        <div>
                          <p class="text-white font-medium">{{ track.name }}</p>
                        </div>
                      </td>
                      <td class="p-4 hidden md:table-cell text-zinc-400">{{ formatDuration(track.duration_ms) }}</td>
                      <td class="p-4 text-right">
                        <a [href]="track.external_urls.spotify" target="_blank" class="text-zinc-400 hover:text-white">
                          <i class="fa-solid fa-external-link-alt"></i>
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="py-8 text-center">
              <p class="text-zinc-400">No se encontraron canciones en esta playlist</p>
            </div>
          }
        </div>
      } @else {
        <div class="py-12 text-center">
          <div class="text-zinc-600 mb-4">
            <i class="fa-solid fa-circle-exclamation text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Playlist no encontrada</h2>
          <p class="text-zinc-400 mb-6">No pudimos encontrar la playlist que estás buscando</p>
          <button (click)="goBack()" class="spotify-btn">
            Volver atrás
          </button>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class PlaylistDetailComponent implements OnInit {
  playlistId: string = '';
  playlist: Playlist | null = null;
  tracks: Track[] = [];
  isLoading: boolean = true;
  isLoadingTracks: boolean = true;
  isAuthenticated: boolean = false;
  isFollowing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private playlistUpdateService: PlaylistUpdateService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.playlistId = id;
            this.loadPlaylistDetails();
          } else {
            this.goBack();
          }
        });
      }
    });
  }

  loadPlaylistDetails(): void {
    this.isLoading = true;
    this.spotifyService.getPlaylistDetails(this.playlistId).subscribe(
      playlist => {
        this.playlist = playlist;
        this.isLoading = false;
        this.loadTracks();
        // Verificar si el usuario sigue la playlist
        this.checkIfUserFollowsPlaylist();
      },
      error => {
        console.error('Error al cargar playlist:', error);
        this.isLoading = false;
      }
    );
  }

  loadTracks(): void {
    this.isLoadingTracks = true;
    this.spotifyService.getPlaylistTracks(this.playlistId).subscribe(
      res => {
        this.tracks = res.items.map(item => item.track);
        this.isLoadingTracks = false;
      },
      error => {
        console.error('Error al cargar canciones:', error);
        this.isLoadingTracks = false;
      }
    );
  }

  checkIfUserFollowsPlaylist(): void {
    this.spotifyService.checkUserFollowsPlaylist(this.playlistId).subscribe(
      response => {
        this.isFollowing = response.following;
      },
      error => {
        console.error('Error al verificar seguimiento de playlist:', error);
        // Si hay error, asumimos que no está siguiendo
        this.isFollowing = false;
      }
    );
  }

  toggleFollowPlaylist(): void {
    if (this.isFollowing) {
      this.spotifyService.unfollowPlaylist(this.playlistId).subscribe(
        () => {
          this.isFollowing = false;
          // Notificar que cambió el estado de seguimiento
          this.playlistUpdateService.notifyPlaylistFollowStatusChanged();
        },
        error => {
          console.error('Error al dejar de seguir la playlist:', error);
        }
      );
    } else {
      this.spotifyService.followPlaylist(this.playlistId).subscribe(
        () => {
          this.isFollowing = true;
          // Notificar que cambió el estado de seguimiento
          this.playlistUpdateService.notifyPlaylistFollowStatusChanged();
        },
        error => {
          console.error('Error al seguir la playlist:', error);
        }
      );
    }
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  }

  login(): void {
    this.authService.login();
  }

  goBack(): void {
    this.router.navigate(['/playlists']);
  }
} 