import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

async function readPage103() {
  const buf = fs.readFileSync('Cyberpunk/Cyberpunk/cyberpunk-um-rpg-num-futuro-sombrio-biblioteca-elfica.pdf');
  const d = await pdf(buf);
  // find "Modificador de Tipo Corporal" in the body text (around page 100-110)
  const idx = d.text.indexOf('Modificador de Tipo Corporal', 5000);
  console.log('Pos:', idx);
  if (idx !== -1) {
    console.log(d.text.slice(idx, idx + 2500));
  }
}

readPage103();
