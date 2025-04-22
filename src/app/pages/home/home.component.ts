import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-6">Bienvenido</h1>
        
        @if (!(authService.isAuthenticated$ | async)) {
          <div class="text-center bg-zinc-800/50 p-8 rounded-lg mb-8">
            <h2 class="text-xl font-bold text-white mb-4">Inicia sesión para disfrutar de una experiencia completa</h2>
            <p class="text-zinc-400 mb-6">Accede a tus playlists y descubre nuevas artistas.</p>
            <button (click)="login()" class="spotify-btn">
              Iniciar sesión con Spotify
            </button>
          </div>
        }
        
        <div class="mb-8">
          @if (authService.isAuthenticated$ | async) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div (click)="navigateToSearch()" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-lg cursor-pointer transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <i class="fa-solid fa-magnifying-glass text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-white font-bold">Buscar artistas</h3>
                    <p class="text-zinc-400 text-sm">Encuentra tus artistas favoritos</p>
                  </div>
                </div>
              </div>
              
              <div (click)="navigateToPlaylists()" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-lg cursor-pointer transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center">
                    <i class="fa-solid fa-music text-2xl text-green-500"></i>
                  </div>
                  <div>
                    <h3 class="text-white font-bold">Tus playlists</h3>
                    <p class="text-zinc-400 text-sm">Accede a tus colecciones guardadas</p>
                  </div>
                </div>
              </div>
            </div>
          } @else {
            <div (click)="navigateToSearch()" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-lg cursor-pointer transition-colors w-full">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <i class="fa-solid fa-magnifying-glass text-2xl text-white"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold">Buscar artistas</h3>
                  <p class="text-zinc-400 text-sm">Encuentra tus artistas favoritos</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class HomeComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login();
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  navigateToPlaylists(): void {
    this.router.navigate(['/playlists']);
  }
} 