import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { PlaylistUpdateService } from '../../services/playlist-update.service';
import { Playlist } from '../../models/spotify.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="bg-black w-60 h-full p-0 flex flex-col">
      <div class="mb-10 px-6 pt-6">

        
        <ul class="space-y-6">
          <li>
            <a 
              [routerLink]="['/']" 
              routerLinkActive="text-white" 
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center gap-4 text-zinc-400 hover:text-white transition"
            >
              <i class="fa-solid fa-house text-xl w-6"></i>
              <span>Inicio</span>
            </a>
          </li>
          <li>
            <a 
              [routerLink]="['/search']" 
              routerLinkActive="text-white"
              class="flex items-center gap-4 text-zinc-400 hover:text-white transition"
            >
              <i class="fa-solid fa-magnifying-glass text-xl w-6"></i>
              <span>Buscar</span>
            </a>
          </li>
        </ul>
      </div>
      
      @if (isAuthenticated) {
        <div class="mt-5 px-6 flex-grow overflow-hidden">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-zinc-400 text-sm uppercase font-bold">Tus playlists</h2>
            <a [routerLink]="['/playlists']" class="text-zinc-400 hover:text-white text-sm">
              Ver todas
            </a>
          </div>
          
          <div class="h-full overflow-y-auto pb-10">
            @if (playlists.length > 0) {
              <ul class="space-y-4">
                @for (playlist of playlists; track playlist.id) {
                  <li>
                    <a 
                      [routerLink]="['/playlist', playlist.id]" 
                      routerLinkActive="text-white"
                      class="flex items-center gap-3 text-zinc-400 hover:text-white transition truncate"
                    >
                      <div class="flex-shrink-0 w-10 h-10 rounded overflow-hidden">
                        @if (playlist.images && playlist.images.length > 0) {
                          <img [src]="playlist.images[0].url" alt="{{ playlist.name }}" class="w-full h-full object-cover">
                        } @else {
                          <div class="bg-zinc-800 w-full h-full flex items-center justify-center">
                            <i class="fa-solid fa-music text-zinc-600"></i>
                          </div>
                        }
                      </div>
                      <span class="truncate">{{ playlist.name }}</span>
                    </a>
                  </li>
                }
              </ul>
            } @else {
              <p class="text-zinc-500 text-sm">No tienes playlists aún</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      height: 100vh;
      display: block;
      background-color: black;
    }
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  playlists: Playlist[] = [];
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
    this.spotifyService.getUserPlaylists().subscribe(
      res => {
        this.playlists = res.items.slice(0, 10); // Limitamos a 10 playlists en el sidebar
      },
      error => {
        console.error('Error al cargar playlists:', error);
      }
    );
  }
} 