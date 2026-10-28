import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';

async function inspect(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    console.log(`=== FILE: ${path.basename(pdfPath)} (Pages: ${data.numpages}) ===`);
    console.log(data.text.slice(0, 1500));
    console.log('\n--- SAMPLE EXTRACT COMPLETE ---\n');
  } catch (err) {
    console.error(`Error reading ${pdfPath}:`, err.message);
  }
}

async function run() {
  await inspect('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-NightCityWeather.pdf');
  await inspect('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-DigitalDating.pdf');
  await inspect('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-ScreamsheetGenerator.pdf');
}

run();
