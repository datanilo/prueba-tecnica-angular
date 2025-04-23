import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { ArtistDetailComponent } from './pages/artist-detail/artist-detail.component';
import { AlbumDetailComponent } from './pages/album-detail/album-detail.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { PlaylistDetailComponent } from './pages/playlist-detail/playlist-detail.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'artist/:id', component: ArtistDetailComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [authGuard] },
  { path: 'playlist/:id', component: PlaylistDetailComponent, canActivate: [authGuard] },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: '' }
];
