import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly TOKEN_KEY = 'auth_token';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearAll(): void {
    localStorage.clear();
  }

  // Aquí podrías añadir métodos para guardar el objeto usuario completo
  saveData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getData(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}