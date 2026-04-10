import { inject, Injectable } from '@angular/core';
import { FileService } from './file.service';
import { UtilsService } from './utils.service';
import { isItemStorage } from '../models/appData.model';
import localforage from 'localforage';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly file = inject(FileService);
  private readonly utils = inject(UtilsService);

  constructor() { }

  async getValue(key: string): Promise<any> {
    try {
      if (!isItemStorage(key) || this.utils.isVersionWeb()) {
        const value = await localforage.getItem(key);
        return value ?? null;
      } else {
        return await this.file.getValue(key);
      }
    } catch (error) {
      console.error('[PersistenceService][getValue]', error);
      return null;
    }
  }

  public async setValue(key: string, value: any): Promise<boolean> {
    try {
      if (!isItemStorage(key) || this.utils.isVersionWeb()) {
        await localforage.setItem(key, value);
        return true;
      }
      await this.file.setValue(key, value);
      return true;
    } catch (error) {
      console.error('[PersistenceService][setValue]', error)
      return false;
    }
  }

  public async removeValue(key: string): Promise<boolean> {
    try {
      if (!isItemStorage(key) || this.utils.isVersionWeb()) {
        await localforage.removeItem(key);
        return true;
      }
      await this.file.removeValue(key);
      return true;

    } catch (error) {
      console.error('[PersistenceService][removeValue]', error)
      return false;

    }
  }

  public async resetValues(): Promise<boolean> {
    try {
      await localforage.clear();
      await this.file.resetValues();
      return true;
    } catch (error) {
      console.error('[PersistenceService][resetValues]', error)
      return false;
    }
  }
}