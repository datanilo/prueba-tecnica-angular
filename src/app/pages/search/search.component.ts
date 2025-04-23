import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from '../../models/spotify.models';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="py-4">
      <h1 class="text-3xl font-bold text-white mb-6">Buscar artistas</h1>
      
      <div class="w-full mb-8">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            placeholder="¿Qué artista quieres escuchar?"
            class="bg-zinc-800 text-white w-full py-3 px-5 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"></i>
        </div>
      </div>
      
      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      } @else if (artists.length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (artist of displayedArtists; track artist.id) {
            <div 
              (click)="navigateToArtist(artist.id)"
              class="bg-zinc-800/40 hover:bg-zinc-700/40 transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div class="mb-4 relative">
                <div class="aspect-square rounded-full overflow-hidden bg-zinc-700 shadow-xl">
                  @if (artist.images && artist.images.length > 0) {
                    <img 
                      [src]="artist.images[0].url" 
                      alt="{{ artist.name }}" 
                      class="w-full h-full object-cover"
                    />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                      <i class="fa-solid fa-user text-4xl text-zinc-600"></i>
                    </div>
                  }
                </div>
                <div class="absolute bottom-2 right-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button class="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                    <i class="fa-solid fa-play text-black text-xl"></i>
                  </button>
                </div>
              </div>
              <h3 class="text-white font-bold truncate">{{ artist.name }}</h3>
              <div class="flex flex-wrap gap-1 mb-2">
                @for (genre of getFirstGenres(artist); track genre) {
                  <span class="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">{{ genre }}</span>
                }
              </div>
              <p class="text-zinc-400 text-sm">{{ artist.followers.total | number }} seguidores</p>
            </div>
          }
        </div>
      } @else if (searchPerformed) {
        <div class="py-8 text-center">
          <div class="text-zinc-500 mb-4">
            <i class="fa-solid fa-user-slash text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">No se encontraron artistas</h2>
          <p class="text-zinc-400">Intenta con otro término de búsqueda</p>
        </div>
      } @else {
        <div class="py-8 text-center">
          <h2 class="text-xl font-bold text-white mb-2">Busca tus artistas favoritos</h2>
          <p class="text-zinc-400">Comienza a escribir para buscar artistas</p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class SearchComponent {
  searchQuery = '';
  artists: Artist[] = [];
  isLoading = false;
  searchPerformed = false;
  private searchTerms = new Subject<string>();

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {
    this.setupSearch();
  }

  get displayedArtists(): Artist[] {
    return this.artists.slice(0, 4);
  }

  setupSearch(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.trim()) {
        this.performSearch(term);
      } else {
        this.artists = [];
        this.searchPerformed = false;
      }
    });
  }

  onSearchInput(): void {
    this.searchTerms.next(this.searchQuery);
  }

  performSearch(term: string): void {
    this.isLoading = true;
    this.spotifyService.searchArtists(term).subscribe(
      res => {
        this.artists = res.artists.items;
        this.isLoading = false;
        this.searchPerformed = true;
      },
      error => {
        console.error('Error al buscar artistas:', error);
        this.isLoading = false;
        this.searchPerformed = true;
      }
    );
  }

  searchArtists(): void {
    if (!this.searchQuery.trim()) return;
    this.performSearch(this.searchQuery);
  }

  navigateToArtist(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  getFirstGenres(artist: Artist): string[] {
    return artist.genres.slice(0, 3);
  }
} 