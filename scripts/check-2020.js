import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

async function check2020() {
  const dataBuffer = fs.readFileSync('Cyberpunk/Cyberpunk/cyberpunk-um-rpg-num-futuro-sombrio-biblioteca-elfica.pdf');
  const data = await pdf(dataBuffer, { max: 10 }); // sample first 10 pages or find index
  console.log(`2020 Total pages: ${data.numpages}`);
  console.log(data.text.slice(0, 1000));
}

check2020();
