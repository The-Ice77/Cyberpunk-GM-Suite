import { PlayerCharacter } from '../data/playerArchetypes';

/**
 * Generates an official, print-ready Cyberpunk RED / 2020 Character Sheet
 * that can be downloaded as a PDF directly in the browser via window.print().
 */
export function exportCharacterSheetToPrintPDF(char: PlayerCharacter): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar e baixar a ficha em PDF.');
    return;
  }

  const roleAbility = char.roleAbility || { name: 'Especialização de Papel', rank: 4, description: '' };
  const seriouslyWounded = Math.ceil(char.maxHP / 2);
  const deathSave = char.statsRED?.BODY || 6;

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Ficha Cyberpunk RED - ${char.name} (${char.handle || char.role})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Courier New', Courier, monospace;
    }
    body {
      background: #ffffff;
      color: #111111;
      font-size: 11px;
      line-height: 1.3;
      padding: 8px;
    }
    .header {
      border-bottom: 3px solid #b91c1c;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-box h1 {
      font-size: 22px;
      font-weight: 900;
      color: #b91c1c;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .title-box h2 {
      font-size: 14px;
      color: #333333;
      margin-top: 2px;
    }
    .badge {
      display: inline-block;
      background: #b91c1c;
      color: #ffffff;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: #f4f4f5;
      padding: 8px;
      border: 1px solid #d4d4d8;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .meta-item strong {
      display: block;
      font-size: 9px;
      color: #71717a;
      text-transform: uppercase;
    }
    .meta-item span {
      font-size: 12px;
      font-weight: bold;
      color: #18181b;
    }
    .section-title {
      background: #18181b;
      color: #ffffff;
      padding: 4px 8px;
      font-weight: bold;
      font-size: 11px;
      text-transform: uppercase;
      margin-top: 10px;
      margin-bottom: 6px;
      border-left: 4px solid #b91c1c;
    }
    .stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .stats-table th, .stats-table td {
      border: 1px solid #d4d4d8;
      padding: 4px 6px;
      text-align: center;
    }
    .stats-table th {
      background: #f4f4f5;
      font-size: 10px;
      color: #52525b;
    }
    .stats-table td {
      font-size: 13px;
      font-weight: bold;
      color: #b91c1c;
    }
    .combat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }
    .combat-box {
      border: 1px solid #d4d4d8;
      border-radius: 6px;
      padding: 6px;
      text-align: center;
      background: #fafafa;
    }
    .combat-box .label {
      font-size: 9px;
      color: #71717a;
      text-transform: uppercase;
      font-weight: bold;
    }
    .combat-box .val {
      font-size: 16px;
      font-weight: 900;
      color: #18181b;
      margin-top: 2px;
    }
    .table-data {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 10px;
    }
    .table-data th, .table-data td {
      border: 1px solid #d4d4d8;
      padding: 5px;
      text-align: left;
    }
    .table-data th {
      background: #f4f4f5;
      font-weight: bold;
      color: #3f3f46;
      text-transform: uppercase;
      font-size: 9px;
    }
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .lifepath-box {
      background: #fafafa;
      border: 1px solid #e4e4e7;
      padding: 8px;
      border-radius: 6px;
      font-size: 10px;
      line-height: 1.4;
    }
    .lifepath-box strong {
      color: #b91c1c;
    }
    .footer-note {
      margin-top: 15px;
      border-top: 1px dashed #a1a1aa;
      padding-top: 6px;
      font-size: 9px;
      color: #71717a;
      display: flex;
      justify-content: space-between;
    }
    .portrait {
      width: 70px;
      height: 70px;
      object-fit: cover;
      border-radius: 6px;
      border: 2px solid #b91c1c;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div style="display: flex; align-items: center; gap: 12px;">
      ${char.imageUrl ? `<img src="${char.imageUrl}" class="portrait" alt="Foto" />` : ''}
      <div class="title-box">
        <h1>${char.name}</h1>
        <h2>Codinome: "${char.handle || 'Desconhecido'}" // ${char.role.toUpperCase()}</h2>
      </div>
    </div>
    <div style="text-align: right;">
      <span class="badge">Cyberpunk ${char.system || 'RED'} 2045</span>
      <div style="font-size: 9px; color: #71717a; margin-top: 4px;">Dossiê Tático Oficial</div>
    </div>
  </div>

  <!-- META BAR -->
  <div class="meta-grid">
    <div class="meta-item">
      <strong>Papel / Role</strong>
      <span>${char.role}</span>
    </div>
    <div class="meta-item">
      <strong>Habilidade de Papel</strong>
      <span>${roleAbility.name} (Rank ${roleAbility.rank})</span>
    </div>
    <div class="meta-item">
      <strong>Eurodólares (eb)</strong>
      <span>${char.cashEb || 0} eb</span>
    </div>
    <div class="meta-item">
      <strong>Reputação & IP</strong>
      <span>Rep ${char.reputation ?? 2} // ${char.improvementPoints ?? 0} IP</span>
    </div>
  </div>

  <!-- STATS MATRIX (ATRIBUTOS) -->
  <div class="section-title">1. Matriz de Atributos Oficiais (Stats RED)</div>
  <table class="stats-table">
    <thead>
      <tr>
        <th>INT</th>
        <th>REF</th>
        <th>DEX</th>
        <th>TECH</th>
        <th>COOL</th>
        <th>WILL</th>
        <th>LUCK</th>
        <th>MOVE</th>
        <th>BODY</th>
        <th>EMP</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${char.statsRED?.INT ?? 6}</td>
        <td>${char.statsRED?.REF ?? 6}</td>
        <td>${char.statsRED?.DEX ?? 6}</td>
        <td>${char.statsRED?.TECH ?? 6}</td>
        <td>${char.statsRED?.COOL ?? 6}</td>
        <td>${char.statsRED?.WILL ?? 6}</td>
        <td>${char.statsRED?.LUCK ?? 6}</td>
        <td>${char.statsRED?.MOVE ?? 6}</td>
        <td>${char.statsRED?.BODY ?? 6}</td>
        <td>${char.statsRED?.EMP ?? 6}</td>
      </tr>
    </tbody>
  </table>

  <!-- COMBAT VITALS & ARMOR -->
  <div class="section-title">2. Condição Física, Blindagem & Sobrevivência</div>
  <div class="combat-grid">
    <div class="combat-box">
      <div class="label">Pontos de Vida (HP)</div>
      <div class="val">${char.currentHP} / ${char.maxHP}</div>
    </div>
    <div class="combat-box">
      <div class="label">Ferimento Grave / Morte</div>
      <div class="val" style="font-size: 13px;">Grave: &le;${seriouslyWounded} | SV: ${deathSave}</div>
    </div>
    <div class="combat-box">
      <div class="label">Humanidade / Máx</div>
      <div class="val">${char.humanity} / ${char.maxHumanity}</div>
    </div>
    <div class="combat-box">
      <div class="label">SP Cabeça / Corpo</div>
      <div class="val">C: ${char.headSP ?? 0} | B: ${char.bodySP ?? 0}</div>
    </div>
  </div>

  <!-- ARSENAL DE ARMAS -->
  <div class="section-title">3. Arsenal de Armas & Acessórios</div>
  <table class="table-data">
    <thead>
      <tr>
        <th>Arma</th>
        <th>Dano</th>
        <th>CdT</th>
        <th>Munição / Calibre</th>
        <th>Pente</th>
        <th>Acessórios & Notas</th>
      </tr>
    </thead>
    <tbody>
      ${(char.weapons || []).map(w => `
        <tr>
          <td><strong>${w.name}</strong></td>
          <td style="color: #b91c1c; font-weight: bold;">${w.damage}</td>
          <td>${w.rof || 1}</td>
          <td>${w.ammoType || 'Padrão'}</td>
          <td>${w.magCurrent}/${w.magCapacity}</td>
          <td>${w.notes || '-'}</td>
        </tr>
      `).join('')}
      ${(!char.weapons || char.weapons.length === 0) ? '<tr><td colspan="6" style="text-align:center; color:#a1a1aa;">Nenhuma arma equipada no arsenal.</td></tr>' : ''}
    </tbody>
  </table>

  <!-- 2-COLUMNS: CIBERWARE & EQUIPAMENTOS -->
  <div class="grid-2col">
    <div>
      <div class="section-title">4. Ciberware Instalado (${(char.cyberware || []).length})</div>
      <table class="table-data">
        <thead>
          <tr>
            <th>Implante</th>
            <th>Tipo</th>
            <th>Perda Hum.</th>
          </tr>
        </thead>
        <tbody>
          ${(char.cyberware || []).map(c => `
            <tr>
              <td><strong>${c.name}</strong><br><span style="font-size:8px; color:#71717a;">${c.description || ''}</span></td>
              <td>${c.type || '-'}</td>
              <td style="color: #b91c1c; font-weight: bold;">-${c.humanityCost || 0}</td>
            </tr>
          `).join('')}
          ${(!char.cyberware || char.cyberware.length === 0) ? '<tr><td colspan="3" style="text-align:center; color:#a1a1aa;">Sem ciberware instalado (Carne Pura).</td></tr>' : ''}
        </tbody>
      </table>
    </div>

    <div>
      <div class="section-title">5. Mochila & Suprimentos (${(char.gear || []).length} Itens)</div>
      <div class="lifepath-box" style="min-height: 120px;">
        ${(char.gear || []).length > 0
          ? `<ul>${(char.gear || []).map(g => `<li style="margin-bottom: 2px;">• ${g}</li>`).join('')}</ul>`
          : '<p style="color:#a1a1aa;">Mochila vazia.</p>'
        }
      </div>
    </div>
  </div>

  <!-- LIFEPATH & BACKGROUND -->
  <div class="section-title">6. Lifepath & Histórico Pessoal</div>
  <div class="lifepath-box">
    ${char.lifepath ? `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
        <div><strong>Origem Cultural:</strong> ${char.lifepath.culturalOrigin || 'Night City'}</div>
        <div><strong>Personalidade:</strong> ${char.lifepath.personality || 'Frio e cauteloso'}</div>
        <div><strong>Estilo & Cabelo:</strong> ${char.lifepath.clothingStyle || 'Streetwear'} // ${char.lifepath.hairstyle || 'Curto raspado'}</div>
        <div><strong>O que mais valoriza:</strong> ${char.lifepath.valueMost || 'Sobrevivência'}</div>
        <div><strong>Pessoa Importante:</strong> ${char.lifepath.valuedPerson || 'Ninguém'}</div>
        <div><strong>Objetivo de Vida:</strong> ${char.lifepath.lifeGoals || 'Se tornar uma Lenda do Afterlife'}</div>
      </div>
      ${char.notes ? `<div style="margin-top:6px; border-top:1px dashed #d4d4d8; padding-top:4px;"><strong>Notas Adicionais:</strong> ${char.notes}</div>` : ''}
    ` : '<p>Histórico não gerado.</p>'}
  </div>

  <!-- FOOTER -->
  <div class="footer-note">
    <span>Gerado por Cyberpunk RED & 2020 GM Suite // Banco de Dados IndexedDB</span>
    <span>Night City 2045 &bull; Documento Tático para Impressão & Exportação PDF</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
