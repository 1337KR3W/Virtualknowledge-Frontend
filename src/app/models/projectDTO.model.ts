import { AbstractModel } from "./abstract.model";


export class ProjectDTO extends AbstractModel {

    name!: string;
    description!: string;
    creationDate!: string | Date;
    userId!: number;
}