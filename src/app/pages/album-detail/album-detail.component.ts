import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Album, Track } from '../../models/spotify.models';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pb-8">
      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      } @else if (album) {
        <div class="relative mb-8">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-gradient-to-b from-zinc-800/80 to-black/40 p-6 rounded-xl">
            <button (click)="goBack()" class="absolute top-3 right-3 flex items-center gap-2 bg-zinc-800/70 hover:bg-zinc-700 text-white px-4 py-2 rounded-full transition-colors">
              <i class="fa-solid fa-arrow-left"></i>
              <span>Volver</span>
            </button>
            
            <div class="w-48 h-48 md:w-60 md:h-60 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              @if (album.images && album.images.length > 0) {
                <img [src]="album.images[0].url" alt="{{ album.name }}" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                  <i class="fa-solid fa-compact-disc text-6xl text-zinc-600"></i>
                </div>
              }
            </div>
            <div>
              <span class="text-sm text-zinc-400 font-medium uppercase">Álbum</span>
              <h1 class="text-3xl md:text-5xl font-bold text-white mt-1">{{ album.name }}</h1>
              
              <div class="flex items-center gap-1 mt-4">
                <a [routerLink]="['/artist', album.artists[0].id]" class="text-white hover:underline font-medium">
                  {{ album.artists[0].name }}
                </a>
                <span class="text-zinc-400">•</span>
                <span class="text-zinc-400">{{ getYear(album.release_date) }}</span>
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
              <p class="text-zinc-400">No se encontraron canciones para este álbum</p>
            </div>
          }
        </div>
      } @else {
        <div class="py-12 text-center">
          <div class="text-zinc-600 mb-4">
            <i class="fa-solid fa-circle-exclamation text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Álbum no encontrado</h2>
          <p class="text-zinc-400 mb-6">No pudimos encontrar el álbum que estás buscando</p>
          <button (click)="goBack()" class="spotify-btn">
            Volver atrás
          </button>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class AlbumDetailComponent implements OnInit {
  albumId: string = '';
  album: Album | null = null;
  tracks: Track[] = [];
  isLoading: boolean = true;
  isLoadingTracks: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.albumId = id;
        this.loadAlbumDetails();
      } else {
        this.goBack();
      }
    });
  }

  loadAlbumDetails(): void {
    this.isLoading = true;
    // Usamos el nuevo endpoint para obtener detalles del álbum directamente
    this.spotifyService.getAlbumById(this.albumId).subscribe(
      album => {
        this.album = album;
        this.isLoading = false;
        this.loadTracks();
      },
      error => {
        console.error('Error al cargar álbum:', error);
        this.isLoading = false;
      }
    );
  }

  loadTracks(): void {
    this.isLoadingTracks = true;
    this.spotifyService.getAlbumTracks(this.albumId).subscribe(
      res => {
        this.tracks = res.items;
        this.isLoadingTracks = false;
      },
      error => {
        console.error('Error al cargar canciones:', error);
        this.isLoadingTracks = false;
      }
    );
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  }

  getYear(date: string): string {
    return date ? date.split('-')[0] : '';
  }

  goBack(): void {
    if (this.album && this.album.artists && this.album.artists.length > 0) {
      this.router.navigate(['/artist', this.album.artists[0].id]);
    } else {
      this.router.navigate(['/search']);
    }
  }
} 