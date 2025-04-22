import { HttpInterceptorFn, HttpResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private cache = new Map<string, HttpResponse<any>>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const key = this.getKey(req);
    return this.cache.get(key);
  }

  set(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const key = this.getKey(req);
    this.cache.set(key, response);
  }

  clear(): void {
    this.cache.clear();
  }

  delete(req: HttpRequest<any>): boolean {
    const key = this.getKey(req);
    return this.cache.delete(key);
  }

  private getKey(req: HttpRequest<any>): string {
    return req.urlWithParams;
  }
}

export const cacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const cacheService = new HttpCacheService();

  // Solo cacheamos las solicitudes GET
  if (req.method !== 'GET') {
    return next(req);
  }

  // Verificamos si la respuesta ya está en caché
  const cachedResponse = cacheService.get(req);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  // Si no está en caché, realizamos la solicitud y almacenamos la respuesta
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.set(req, event);
      }
    }),
    share()
  );
}; 