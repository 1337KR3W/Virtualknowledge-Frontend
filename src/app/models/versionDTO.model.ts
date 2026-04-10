export class VersionDTO {
    version?: string;
    nombre?: string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }
}