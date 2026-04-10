import { AbstractModel } from "./abstract.model";
import { ProjectDTO } from "./projectDTO.model";


export class UserDTO extends AbstractModel {
    name!: string;
    email!: string;
    password!: string;
    resgistrationDate!: string | Date;
    projects: ProjectDTO[] = [];
    role!: string;

}