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
    order?: number;
    tasks?: Task[];
}
export interface Task {
    id?: string;
    title: string;
    description?: string;
    completed: boolean;
    order?: number;
    createdDate: any;
}