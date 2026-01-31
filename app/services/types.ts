import { Guest, Property, Template, MaintenanceIssue } from '../lib/types';

// Generic Repository Interface
export interface Repository<T> {
    subscribe(userId: string, onSuccess: (data: T[]) => void, onError: (error: Error) => void): () => void;
    add(userId: string, item: Omit<T, 'id'>): Promise<string>;
    update(userId: string, id: string, data: Partial<T>): Promise<void>;
    delete(userId: string, id: string): Promise<void>;
    getOne(userId: string, id: string): Promise<T | undefined>;
    getAll(userId: string): Promise<T[]>;
}

export interface DataService {
    guests: Repository<Guest>;
    properties: Repository<Property>;
    templates: Repository<Template>;
    maintenance: Repository<MaintenanceIssue>;
}
