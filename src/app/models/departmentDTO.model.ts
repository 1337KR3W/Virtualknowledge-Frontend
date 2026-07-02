import { AbstractModel } from "./abstract.model";

export class DepartmentDTO extends AbstractModel {
    name!: string;
    userIds?: number[];

}