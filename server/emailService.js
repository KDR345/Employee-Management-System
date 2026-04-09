import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // Your App Password
    }
});

/**
 * Sends a welcome email with login credentials to a new employee.
 * @param {string} email - The employee's email address
 * @param {string} name - The employee's name
 * @param {string} password - The employee's temporary password
 */
export const sendWelcomeEmail = async (email, name, password) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Welcome to EMS - Your Login Credentials',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #4f46e5;">Welcome to Employee Management System</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>Your employee account has been successfully created. You can now log in to access your dashboard, view your tasks, and mark your attendance.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>Login URL:</strong> <a href="http://localhost:5173" style="color: #4f46e5;">http://localhost:5173</a></p>
                        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 0;"><strong>Password:</strong> ${password}</p>
                    </div>
                    <p>Please log in and begin using the system. Let your administrator know if you have any issues accessing your account.</p>
                    <br/>
                    <p>Best regards,<br/>The EMS Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

/**
 * Sends a notification email when a new task is assigned.
 * @param {string} email - The employee's email address
 * @param {string} name - The employee's name
 * @param {string} taskTitle - The title of the task
 * @param {string} taskDescription - The description of the task
 * @param {string} taskDate - The due date
 * @param {string} category - The task category
 */
export const sendTaskNotification = async (email, name, taskTitle, taskDescription, taskDate, category) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `New Task Assigned: ${taskTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #10b981;">New Task Assignment</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>You have been assigned a new task in the Employee Management System.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                        <h3 style="margin-top: 0; color: #1f2937;">${taskTitle}</h3>
                        <p><strong>Category:</strong> <span style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;">${category}</span></p>
                        <p><strong>Due Date:</strong> ${taskDate}</p>
                        <p><strong>Description:</strong></p>
                        <p style="color: #4b5563; white-space: pre-wrap;">${taskDescription}</p>
                    </div>
                    <p>Please log in to your dashboard to review and manage this task.</p>
                    <a href="http://localhost:5173" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
                    <br/><br/>
                    <p>Best regards,<br/>The EMS Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Task notification email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending task notification email:', error);
        return false;
    }
};

/**
 * Sends a notification email when a leave request status is updated.
 * @param {string} email - The employee's email address
 * @param {string} name - The employee's name
 * @param {string} status - The new status of the leave request (approved/rejected)
 */
export const sendLeaveNotification = async (email, name, status) => {
    try {
        const isApproved = status.toLowerCase() === 'approved';
        const color = isApproved ? '#10b981' : '#ef4444'; // Green or Red
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Leave Request Update: ${statusText}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: ${color};">Leave Request ${statusText}</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>There is an update on your recent leave request in the Employee Management System.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
                        <p style="font-size: 1.1em; font-weight: bold; margin: 0; color: ${color};">Status: ${statusText}</p>
                    </div>
                    ${!isApproved ? '<p>Please contact your administrator if you need further clarification.</p>' : ''}
                    <p>You can review the details on your dashboard.</p>
                    <a href="http://localhost:5173" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
                    <br/><br/>
                    <p>Best regards,<br/>The EMS Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Leave notification email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending leave notification email:', error);
        return false;
    }
};

/**
 * Sends a notification email when a payroll is processed.
 * @param {string} email - The employee's email address
 * @param {string} name - The employee's name
 * @param {string} periodStart - The start of the pay period
 * @param {string} periodEnd - The end of the pay period
 * @param {number} gross - The calculated gross pay
 * @param {number} taxes - The deducted taxes
 * @param {number} net - The final cleared net pay
 */
export const sendPayslipEmail = async (email, name, periodStart, periodEnd, gross, taxes, net) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Payslip Generated: ${periodStart} to ${periodEnd}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #4f46e5;">Payslip Notification</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>Your payroll for the period of <strong>${periodStart}</strong> to <strong>${periodEnd}</strong> has been successfully processed.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
                        <table style="width: 100%; text-align: left; border-collapse: collapse;">
                            <tr><th style="padding: 5px;">Gross Amount:</th><td style="padding: 5px;">$${gross.toFixed(2)}</td></tr>
                            <tr><th style="padding: 5px; color: #ef4444;">Tax Deductions (15%):</th><td style="padding: 5px; color: #ef4444;">-$${taxes.toFixed(2)}</td></tr>
                            <tr><th style="padding: 5px; border-top: 1px solid #ccc; padding-top: 10px;">Net Payable:</th><td style="padding: 5px; border-top: 1px solid #ccc; padding-top: 10px; font-weight: bold; color: #10b981;">$${net.toFixed(2)}</td></tr>
                        </table>
                    </div>
                    <p>Please log in to your dashboard to view the full details within the 'My Payslips' tab.</p>
                    <a href="http://localhost:5173" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to EMS</a>
                    <br/><br/>
                    <p>Best regards,<br/>The EMS Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Payslip email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending payslip email:', error);
        return false;
    }
};
