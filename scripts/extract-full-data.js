import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';

async function dumpText(pdfPath, outPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    fs.writeFileSync(outPath, data.text, 'utf8');
    console.log(`Extracted ${path.basename(pdfPath)} -> ${outPath} (${data.text.length} chars, ${data.numpages} pages)`);
  } catch (err) {
    console.error(`Error on ${pdfPath}:`, err.message);
  }
}

async function run() {
  if (!fs.existsSync('extracted_raw')) {
    fs.mkdirSync('extracted_raw', { recursive: true });
  }
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-NightCityWeather.pdf', 'extracted_raw/weather.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-GangGuide.pdf', 'extracted_raw/gang_guide.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-DigitalDating.pdf', 'extracted_raw/digital_dating.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-ScreamsheetGenerator.pdf', 'extracted_raw/screamsheets.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-HardenedMooks.pdf', 'extracted_raw/hardened_mooks.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-HardenedLTs.pdf', 'extracted_raw/hardened_lts.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Suplementos/736072250-CpRED-DataScreen.pdf', 'extracted_raw/data_screen.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-MixingDrinksChangingLivesv1.1.pdf', 'extracted_raw/mixing_drinks.txt');
  await dumpText('Cyberpunk/Cyberpunk RED/Extras gratuitos/RTG-CPR-DLC-SinglePlayerModePlusv1.01.pdf', 'extracted_raw/single_player.txt');
}

run();
