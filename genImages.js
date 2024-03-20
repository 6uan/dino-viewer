const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlDirectory = '/Users/buan/Downloads/dinoViewer/html'; // Replace with your HTML directory path
const outputDirectory = '/Users/buan/Downloads/dinoViewer/images'; // Replace with your desired output directory path

async function screenshotDiv(htmlFile, outputFilePath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });

    // Wait for the first child div inside #dinoviewer to be loaded
    await page.waitForSelector('#dinoviewer > div:nth-child(1)', { visible: true });

    // Select the first child div inside #dinoviewer
    const element = await page.$('#dinoviewer > div:nth-child(1)');

    if (element) {
        await element.screenshot({ path: outputFilePath });
    } else {
        console.error(`First child div of #dinoviewer not found in ${htmlFile}`);
    }

    await browser.close();
}

async function processHtmlFiles() {
    const files = fs.readdirSync(htmlDirectory);

    for (const file of files) {
        if (file.endsWith('.html')) {
            const htmlFilePath = path.join(htmlDirectory, file);
            const outputFileName = `${path.basename(file, '.html')}.png`;
            const outputFilePath = path.join(outputDirectory, outputFileName);

            console.log(`Processing ${file}...`);
            await screenshotDiv(htmlFilePath, outputFilePath);
        }
    }

    console.log('Processing complete.');
}

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

processHtmlFiles();
