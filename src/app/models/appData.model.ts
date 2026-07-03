import { UserResponseDTO } from "./userDTO.model";

export class AppDataModel {
    public userLogged: UserResponseDTO | null = null;
    public token: string | null = null;
    public language: 'es' | 'en' = 'es';
    public appMode: 'develop' | 'production' = 'develop';
    public version: string = 'version';
    public lastSync: Date | string = 'LastTimeSyncUp';
    public customer: string | null = null;
}

export const itemsStorage = [
    'language',
    'userLogged',
    'token',
    'customer',
    'appConfig',
    'lastSync',
    'credentials'
] as const;

export type StorageKey = typeof itemsStorage[number];

export const isItemStorage = (key: string): key is StorageKey => {
    return itemsStorage.includes(key as any);
};