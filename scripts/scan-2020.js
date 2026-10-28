import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

async function scan2020() {
  const buf = fs.readFileSync('Cyberpunk/Cyberpunk/cyberpunk-um-rpg-num-futuro-sombrio-biblioteca-elfica.pdf');
  const d = await pdf(buf);
  console.log('2020 PDF extracted, total pages:', d.numpages);
  
  // Search for key terms
  const terms = ['Modificador de Tipo Corporal', 'BTM', 'Localização de Dano', 'Tabela de Armas', 'Fortaleza de Dados', 'Demônio', 'Hellhound'];
  for (const t of terms) {
    const idx = d.text.indexOf(t);
    console.log(`Term "${t}": ${idx !== -1 ? 'Found at pos ' + idx : 'Not found'}`);
    if (idx !== -1) {
      console.log(d.text.slice(idx, idx + 400));
      console.log('-------------------------');
    }
  }
}

scan2020();
