import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpotifyUser } from '../models/spotify.models';
import { SpotifyService } from './spotify.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<SpotifyUser | null>(null);
  public currentUser$: Observable<SpotifyUser | null> = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private spotifyService: SpotifyService) {
    const hasToken = !!localStorage.getItem('spotify_token');
    this.isAuthenticatedSubject.next(hasToken);
    
    if (hasToken) {
      this.loadCurrentUser();
    }
  }

  login(): void {
    this.spotifyService.login();
  }

  logout(): void {
    this.spotifyService.logout();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  handleAuthCallback(token: string): void {
    localStorage.setItem('spotify_token', token);
    this.isAuthenticatedSubject.next(true);
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.spotifyService.getCurrentUser().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    ).subscribe();
  }
} 