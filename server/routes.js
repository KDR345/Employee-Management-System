import express from 'express';
import db from './database.js';
import { sendWelcomeEmail, sendTaskNotification, sendLeaveNotification, sendPayslipEmail } from './emailService.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid Credentials' });

        // If employee, fetch their tasks
        if (user.role === 'employee') {
            db.all('SELECT * FROM tasks WHERE userId = ?', [user.id], (err, tasks) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ user, tasks: tasks || [] });
            });
        } else {
            // Admin
            res.json({ user, tasks: [] });
        }
    });
});

// Get all employees with their tasks
router.get('/employees', (req, res) => {
    db.all("SELECT id, name, email, role FROM users WHERE role = 'employee'", (err, users) => {
        if (err) return res.status(500).json({ error: err.message });

        // For simplicity, fetching all tasks and mapping in memory
        db.all("SELECT * FROM tasks", (err, tasks) => {
            if (err) return res.status(500).json({ error: err.message });

            const employeesWithTasks = users.map(user => {
                return {
                    ...user,
                    tasks: tasks.filter(t => t.userId === user.id)
                };
            });

            res.json(employeesWithTasks);
        });
    });
});

// Create a new employee
router.post('/employees', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'employee')`;
    db.run(query, [name, email, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        
        // Asynchronously send the welcome email
        sendWelcomeEmail(email, name, password);

        res.status(201).json({ message: 'Employee added successfully', id: this.lastID });
    });
});

// Create task (Admin)
router.post('/tasks', (req, res) => {
    const { title, date, category, description, userId } = req.body;
    if (!title || !date || !category || !description || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO tasks (title, description, date, category, active, newTask, completed, failed, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [title, description, date, category, 1, 1, 0, 0, userId];

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Find the user's email to send the notification
        db.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
            if (!err && user) {
                sendTaskNotification(user.email, user.name, title, description, date, category);
            }
        });

        res.json({ message: 'Task created successfully', id: this.lastID });
    });
});

// Update task status
router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { active, newTask, completed, failed } = req.body;

    const query = `UPDATE tasks SET active = ?, newTask = ?, completed = ?, failed = ? WHERE id = ?`;
    const params = [active, newTask, completed, failed, id];

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task updated successfully' });
    });
});

// Delete task
router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM tasks WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task deleted successfully' });
    });
});

// --- ATTENDANCE ROUTES ---

// Mark attendance
router.post('/attendance', (req, res) => {
    const { userId, date, status } = req.body;
    if (!userId || !date || !status) return res.status(400).json({ error: 'Missing required fields' });

    const query = `INSERT INTO attendance (userId, date, status) VALUES (?, ?, ?)`;
    db.run(query, [userId, date, status], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Attendance already marked for today' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Attendance marked successfully', id: this.lastID });
    });
});

// Get attendance history (Admin views all, Employee views own)
router.get('/attendance', (req, res) => {
    const { userId } = req.query;
    let query = `SELECT a.*, u.name as employeeName FROM attendance a JOIN users u ON a.userId = u.id ORDER BY a.date DESC`;
    const params = [];

    if (userId) {
        query = `SELECT * FROM attendance WHERE userId = ? ORDER BY date DESC`;
        params.push(userId);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- LEAVE ROUTES ---

// Submit a leave request
router.post('/leaves', (req, res) => {
    const { userId, from_date, to_date, reason } = req.body;
    if (!userId || !from_date || !to_date || !reason) return res.status(400).json({ error: 'Missing required fields' });

    const query = `INSERT INTO leaves (userId, from_date, to_date, reason) VALUES (?, ?, ?, ?)`;
    db.run(query, [userId, from_date, to_date, reason], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Leave request submitted successfully', id: this.lastID });
    });
});

// Get all leaves (Admin) or specific user leaves
router.get('/leaves', (req, res) => {
    const { userId } = req.query;
    let query = `SELECT l.*, u.name as employeeName FROM leaves l JOIN users u ON l.userId = u.id ORDER BY l.id DESC`;
    const params = [];

    if (userId) {
        query = `SELECT * FROM leaves WHERE userId = ? ORDER BY id DESC`;
        params.push(userId);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update leave status (Admin)
router.put('/leaves/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const query = `UPDATE leaves SET status = ? WHERE id = ?`;
    db.run(query, [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Retrieve the user email to send the leave update notification
        db.get('SELECT u.name, u.email FROM leaves l JOIN users u ON l.userId = u.id WHERE l.id = ?', [id], (err, user) => {
            if (!err && user) {
                sendLeaveNotification(user.email, user.name, status);
            }
        });

        res.json({ message: 'Leave status updated successfully' });
    });
});

// --- PAYROLL ROUTES ---

// Generate payroll
router.post('/payroll', (req, res) => {
    const { employee_id, period_start, period_end, gross_amount } = req.body;
    if (!employee_id || !period_start || !period_end || !gross_amount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const taxes = gross_amount * 0.15;
    const net_amount = gross_amount - taxes;

    const query = `INSERT INTO payroll (employee_id, period_start, period_end, gross_amount, taxes, net_amount) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [employee_id, period_start, period_end, gross_amount, taxes, net_amount], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get('SELECT name, email FROM users WHERE id = ?', [employee_id], (err, user) => {
            if (!err && user) {
                sendPayslipEmail(user.email, user.name, period_start, period_end, Number(gross_amount), taxes, net_amount);
            }
        });

        res.json({ message: 'Payroll generated successfully', id: this.lastID });
    });
});

// Get payroll
router.get('/payroll', (req, res) => {
    const { userId } = req.query;
    let query = `SELECT p.*, u.name as employeeName FROM payroll p JOIN users u ON p.employee_id = u.id ORDER BY p.period_end DESC`;
    const params = [];

    if (userId) {
        query = `SELECT * FROM payroll WHERE employee_id = ? ORDER BY period_end DESC`;
        params.push(userId);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

export default router;
