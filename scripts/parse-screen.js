import fs from 'fs';

const text = fs.readFileSync('extracted_raw/data_screen.txt', 'utf8');
const lines = text.split('\n');
console.log(`Data screen lines: ${lines.length}`);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.includes('CRITICAL INJURY') || line.includes('Critical Injuries') || line.includes('BLACK ICE') || line.includes('RANGE DV') || line.includes('AUTOFIRE') || line.includes('NET ACTIONS') || line.includes('FACEDOWN')) {
    console.log(`[Line ${i}] ${lines.slice(Math.max(0, i-1), i+3).map(l => l.trim()).join(' // ')}`);
  }
}
