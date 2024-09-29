export class Project {
    id?: string;
    name: string;
    description?: string;
    createdDate: Date;
    ownerId: string;
    sections?: Section[];

    constructor(name: string, description: string, createdDate: Date, ownerId: string) {
        this.name = name;
        this.description = description;
        this.createdDate = createdDate;
        this.ownerId = ownerId;
    }
}

export interface Section {
    id?: string;
    title: string;
    tasks?: Task[];
}

export interface Task {
    id?: string;
    title: string;
    description?: string;
    completed: boolean;
}