import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { PlaylistUpdateService } from '../../services/playlist-update.service';
import { Playlist } from '../../models/spotify.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pb-8">
      <h1 class="text-3xl font-bold text-white mb-6">Tus playlists</h1>
      
      @if (!isAuthenticated) {
        <div class="py-12 text-center bg-zinc-800/40 rounded-lg p-8">
          <div class="text-zinc-400 mb-4">
            <i class="fa-solid fa-lock text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-4">Necesitas iniciar sesión para ver tus playlists</h2>
          <p class="text-zinc-400 mb-6">Inicia sesión con tu cuenta de Spotify para acceder a tus playlists.</p>
          <button (click)="login()" class="spotify-btn">
            Iniciar sesión
          </button>
        </div>
      } @else if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      } @else if (playlists.length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          @for (playlist of playlists; track playlist.id) {
            <div 
              [routerLink]="['/playlist', playlist.id]"
              class="bg-zinc-800/40 hover:bg-zinc-700/40 p-4 rounded-lg cursor-pointer transition-colors group flex flex-col h-full"
            >
              <div class="mb-4 relative">
                <div class="aspect-square rounded-md overflow-hidden shadow-lg">
                  @if (playlist.images && playlist.images.length > 0) {
                    <img [src]="playlist.images[0].url" alt="{{ playlist.name }}" class="w-full h-full object-cover" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                      <i class="fa-solid fa-music text-4xl text-zinc-600"></i>
                    </div>
                  }
                </div>
                <div class="absolute bottom-2 right-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button class="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                    <i class="fa-solid fa-play text-black"></i>
                  </button>
                </div>
              </div>
              <div class="flex-1 flex flex-col overflow-hidden">
                <h3 class="text-white font-bold truncate">{{ playlist.name }}</h3>
                <p class="text-zinc-400 text-sm line-clamp-2 mt-1 overflow-hidden">{{ playlist.description || 'Playlist' }}</p>
                <div class="flex flex-wrap items-center gap-1 mt-2 overflow-hidden">
                  <span class="text-zinc-500 text-xs truncate max-w-full">Por {{ playlist.owner.display_name }}</span>
                  <span class="text-zinc-600 shrink-0">•</span>
                  <span class="text-zinc-500 text-xs shrink-0">{{ playlist.tracks.total }} canciones</span>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="py-8 text-center">
          <div class="text-zinc-500 mb-4">
            <i class="fa-solid fa-music text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">No tienes playlists</h2>
          <p class="text-zinc-400">No se encontraron playlists en tu biblioteca</p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class PlaylistsComponent implements OnInit, OnDestroy {
  playlists: Playlist[] = [];
  isLoading = true;
  isAuthenticated = false;
  private playlistSubscription: Subscription | null = null;

  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private playlistUpdateService: PlaylistUpdateService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.loadPlaylists();
        
        // Suscribirse a los cambios de estado de seguimiento de playlists
        this.playlistSubscription = this.playlistUpdateService.playlistFollowStatusChanged$.subscribe(() => {
          // Cuando recibamos una notificación, recargamos las playlists
          this.loadPlaylists();
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Asegurarse de cancelar la suscripción al destruir el componente
    if (this.playlistSubscription) {
      this.playlistSubscription.unsubscribe();
    }
  }

  loadPlaylists(): void {
    this.isLoading = true;
    this.spotifyService.getUserPlaylists().subscribe(
      res => {
        this.playlists = res.items;
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar playlists:', error);
        this.isLoading = false;
      }
    );
  }

  login(): void {
    this.authService.login();
  }
} 