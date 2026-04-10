import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({ providedIn: 'root' })
export class EncryptionService {
  public encode(data: string): string {
    let key = CryptoJS.enc.Utf8.parse('7061737323313233');
    let iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    ).toString();
  }

  public decode(data: string): string {
    let key = CryptoJS.enc.Utf8.parse('7061737323313233');
    let iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    return CryptoJS.AES.decrypt(data, key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    ).toString(CryptoJS.enc.Utf8);
  }
}