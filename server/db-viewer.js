import express from 'express';
import db from './database.js';

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    let html = `
    <html>
    <head>
        <title>Database Viewer</title>
        <style>
            body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f2f5; }
            table { border-collapse: collapse; width: 100%; background: white; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #4F46E5; color: white; }
            tr:hover { background-color: #f8fafc; }
            h2 { color: #1e293b; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-top: 40px; }
        </style>
    </head>
    <body>
        <h1>Live Database Viewer</h1>
    `;

    const getTableHtml = (tableName) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
                if (err) return reject(err);

                let tableHtml = `<h2>Table: ${tableName.toUpperCase()}</h2>`;
                if (rows.length === 0) {
                    tableHtml += `<p>No records found.</p>`;
                    return resolve(tableHtml);
                }

                const columns = Object.keys(rows[0]);
                tableHtml += `<table><thead><tr>`;
                columns.forEach(col => tableHtml += `<th>${col}</th>`);
                tableHtml += `</tr></thead><tbody>`;

                rows.forEach(row => {
                    tableHtml += `<tr>`;
                    columns.forEach(col => tableHtml += `<td>${row[col]}</td>`);
                    tableHtml += `</tr>`;
                });

                tableHtml += `</tbody></table>`;
                resolve(tableHtml);
            });
        });
    };

    Promise.all([
        getTableHtml('users'),
        getTableHtml('tasks'),
        getTableHtml('attendance'),
        getTableHtml('leaves')
    ]).then(tables => {
        html += tables.join('');
        html += `</body></html>`;
        res.send(html);
    }).catch(err => {
        res.status(500).send(`Error reading database: ${err.message}`);
    });
});

app.listen(PORT, () => {
    console.log(`Database Viewer running at http://localhost:${PORT}`);
});
