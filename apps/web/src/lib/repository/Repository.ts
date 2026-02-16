/**
 * Generic Repository Interface
 * Persistence layer abstraction
 */

export interface Repository<T, ID = string> {
    /**
     * Save an entity
     */
    save(entity: T): Promise<T>;

    /**
     * Find entity by ID
     */
    findById(id: ID): Promise<T | null>;

    /**
     * Find all entities matching criteria
     */
    findAll(criteria?: Partial<T>): Promise<T[]>;

    /**
     * Delete entity by ID
     */
    delete(id: ID): Promise<boolean>;

    /**
     * Check if entity exists
     */
    exists(id: ID): Promise<boolean>;
}

/**
 * In-Memory Repository Implementation
 * For development and testing
 */
export class InMemoryRepository<T extends { id?: string }> implements Repository<T> {
    private storage: Map<string, T> = new Map();
    private idCounter = 0;

    async save(entity: T): Promise<T> {
        const id = entity.id || `${Date.now()}-${this.idCounter++}`;
        const withId = { ...entity, id };
        this.storage.set(id, withId);
        return withId;
    }

    async findById(id: string): Promise<T | null> {
        return this.storage.get(id) || null;
    }

    async findAll(criteria?: Partial<T>): Promise<T[]> {
        const all = Array.from(this.storage.values());

        if (!criteria) return all;

        return all.filter(item =>
            Object.entries(criteria).every(([key, value]) =>
                item[key as keyof T] === value
            )
        );
    }

    async delete(id: string): Promise<boolean> {
        return this.storage.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storage.has(id);
    }

    clear(): void {
        this.storage.clear();
    }
}

/**
 * LocalStorage Repository Implementation
 * For browser persistence
 */
export class LocalStorageRepository<T extends { id?: string }> implements Repository<T> {
    constructor(private storageKey: string) { }

    private getStorage(): Map<string, T> {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return new Map();

        try {
            const parsed = JSON.parse(data);
            return new Map(Object.entries(parsed));
        } catch {
            return new Map();
        }
    }

    private setStorage(storage: Map<string, T>): void {
        const obj = Object.fromEntries(storage);
        localStorage.setItem(this.storageKey, JSON.stringify(obj));
    }

    async save(entity: T): Promise<T> {
        const storage = this.getStorage();
        const id = entity.id || `${Date.now()}-${Math.random()}`;
        const withId = { ...entity, id };
        storage.set(id, withId);
        this.setStorage(storage);
        return withId;
    }

    async findById(id: string): Promise<T | null> {
        const storage = this.getStorage();
        return storage.get(id) || null;
    }

    async findAll(criteria?: Partial<T>): Promise<T[]> {
        const storage = this.getStorage();
        const all = Array.from(storage.values());

        if (!criteria) return all;

        return all.filter(item =>
            Object.entries(criteria).every(([key, value]) =>
                item[key as keyof T] === value
            )
        );
    }

    async delete(id: string): Promise<boolean> {
        const storage = this.getStorage();
        const result = storage.delete(id);
        this.setStorage(storage);
        return result;
    }

    async exists(id: string): Promise<boolean> {
        const storage = this.getStorage();
        return storage.has(id);
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
    }
}
