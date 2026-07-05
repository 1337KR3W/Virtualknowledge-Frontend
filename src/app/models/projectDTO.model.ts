export interface ProjectRequestDTO {
    name: string;
    description: string;
    startDate: string;
    endDate?: string | null;
    userIds: number[];
    departmentId: number;
}

export interface ProjectResponseDTO {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate?: string | null;
    userIds: number[];
    departmentId: number;
    departmentName?: string;
}