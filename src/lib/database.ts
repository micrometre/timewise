// Types for our database operations
export interface WorkEntry {
  id?: number;
  day: string;
  date: string;
  shift: string;
  hours: number;
  rate: number;
  value: number;
  createdAt?: string;
}

class DatabaseManager {
  private promiser: any = null;
  private dbId: string | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Loading and initializing SQLite3 module...');

      // Load the worker script directly from the public directory
      const sqlite3Worker1Promiser = await this.loadWorkerFromPublic();

      // Use the Worker-based promiser API
      this.promiser = await new Promise((resolve) => {
        const _promiser = (sqlite3Worker1Promiser as any)({
          onready: () => {
            resolve(_promiser);
          },
        });
      });

      console.log('Getting SQLite3 version...');
      const versionResponse = await this.promiser('config-get', {});
      console.log('Running SQLite3 version', versionResponse.result?.version?.libVersion || 'Unknown');

      console.log('Opening database with OPFS persistence...');
      const response = await this.promiser('open', {
        filename: 'file:timewise.sqlite3?vfs=opfs',
      });

      this.dbId = response.dbId;
      console.log('Database opened successfully with ID:', this.dbId);

      await this.createTables();
      this.initialized = true;

      console.log('Database initialization complete');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async loadWorkerFromPublic(): Promise<any> {
    // Load the worker module from the public directory
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/sqlite-wasm/jswasm/sqlite3-worker1-promiser.js';
      script.type = 'text/javascript';
      
      script.onload = () => {
        // @ts-ignore - Global variable set by the script
        if (typeof (globalThis as any).sqlite3Worker1Promiser === 'function') {
          resolve((globalThis as any).sqlite3Worker1Promiser);
        } else {
          reject(new Error('sqlite3Worker1Promiser not available'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load SQLite worker script'));
      };
      
      document.head.appendChild(script);
    });
  }

  private async createTables() {
    if (!this.promiser || !this.dbId) throw new Error('Database not initialized');

    // Create work entries table
    await this.promiser('exec', {
      dbId: this.dbId,
      sql: `
        CREATE TABLE IF NOT EXISTS work_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day TEXT NOT NULL,
          date TEXT NOT NULL,
          shift TEXT,
          hours REAL NOT NULL,
          rate REAL NOT NULL,
          value REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    console.log('Tables created successfully');
  }

  async getWorkEntries(): Promise<WorkEntry[]> {
    if (!this.promiser || !this.dbId) throw new Error('Database not initialized');

    const entries: WorkEntry[] = [];

    await this.promiser('exec', {
      dbId: this.dbId,
      sql: 'SELECT * FROM work_entries ORDER BY created_at DESC',
      callback: (result: any) => {
        if (result.row) {
          entries.push({
            id: result.row[0],
            day: result.row[1],
            date: result.row[2],
            shift: result.row[3] || '',
            hours: result.row[4],
            rate: result.row[5],
            value: result.row[6],
            createdAt: result.row[7]
          });
        }
      }
    });

    return entries;
  }

  async addWorkEntry(entry: Omit<WorkEntry, 'id' | 'createdAt'>): Promise<number> {
    if (!this.promiser || !this.dbId) throw new Error('Database not initialized');

    const result = await this.promiser('exec', {
      dbId: this.dbId,
      sql: `
        INSERT INTO work_entries (day, date, shift, hours, rate, value)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      bind: [entry.day, entry.date, entry.shift, entry.hours, entry.rate, entry.value],
      returnValue: 'resultRows'
    });

    // Get the last inserted ID
    let lastId = 0;
    await this.promiser('exec', {
      dbId: this.dbId,
      sql: 'SELECT last_insert_rowid() as id',
      callback: (result: any) => {
        if (result.row) {
          lastId = result.row[0];
        }
      }
    });

    return lastId;
  }

  async deleteWorkEntry(id: number): Promise<void> {
    if (!this.promiser || !this.dbId) throw new Error('Database not initialized');

    await this.promiser('exec', {
      dbId: this.dbId,
      sql: 'DELETE FROM work_entries WHERE id = ?',
      bind: [id]
    });
  }

  async clearAllEntries(): Promise<void> {
    if (!this.promiser || !this.dbId) throw new Error('Database not initialized');

    await this.promiser('exec', {
      dbId: this.dbId,
      sql: 'DELETE FROM work_entries'
    });
  }

  async close(): Promise<void> {
    if (this.promiser && this.dbId) {
      await this.promiser('close', { dbId: this.dbId });
      this.dbId = null;
      this.initialized = false;
    }
  }
}

// Export singleton instance
export const database = new DatabaseManager();

// Helper function to initialize database
export async function initializeDatabase() {
  if (!database) {
    throw new Error('Database instance not available');
  }
  await database.initialize();
  return database;
}
