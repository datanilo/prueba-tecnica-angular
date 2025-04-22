import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="bg-black py-4 px-6 flex justify-between items-center sticky top-0 z-10 border-b border-zinc-800">
      <div class="flex items-center">
        <a [routerLink]="['/']" class="flex items-center gap-2">
          <svg viewBox="0 0 16 16" height="40" width="40" fill="#1DB954">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/>
          </svg>
          <span class="text-white text-xl font-bold">Angular</span>
        </a>
      </div>
      
      <div class="flex items-center gap-4">
        @if (authService.isAuthenticated$ | async) {
          <div class="flex items-center gap-2">

            <div class="relative">
              <div 
                (click)="toggleUserMenu()" 
                class="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center cursor-pointer text-white font-medium"
              >
                {{ userInitials$ | async }}
              </div>
              @if (showUserMenu) {
                <div class="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg py-1 z-20">
                  <a [routerLink]="['/playlists']" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-700 cursor-pointer">
                    Mis playlists
                  </a>
                  <div class="border-t border-zinc-700 my-1"></div>
                  <a (click)="logout()" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-700 cursor-pointer">
                    Cerrar sesión
                  </a>
                </div>
              }
            </div>
          </div>
        } @else {
          <button (click)="login()" class="spotify-btn text-sm py-2 px-4">
            Iniciar sesión
          </button>
        }
      </div>
    </nav>
  `,
  styles: ``
})
export class NavbarComponent {
  showUserMenu = false;
  userInitials$: Observable<string>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.userInitials$ = this.authService.currentUser$.pipe(
      map(user => {
        if (!user || !user.display_name) return 'U';
        
        const nameParts = user.display_name.split(' ');
        if (nameParts.length >= 2) {
          return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        } else if (nameParts.length === 1) {
          return nameParts[0].substring(0, 2).toUpperCase();
        } else {
          return 'U';
        }
      })
    );
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Cerrar el menú si se hace clic fuera del menú
    if (!target.closest('.relative') && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showUserMenu = false;
  }
} 