import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  // Aquí podrías usar librerías como crypto-js si necesitaras
  // cifrar el token antes de guardarlo en persistence
  encrypt(data: string): string {
    return btoa(data); // Ejemplo simple con Base64
  }

  decrypt(data: string): string {
    return atob(data);
  }
}