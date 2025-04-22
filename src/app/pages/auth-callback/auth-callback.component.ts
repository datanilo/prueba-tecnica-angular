import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
      <p class="text-white text-xl">Autenticando...</p>
    </div>
  `,
  styles: ``
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        this.authService.handleAuthCallback(token);
        // Redirigir al usuario a la página de inicio después de un breve retraso
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
} 