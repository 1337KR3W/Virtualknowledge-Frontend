import { AbstractModel } from "./abstract.model";
import { ProjectDTO } from "./projectDTO.model";

export class UserDTO extends AbstractModel {
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    registrationDate!: string | Date;
    projects: ProjectDTO[] = [];
    roles!: string[];
    status!: string;
}