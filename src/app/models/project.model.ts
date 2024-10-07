export interface Project {
    id?: string;
    name: string;
    description?: string;
    createdDate: Date;
    ownerId: string;
    sections?: Section[];
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