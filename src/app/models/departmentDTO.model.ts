export interface DepartmentRequestDTO {
    name: string;
    userIds: number[];
}

export interface DepartmentResponseDTO {
    id: number;
    name: string;
    userIds: number[];
}