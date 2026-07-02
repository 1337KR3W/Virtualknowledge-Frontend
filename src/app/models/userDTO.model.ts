export interface UserResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: string;
    status: string;
    departmentId: number;
    roleName: string;
}

export interface UserRequestDTO {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    departmentId: number;
    roleName: string;
}