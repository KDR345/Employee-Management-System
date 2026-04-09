import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'ems.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    
    console.log("--- 🧑‍💼 USERS TABLE ---");
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) console.error(err);
        else console.table(rows);
        
        console.log("\n--- 💰 PAYROLL TABLE ---");
        db.all("SELECT * FROM payroll", [], (err, rows) => {
            if (err) console.error("Payroll table runs into issue:", err.message);
            else console.table(rows);
            
            console.log("\n--- 📅 ATTENDANCE TABLE ---");
            db.all("SELECT * FROM attendance LIMIT 5", [], (err, rows) => {
                if (err) console.error(err);
                else console.table(rows);
                
                db.close();
            });
        });
    });
});
