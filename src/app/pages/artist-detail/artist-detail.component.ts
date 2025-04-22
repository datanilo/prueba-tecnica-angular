import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Album, Artist } from '../../models/spotify.models';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pb-8">
      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      } @else if (artist) {
        <div class="relative mb-8">
          <button (click)="goBack()" class="absolute top-3 left-3 flex items-center justify-center z-10">
            <i class="fa-solid fa-arrow-left text-white text-xl"></i>
          </button>
          
          <div class="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-zinc-800/80 to-black/40 p-8 rounded-xl">
            <div class="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-2xl flex-shrink-0">
              @if (artist.images && artist.images.length > 0) {
                <img [src]="artist.images[0].url" alt="{{ artist.name }}" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                  <i class="fa-solid fa-user text-6xl text-zinc-600"></i>
                </div>
              }
            </div>
            <div>
              <span class="text-sm text-zinc-400 font-medium uppercase">Artista</span>
              <h1 class="text-4xl md:text-6xl font-bold text-white mt-1">{{ artist.name }}</h1>
              
              <div class="flex flex-wrap gap-2 mt-4">
                @for (genre of artist.genres.slice(0, 5); track genre) {
                  <span class="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full">{{ genre }}</span>
                }
              </div>
              
              <p class="text-zinc-400 mt-3">{{ artist.followers.total | number }} seguidores</p>
            </div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">Álbumes</h2>
          
          @if (isLoadingAlbums) {
            <div class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          } @else if (albums.length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              @for (album of albums; track album.id) {
                <div 
                  (click)="navigateToAlbum(album.id)"
                  class="bg-zinc-800/40 hover:bg-zinc-700/40 transition-colors p-4 rounded-lg cursor-pointer group"
                >
                  <div class="mb-4 relative">
                    <div class="aspect-square rounded-md overflow-hidden shadow-lg">
                      @if (album.images && album.images.length > 0) {
                        <img [src]="album.images[0].url" alt="{{ album.name }}" class="w-full h-full object-cover" />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                          <i class="fa-solid fa-compact-disc text-4xl text-zinc-600"></i>
                        </div>
                      }
                    </div>
                    <div class="absolute bottom-2 right-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button class="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                        <i class="fa-solid fa-play text-black"></i>
                      </button>
                    </div>
                  </div>
                  <h3 class="text-white font-bold text-sm line-clamp-2">{{ album.name }}</h3>
                  <p class="text-zinc-400 text-xs mt-1">{{ getYear(album.release_date) }}</p>
                </div>
              }
            </div>
          } @else {
            <div class="py-8 text-center">
              <p class="text-zinc-400">No se encontraron álbumes para este artista</p>
            </div>
          }
        </div>
      } @else {
        <div class="py-12 text-center">
          <div class="text-zinc-600 mb-4">
            <i class="fa-solid fa-circle-exclamation text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Artista no encontrado</h2>
          <p class="text-zinc-400 mb-6">No pudimos encontrar el artista que estás buscando</p>
          <button (click)="goBack()" class="spotify-btn">
            Volver atrás
          </button>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ArtistDetailComponent implements OnInit {
  artistId: string = '';
  artist: Artist | null = null;
  albums: Album[] = [];
  isLoading: boolean = true;
  isLoadingAlbums: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.artistId = id;
        this.loadArtist();
      } else {
        this.goBack();
      }
    });
  }

  loadArtist(): void {
    this.isLoading = true;
    
    // Vamos a cargar directamente los álbumes ya que la API nos permite hacerlo con el ID
    // Y a partir de los álbumes podemos obtener información del artista
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.isLoadingAlbums = true;
    this.spotifyService.getArtistAlbums(this.artistId).subscribe(
      res => {
        if (res.items && res.items.length > 0) {
          this.albums = res.items;
          
          // Una vez que tenemos los álbumes, obtenemos la información completa del artista
          this.fetchArtistDetails();
        } else {
          // No hay álbumes, intentamos obtener información directa del artista
          this.fetchArtistDetails();
        }
        
        this.isLoadingAlbums = false;
      },
      error => {
        console.error('Error al cargar álbumes:', error);
        this.isLoadingAlbums = false;
        this.isLoading = false;
      }
    );
  }

  fetchArtistDetails(): void {
    // Usamos el nuevo endpoint específico para obtener detalles del artista por ID
    this.spotifyService.getArtistById(this.artistId).subscribe(
      artistData => {
        this.artist = artistData;
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener detalles del artista:', error);
        // Si falla, intentamos con búsqueda como último recurso
        this.fallbackToSearch();
      }
    );
  }

  fallbackToSearch(): void {
    // Como último recurso, intentamos buscar por nombre
    // Usamos el nombre del artista del primer álbum si está disponible
    const artistName = this.albums.length > 0 ? this.albums[0].artists[0].name : this.artistId;
    
    this.spotifyService.searchArtists(artistName).subscribe(
      searchRes => {
        if (searchRes.artists && searchRes.artists.items.length > 0) {
          // Intentamos encontrar coincidencia exacta por ID
          const foundArtist = searchRes.artists.items.find(a => a.id === this.artistId);
          if (foundArtist) {
            this.artist = foundArtist;
          } else {
            // Si no, usamos el primer resultado
            this.artist = searchRes.artists.items[0];
          }
        } else {
          // Si no hay resultados, construimos objeto básico
          this.artist = {
            id: this.artistId,
            name: artistName,
            images: this.albums.length > 0 ? this.albums[0].images : [],
            followers: { total: 0 },
            genres: []
          };
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error en búsqueda de artista:', error);
        // Construimos objeto básico con lo que tengamos
        if (this.albums.length > 0) {
          this.artist = {
            id: this.artistId,
            name: this.albums[0].artists[0].name,
            images: this.albums[0].images,
            followers: { total: 0 },
            genres: []
          };
        }
        this.isLoading = false;
      }
    );
  }

  getYear(date: string): string {
    return date ? date.split('-')[0] : '';
  }

  navigateToAlbum(albumId: string): void {
    this.router.navigate(['/album', albumId]);
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
} 