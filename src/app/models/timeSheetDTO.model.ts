export class TimeEntryDTO {
    constructor(
        public hours: number = 0,
        public comment: string = ''
    ) { }
}

export class ProjectTimeRowDTO {
    public pid: number;
    public projectName: string;
    public days: { [key: string]: TimeEntryDTO };

    constructor(pid: number, projectName: string) {
        this.pid = pid;
        this.projectName = projectName;
        this.days = {
            mon: new TimeEntryDTO(0, ''),
            tue: new TimeEntryDTO(0, ''),
            wed: new TimeEntryDTO(0, ''),
            thu: new TimeEntryDTO(0, ''),
            fri: new TimeEntryDTO(0, ''),
            sat: new TimeEntryDTO(0, ''),
            sun: new TimeEntryDTO(0, '')
        };
    }

    get totalHours(): number {
        return Object.values(this.days).reduce((acc, entry) => acc + (entry.hours || 0), 0);
    }
}
export class TimeSheetDTO {
    public weekId: string;
    public globalComment: string;
    public rows: ProjectTimeRowDTO[];
    public updatedAt: Date;

    constructor(weekId: string = '') {
        this.weekId = weekId;
        this.globalComment = '';
        this.rows = [];
        this.updatedAt = new Date();
    }
}