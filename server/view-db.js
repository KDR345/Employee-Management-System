import db from './database.js';

console.log("--- Users ---");
db.all("SELECT * FROM users", (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);

    console.log("\n--- Tasks ---");
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) console.error(err);
        else console.table(rows);

        console.log("\n--- Attendance ---");
        db.all("SELECT * FROM attendance", (err, rows) => {
            if (err) console.error(err);
            else console.table(rows);

            console.log("\n--- Leave Requests ---");
            db.all("SELECT * FROM leaves", (err, rows) => {
                if (err) console.error(err);
                else console.table(rows);

                process.exit(0);
            });
        });
    });
});
