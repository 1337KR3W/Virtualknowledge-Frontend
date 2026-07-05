export interface UserResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: string;
    status: string;
    departmentId: number;
    departmentName?: string;
    roleName: string;
    roleId: number;
}

export interface UserRequestDTO {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    departmentId: number;
    roleId: number;
    status: string;
}