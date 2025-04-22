import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBaseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  get<T>(endpoint: string, params = {}): Observable<T> {
    return this.http.get<T>(`${this.apiBaseUrl}${endpoint}`, { params })
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  post<T>(endpoint: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.apiBaseUrl}${endpoint}`, body)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  put<T>(endpoint: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.apiBaseUrl}${endpoint}`, body)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiBaseUrl}${endpoint}`)
      .pipe(catchError(error => this.errorHandler.handleError(error)));
  }
} 