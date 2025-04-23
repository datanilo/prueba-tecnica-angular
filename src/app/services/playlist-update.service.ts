import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistUpdateService {
  // Subject para emitir eventos cuando se actualiza el estado de seguimiento de una playlist
  private playlistFollowStatusChanged = new Subject<void>();
  
  // Observable al que se pueden suscribir los componentes
  public playlistFollowStatusChanged$ = this.playlistFollowStatusChanged.asObservable();
  
  constructor() { }
  
  // Método para notificar que ha cambiado el estado de seguimiento de una playlist
  notifyPlaylistFollowStatusChanged(): void {
    this.playlistFollowStatusChanged.next();
  }
} 