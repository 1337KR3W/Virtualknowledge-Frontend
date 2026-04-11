export class TimeEntryDTO {
    constructor(
        public hours: number = 0,
        public comment: string = ''
    ) { }
}

export class ProjectTimeRowDTO {
    public pid: string;
    public projectName: string;
    public days: { [key: string]: TimeEntryDTO };

    constructor(pid: string, projectName: string) {
        this.pid = pid;
        this.projectName = projectName;
        this.days = {
            mon: new TimeEntryDTO(),
            tue: new TimeEntryDTO(),
            wed: new TimeEntryDTO(),
            thu: new TimeEntryDTO(),
            fri: new TimeEntryDTO(),
            sat: new TimeEntryDTO(),
            sun: new TimeEntryDTO()
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