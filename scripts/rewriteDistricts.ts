import fs from 'node:fs';
import { normalizeDistrictLabel, resolveDistrict } from '../src/data/districtRegistry';

const files = ['barsData', 'chanceOfLifetimeData', 'datingData', 'nightMarketData', 'campaignData'];
for (const f of files) {
  const p = `src/data/${f}.ts`;
  const src = fs.readFileSync(p, 'utf8');
  let changed = 0;
  const out = src.replace(/(\bdistrict:\s*)'([^'\n]*)'/g, (m, pre, val) => {
    const next = normalizeDistrictLabel(val);
    if (next === val) { if (!resolveDistrict(val)) console.log(`  [sem match] ${f}: ${val}`); return m; }
    changed++;
    console.log(`  ${f}: ${val}  ->  ${next}`);
    return `${pre}'${next.replace(/'/g, "\\'")}'`;
  });
  if (process.argv.includes('--write')) fs.writeFileSync(p, out, 'utf8');
  console.log(`${f}: ${changed} alterados`);
}
