import { AbstractModel } from "./abstract.model";

export class ProjectDTO extends AbstractModel {
    name!: string;
    description!: string;
    startDate!: string | Date;
    endDate!: string | Date;
    userIds!: number[] | [];
    departmentId?: number;
    departmentName?: string;
}