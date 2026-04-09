const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const mdConfigStr = fs.readFileSync(path.join(__dirname, '08_Software_Requirements_Specification.md'), 'utf-8');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: "new"
    });
    const page = await browser.newPage();
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            @page { size: A4; margin: 1in; margin-left: 1.5in; }
            body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: black; text-align: justify; font-size: 12pt; padding: 0; margin: 0; }
            pre { background: #f4f4f4; padding: 10px; font-size: 10pt; line-height: 1.2; word-break: break-all; white-space: pre-wrap; }
            code { font-family: monospace; }
            .mermaid { display: flex; justify-content: center; margin: 20px 0; }
            .mermaid svg { max-width: 100%; height: auto; }
            h1, h2, h3, h4, h5 { font-family: 'Times New Roman', Times, serif; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { text-align: left; background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <textarea id="md-source" style="display:none;"></textarea>
        <div id="content"></div>
    </body>
    </html>
    `;

    console.log("Setting content...");
    await page.setContent(html, { waitUntil: 'load' });
    await page.$eval('#md-source', (el, md) => el.value = md, mdConfigStr);
    
    console.log("Evaluating content and rendering diagrams...");
    await page.evaluate(async () => {
        const md = document.getElementById('md-source').value;
        const renderer = new marked.Renderer();
        renderer.code = function(arg1, arg2) {
            const actualCode = typeof arg1 === 'object' ? arg1.text : arg1;
            const lang = typeof arg1 === 'object' ? arg1.lang : arg2;
            if (lang === 'mermaid') {
                return '<div class="mermaid">' + actualCode.replace(/\\/g, '\\\\') + '</div>';
            }
            return '<pre><code>' + actualCode.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
        };
        // Hack to stop marked from escaping our inserted mermaid divs
        marked.setOptions({ renderer });
        document.getElementById('content').innerHTML = marked.parse(md);
        
        try {
            const module = await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs');
            const mermaid = module.default;
            mermaid.initialize({ startOnLoad: false, theme: 'default' });
            await mermaid.run({ querySelector: '.mermaid' });
        } catch(e) {
            console.error(e);
        }
        window.mermaidDone = true;
    });

    await page.waitForFunction('window.mermaidDone === true', { timeout: 30000 });
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Generating PDF...");
    await page.pdf({ 
        path: '08_Software_Requirements_Specification.pdf', 
        format: 'A4',
        printBackground: true
    });
    
    await browser.close();
    console.log("Done.");
})();
