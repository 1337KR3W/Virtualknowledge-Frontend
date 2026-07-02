export interface TimeEntryDTO {
    hours: number;
    comment: string;
}

export interface ProjectTimeRowDTO {
    pid: number;
    projectName: string;
    days: { [key: string]: TimeEntryDTO };
}

export interface TimeSheetResponseDTO {
    weekId: string;
    globalComment: string | null;
    rows: ProjectTimeRowDTO[];
    updatedAt: string;
}

export interface TimeSheetRequestDTO {
    weekId: string;
    globalComment: string | null;
    entries: {
        projectId: number;
        workDate: string;
        hours: number;
        comment: string;
    }[];
}