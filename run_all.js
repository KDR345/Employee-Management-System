import { spawn } from 'child_process';
import path from 'path';

// Helper to spawn and log
const startServer = (cmd, args, cwd) => {
    console.log(`Starting ${cmd} ${args.join(' ')} in ${cwd}...`);
    const proc = spawn(cmd, args, { cwd, shell: true });
    
    // We only log errors to keep output clean, but Vite might output to stdout
    proc.stdout.on('data', data => console.log(`[${cwd}] ${data.toString().trim()}`));
    proc.stderr.on('data', data => console.error(`[${cwd} ERR] ${data.toString().trim()}`));
    
    return proc;
};

const run = async () => {
    // 1. Install puppeteer safely
    console.log("Installing puppeteer first...");
    await new Promise((resolve) => {
        const install = spawn('npm', ['install', 'puppeteer', '--no-save'], { stdio: 'inherit', shell: true });
        install.on('close', resolve);
    });

    // 2. Start servers
    const backend = startServer('npm', ['run', 'dev'], './server');
    const frontend = startServer('npm', ['run', 'dev'], './');

    console.log("\nWaiting 10 seconds for servers to fully boot up...\n");
    await new Promise(r => setTimeout(r, 10000));

    // 3. Run screenshot script
    console.log("Running screenshot script...");
    const screenshotProc = spawn('node', ['take_screenshots.js'], { stdio: 'inherit', shell: true });
    
    await new Promise((resolve) => {
        screenshotProc.on('close', resolve);
    });

    console.log("\nScreenshot script completed. Cleaning up servers...");

    // 4. Kill servers. Windows killing child processes:
    const killCmd = process.platform === 'win32' ? 'taskkill' : 'kill';
    const killArgs = process.platform === 'win32' ? ['/pid', backend.pid, '/T', '/F'] : ['-9', backend.pid];
    
    if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', backend.pid, '/T', '/F']);
        spawn('taskkill', ['/pid', frontend.pid, '/T', '/F']);
    } else {
        backend.kill('SIGINT');
        frontend.kill('SIGINT');
    }

    console.log("All done! Screenshots saved in docs/figures/");
};

run().catch(console.error);
