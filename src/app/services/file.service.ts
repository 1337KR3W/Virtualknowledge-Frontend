import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FileService {
    private readonly storagePath: string;
    private readonly directory = Directory.Data;
    private readonly extension = '.json';

    constructor() {
        this.storagePath = this.normalizePath(environment.destPathFiles);
    }

    /**
     * Lee un archivo JSON y devuelve su contenido tipado
     */
    async getValue<T>(key: string): Promise<T | null> {
        const fullPath = `${this.storagePath}/${key}${this.extension}`;
        try {
            const { data } = await Filesystem.readFile({
                directory: this.directory,
                path: fullPath,
                encoding: Encoding.UTF8,
            });
            return JSON.parse(data as string) as T;
        } catch (err) {

            return null;
        }
    }

    /**
     * Guarda cualquier objeto como un archivo JSON
     */
    async setValue(key: string, value: any): Promise<boolean> {
        try {
            await this.ensureDirectory();
            const fullPath = `${this.storagePath}/${key}${this.extension}`;

            await Filesystem.writeFile({
                directory: this.directory,
                path: fullPath,
                data: JSON.stringify(value),
                encoding: Encoding.UTF8,
                recursive: true,
            });
            return true;
        } catch (error) {
            console.error('[PersistenceService][setValue]', error);
            return false;
        }
    }

    /**
     * Borra un dato específico
     */
    async removeValue(key: string): Promise<void> {
        try {
            const fullPath = `${this.storagePath}/${key}${this.extension}`;
            await Filesystem.deleteFile({
                directory: this.directory,
                path: fullPath
            });
        } catch (error) {
            console.warn('[PersistenceService] El archivo no existe o no se pudo borrar');
        }
    }

    /**
     * Resetea todos los valores (borra la carpeta de la sesión)
     */
    async resetValues(): Promise<boolean> {
        try {
            await Filesystem.rmdir({
                directory: this.directory,
                path: this.storagePath,
                recursive: true,
            });
            return true;
        } catch (error) {
            console.error('[PersistenceService][resetValues] Error al limpiar directorio');
            return false;
        }
    }

    // --- MÉTODOS PRIVADOS DE UTILIDAD ---

    private async ensureDirectory(): Promise<void> {
        try {
            await Filesystem.mkdir({
                directory: this.directory,
                path: this.storagePath,
                recursive: true,
            });
        } catch (error) {

        }
    }

    private normalizePath(path: string): string {
        if (!path) return 'storage';
        let p = path.replace(/^\/?assets\/?/, '');
        if (p.startsWith('/')) p = p.slice(1);
        if (p.endsWith('/')) p = p.slice(0, -1);
        return p;
    }
}