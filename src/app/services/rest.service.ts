import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';

@Injectable({ providedIn: 'root' })
export class RestService {
  private readonly http = inject(HttpClient);
  private readonly persistence = inject(PersistenceService);

  private getHeaders() {
    let headers = new HttpHeaders({
      'X-API-KEY': environment.apiKey,
      'X-API-SECRET': environment.apiSecret
    });

    const token = this.persistence.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  get<T>(endpoint: string) {
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }
}