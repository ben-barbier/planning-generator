export interface Course {
    id: string;
    description: string;
    teachersIds: string[];
    coursesPreconditionsIds: string[];
}

export interface Teacher {
    id: string;
    vacations: string[]; // format: "YYYY-MM-DD aa" (ex: 2019-05-13 AM)
}
