import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="h-screen flex flex-col overflow-hidden">
      <app-navbar></app-navbar>
      <div class="flex flex-1 overflow-hidden">
        <app-sidebar></app-sidebar>
        <main class="bg-gradient-to-b from-zinc-900 to-black flex-1 p-6 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Spotify Angular';
}
