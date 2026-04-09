import puppeteer from 'puppeteer';
import path from 'path';

const clickButtonByText = async (page, text) => {
    const clicked = await page.evaluate((btnText) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const targetBtn = btns.find(b => b.innerText.trim() === btnText);
        if (targetBtn) {
            targetBtn.click();
            return true;
        }
        return false;
    }, text);
    if (!clicked) {
        console.warn(`Warning: Button with text "${text}" not found.`);
    }
    return clicked;
};

const run = async () => {
    console.log("Launching browser to capture remaining screenshots...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const baseUrl = 'http://localhost:5173/Employee-Management-system/';

    try {
        // --- ADMIN SCREENSHOTS ---
        console.log("\nLogging in as admin...");
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1500));
        
        await page.type('input[type="email"]', 'admin@me.com');
        await page.type('input[type="password"]', '123');
        await clickButtonByText(page, 'Sign In');
        
        await new Promise(r => setTimeout(r, 3000));
        
        // Admin: View Attendance
        console.log("Capturing Admin -> View Attendance...");
        await clickButtonByText(page, 'View Attendance');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'docs/figures/admin_attendance_view.png' });

        // Admin: Manage Leaves
        console.log("Capturing Admin -> Manage Leaves...");
        await clickButtonByText(page, 'Manage Leaves');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'docs/figures/admin_manage_leaves.png' });

        // Admin: Add Employee
        console.log("Capturing Admin -> Add Employee...");
        await clickButtonByText(page, 'Add Employee');
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'docs/figures/admin_add_employee.png' });

        // Admin: Manage Payroll
        console.log("Capturing Admin -> Manage Payroll...");
        await clickButtonByText(page, 'Manage Payroll');
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'docs/figures/admin_manage_payroll.png' });

        // Logout
        console.log("Logging out of admin...");
        await clickButtonByText(page, 'Log Out');
        await new Promise(r => setTimeout(r, 2000));

        // --- EMPLOYEE SCREENSHOTS ---
        console.log("\nLogging in as employee...");
        await page.type('input[type="email"]', 'e1@me.com');
        await page.type('input[type="password"]', '123');
        await clickButtonByText(page, 'Sign In');
        
        await new Promise(r => setTimeout(r, 3000));

        // Employee: Attendance
        console.log("Capturing Employee -> Attendance...");
        await clickButtonByText(page, 'Attendance');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'docs/figures/employee_attendance.png' });

        // Employee: Leave Requests
        console.log("Capturing Employee -> Leave Requests...");
        await clickButtonByText(page, 'Leave Requests');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'docs/figures/employee_leave_requests.png' });

        // Employee: My Payslips
        console.log("Capturing Employee -> My Payslips...");
        await clickButtonByText(page, 'My Payslips');
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'docs/figures/employee_my_payslips.png' });

    } catch (e) {
        console.error("An error occurred:", e);
    } finally {
        console.log("\nClosing browser.");
        await browser.close();
        process.exit(0);
    }
};

run().catch(console.error);
