import fs from 'fs';

const text = fs.readFileSync('extracted_raw/gang_guide.txt', 'utf8');
const lines = text.split('\n');
console.log(`Total lines: ${lines.length}`);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.includes('Maelstrom') || line.includes('Bozos') || line.includes('Tyger Claws') || line.includes('Inquisitors') || line.includes('6th Street') || line.includes('Valentinos') || line.includes('Voodoo Boys') || line.includes('Red Chrome Legion') || line.includes('Piranhas')) {
    console.log(`[Line ${i}] ${lines.slice(Math.max(0, i-2), i+4).map(l => l.trim()).join(' // ')}`);
  }
}
