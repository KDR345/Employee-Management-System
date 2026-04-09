import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'ems.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // Create Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      )`);

            // Create Tasks table
            db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        date TEXT,
        category TEXT,
        active BOOLEAN DEFAULT 1,
        newTask BOOLEAN DEFAULT 1,
        completed BOOLEAN DEFAULT 0,
        failed BOOLEAN DEFAULT 0,
        userId INTEGER,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

            // Create Attendance table
            db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        date TEXT,
        status TEXT CHECK(status IN ('present', 'absent', 'late')),
        FOREIGN KEY(userId) REFERENCES users(id),
        UNIQUE(userId, date)
      )`);

            // Create Leaves table
            db.run(`CREATE TABLE IF NOT EXISTS leaves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        from_date TEXT,
        to_date TEXT,
        reason TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

            // Create Payroll table
            db.run(`CREATE TABLE IF NOT EXISTS payroll (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        period_start DATE,
        period_end DATE,
        gross_amount REAL,
        taxes REAL,
        net_amount REAL,
        status TEXT DEFAULT 'Processed' CHECK(status IN ('Pending', 'Processed', 'Failed')),
        FOREIGN KEY(employee_id) REFERENCES users(id)
      )`);

            // Seed admin and some employee data if the users table is empty
            db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                if (row && row.count === 0) {
                    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
                    insertUser.run('Admin User', 'admin@me.com', '123', 'admin');
                    insertUser.run('Employee One', 'e1@me.com', '123', 'employee');
                    insertUser.run('Employee Two', 'e2@me.com', '123', 'employee');
                    insertUser.finalize();
                    console.log('Seed data inserted');
                }
            });
        });
    }
});

export default db;
