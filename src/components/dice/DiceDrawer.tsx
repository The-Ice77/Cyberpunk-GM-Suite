import React, { useState } from 'react';
import { X, Dices, RotateCcw, AlertTriangle, Sparkles, Skull, HeartPulse, Send, Terminal } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface DiceRollRecord {
  id: string;
  timestamp: string;
  type: 'd10' | 'damage' | 'free' | 'crit-injury';
  summary: string;
  math: string;
  total: number;
  isCritSuccess?: boolean;
  isCritFailure?: boolean;
  isCriticalInjury?: boolean;
  injuryDetail?: {
    name: string;
    location: 'Corpo' | 'Cabeça';
    effect: string;
    treatment: string;
  };
}

interface DiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Official Cyberpunk RED Critical Injury Tables (Core Rulebook pp. 220-221)
const BODY_CRITICAL_INJURIES: { [roll: number]: { name: string; effect: string; treatment: string } } = {
  2: { name: 'Braço Amputado (Dismembered Arm)', effect: 'O braço é decepado. O personagem não pode segurar itens de duas mãos. -2 em ações físicas.', treatment: 'Cirurgia DV 15 ou Implante Cibernético' },
  3: { name: 'Perna Amputada (Dismembered Leg)', effect: 'A perna é decepada. MOVE reduzido à metade, não pode correr ou esquivar com agilidade normal.', treatment: 'Cirurgia DV 15 ou Perna Cibernética' },
  4: { name: 'Costelas Fraturadas (Broken Ribs)', effect: 'Ao final de cada turno em que se mover mais de 4m, sofre 1 dano de HP que ignora armadura.', treatment: 'Primeiros Socorros DV 13 / Cirurgia DV 13' },
  5: { name: 'Braço Quebrado (Broken Arm)', effect: 'O braço afetado fica inútil e pendurado. Não pode segurar nada com ele.', treatment: 'Primeiros Socorros DV 13 / Paramédico DV 13' },
  6: { name: 'Objeto Estranho Alojado (Foreign Object)', effect: 'Um estilhaço ou bala está preso no músculo. -2 em todas as rolagens até ser extraído.', treatment: 'Primeiros Socorros DV 13' },
  7: { name: 'Lesão Espinhal (Spinal Injury)', effect: 'Próxima ação de esquiva sofre -4. MOVE reduzido em -2.', treatment: 'Cirurgia DV 15' },
  8: { name: 'Dedos Esmagados (Crushed Fingers)', effect: '-4 em testes de ataque e destreza manual com esta mão.', treatment: 'Primeiros Socorros DV 13 / Paramédico DV 13' },
  9: { name: 'Perna Quebrada (Broken Leg)', effect: 'MOVE reduzido em -4 (mínimo 1). O personagem não pode correr.', treatment: 'Primeiros Socorros DV 13 / Paramédico DV 13' },
  10: { name: 'Músculo Rompido (Torn Muscle)', effect: '-2 em todos os testes de combate corpo a corpo e atletismo.', treatment: 'Primeiros Socorros DV 13' },
  11: { name: 'Hemorragia Interna (Internal Bleeding)', effect: 'Ao final de cada turno de combate, sofre 1d6 de dano direto aos Pontos de Vida!', treatment: 'Cirurgia DV 15 emergencial' },
  12: { name: 'Pulmão Perfurado (Collapsed Lung)', effect: 'MOVE reduzido em -2. O personagem não pode segurar a respiração ou correr.', treatment: 'Cirurgia DV 15' },
};

const HEAD_CRITICAL_INJURIES: { [roll: number]: { name: string; effect: string; treatment: string } } = {
  2: { name: 'Olho Arrancado (Lost Eye)', effect: 'O olho é destruído permanentemente. -4 em ataques à distância e testes de percepção visual.', treatment: 'Cirurgia DV 15 ou Ciberolho' },
  3: { name: 'Trauma Cerebral (Brain Injury)', effect: 'Dano neurológico grave. Atributos INT, REF e DEX reduzidos em -2 cada.', treatment: 'Cirurgia DV 17 de alta tecnologia' },
  4: { name: 'Olho Danificado (Damaged Eye)', effect: '-2 em ataques à distância e percepção visual até ser operado.', treatment: 'Primeiros Socorros DV 13 / Cirurgia DV 13' },
  5: { name: 'Concussão Severa (Concussion)', effect: '-2 em todas as ações e testes de perícia devido a tontura e vertigem.', treatment: 'Primeiros Socorros DV 13' },
  6: { name: 'Crânio Fraturado (Fractured Skull)', effect: 'O alvo fica imediatamente atordoado (Stunned) por 1 rodada. Dano mental iminente.', treatment: 'Cirurgia DV 15' },
  7: { name: 'Ouvido Danificado (Damaged Ear)', effect: '-2 em testes de percepção auditiva.', treatment: 'Primeiros Socorros DV 13' },
  8: { name: 'Traqueia Esmagada (Crushed Windpipe)', effect: 'Não pode falar. Começa a sufocar e perde 1d6 HP por rodada se não for intubado.', treatment: 'Cirurgia DV 15 emergencial' },
  9: { name: 'Mandíbula Fraturada (Broken Jaw)', effect: 'Não pode falar nem morder. Dificuldade extrema para se comunicar por rádio.', treatment: 'Paramédico DV 13 / Cirurgia DV 13' },
  10: { name: 'Orelha Arrancada (Lost Ear)', effect: '-4 em testes de percepção auditiva do lado afetado.', treatment: 'Cirurgia DV 13' },
  11: { name: 'Lesão Cervical / Chicote (Whiplash)', effect: '-2 em todas as ações de REF e DEX.', treatment: 'Primeiros Socorros DV 13' },
  12: { name: 'Ferimento Craniano Letal (Fatal Head Trauma)', effect: 'Trauma catastrófico. O alvo cai imediatamente em Estado de Morte (Mortally Wounded)!', treatment: 'Cirurgia DV 17 imediata' },
};

export const DiceDrawer: React.FC<DiceDrawerProps> = ({ isOpen, onClose }) => {
  const { isRed } = useSystem();
  const [modifier, setModifier] = useState<number>(10);
  const [modifierName, setModifierName] = useState<string>('Perícia + Atributo');
  const [freeFormula, setFreeFormula] = useState<string>('2d10+4');
  const [d6Count, setD6Count] = useState<number>(3);
  const [history, setHistory] = useState<DiceRollRecord[]>([]);

  if (!isOpen) return null;

  // D10 Exploding Roll Logic
  const rollD10 = () => {
    const firstRoll = Math.floor(Math.random() * 10) + 1;
    let mathStr = `${firstRoll}`;
    let isCritSuccess = false;
    let isCritFailure = false;
    let rollResult = firstRoll;

    if (firstRoll === 10) {
      isCritSuccess = true;
      const secondRoll = Math.floor(Math.random() * 10) + 1;
      mathStr = `10 (Explosão!) + ${secondRoll}`;
      rollResult = 10 + secondRoll;
    } else if (firstRoll === 1) {
      isCritFailure = true;
      const fumbleRoll = Math.floor(Math.random() * 10) + 1;
      mathStr = `1 (Falha Crítica!) - ${fumbleRoll}`;
      rollResult = 1 - fumbleRoll;
    }

    const grandTotal = rollResult + modifier;
    const finalMath = `${mathStr} + Mod(${modifier}) = ${grandTotal}`;

    const record: DiceRollRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'd10',
      summary: `Rolagem 1d10 + ${modifierName || 'Mod'}`,
      math: finalMath,
      total: grandTotal,
      isCritSuccess,
      isCritFailure,
    };

    setHistory(prev => [record, ...prev.slice(0, 24)]);
  };

  // Damage Roll Logic (Xd6)
  const rollDamage = (count: number) => {
    const dice: number[] = [];
    let sixesCount = 0;
    let sum = 0;

    for (let i = 0; i < count; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      dice.push(val);
      sum += val;
      if (val === 6) sixesCount++;
    }

    const hasCritInjury = isRed && sixesCount >= 2;
    let total = sum;
    let summaryText = `Dano ${count}d6 [${dice.join(', ')}]`;

    if (hasCritInjury) {
      total += 5;
      summaryText += ` • ALERTA DE CRÍTICO (+5 Bônus)`;
    }

    const record: DiceRollRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'damage',
      summary: summaryText,
      math: `${dice.join(' + ')}${hasCritInjury ? ' + 5 (Ferimento Crítico)' : ''} = ${total}`,
      total,
      isCriticalInjury: hasCritInjury,
    };

    setHistory(prev => [record, ...prev.slice(0, 24)]);
  };

  // Roll Quick Single Die (d4, d6, d8, d10, d12, d20, d100)
  const rollQuickDie = (sides: number) => {
    const val = Math.floor(Math.random() * sides) + 1;
    const record: DiceRollRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'free',
      summary: `Dado Rápido 1d${sides}`,
      math: `1d${sides} = ${val}`,
      total: val,
    };
    setHistory(prev => [record, ...prev.slice(0, 24)]);
  };

  // Free Formula Parser (e.g. 2d10+4, 1d100, 3d6+2)
  const rollFreeFormula = () => {
    const clean = freeFormula.trim().toLowerCase();
    const regex = /^(\d+)?d(\d+)([\+\-]\d+)?$/;
    const match = clean.match(regex);

    if (!match) {
      alert('Formato de fórmula inválido! Use exemplos como: 2d10+4, 1d100, 3d6-1, 1d20, 5d6');
      return;
    }

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const mod = match[3] ? parseInt(match[3]) : 0;

    const rolls: number[] = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      sum += r;
    }

    const total = sum + mod;
    const mathStr = `${rolls.join(' + ')}${mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : ''} = ${total}`;

    const record: DiceRollRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'free',
      summary: `Fórmula Livre: ${freeFormula} [${count}d${sides}]`,
      math: mathStr,
      total,
    };

    setHistory(prev => [record, ...prev.slice(0, 24)]);
  };

  // Critical Injury Roller (Body vs Head 2d6)
  const rollCriticalInjury = (loc: 'Corpo' | 'Cabeça') => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;

    const table = loc === 'Corpo' ? BODY_CRITICAL_INJURIES : HEAD_CRITICAL_INJURIES;
    const injury = table[sum] || table[7];

    const record: DiceRollRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'crit-injury',
      summary: `Ferimento Crítico no(a) ${loc} [Rolagem 2d6: ${d1}+${d2}=${sum}]`,
      math: `2d6 (${d1}+${d2}) = ${sum} → ${injury.name}`,
      total: sum,
      isCriticalInjury: true,
      injuryDetail: {
        name: injury.name,
        location: loc,
        effect: injury.effect,
        treatment: injury.treatment,
      },
    };

    setHistory(prev => [record, ...prev.slice(0, 24)]);
  };

  return (
    <>
      {/* Mobile & Desktop Dimmer Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0c0c10] border-l border-[#27272a] shadow-2xl flex flex-col transition-transform">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a] bg-[#121217]">
        <div className="flex items-center gap-2 text-zinc-100 font-semibold tracking-wide">
          <Dices className="w-5 h-5 text-red-500" />
          <span className="font-mono text-sm uppercase tracking-wider">Rolador Universal de Dados</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          aria-label="Fechar gaveta"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Quick Dice Bar (d4 to d100) */}
        <div className="p-3 rounded-xl bg-[#14141a] border border-[#27272a] space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
            Dados Rápidos RPG
          </span>
          <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs">
            {[4, 6, 8, 10, 12, 20, 100].map(s => (
              <button
                key={s}
                onClick={() => rollQuickDie(s)}
                className="py-2 rounded-lg bg-[#0a0a0d] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-red-500/60 transition font-bold"
              >
                d{s}
              </button>
            ))}
          </div>
        </div>

        {/* Free Formula Parser */}
        <div className="p-4 rounded-xl bg-[#14141a] border border-[#27272a] space-y-2.5">
          <span className="text-xs font-mono uppercase text-zinc-300 font-semibold block">
            Fórmula Livre Customizada
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={freeFormula}
              onChange={e => setFreeFormula(e.target.value)}
              placeholder="ex: 2d10+4, 1d100, 3d6+2..."
              className="flex-1 bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={rollFreeFormula}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-red-500" />
              <span>Rolar</span>
            </button>
          </div>
        </div>

        {/* Section 1: 1d10 Exploding Check */}
        <div className="p-4 rounded-xl bg-[#14141a] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              Teste Cyberpunk (1d10 Explodindo)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">10 soma / 1 subtrai</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1">Ação / Perícia</label>
              <input
                type="text"
                value={modifierName}
                onChange={e => setModifierName(e.target.value)}
                placeholder="Ex: REF + Handgun"
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1">Bônus Total</label>
              <input
                type="number"
                value={modifier}
                onChange={e => setModifier(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-mono font-semibold"
              />
            </div>
          </div>

          <button
            onClick={rollD10}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs py-2.5 rounded-xl transition shadow-sm font-mono active:scale-[0.99]"
          >
            <Dices className="w-4 h-4" />
            <span>Rolar 1d10 + {modifier}</span>
          </button>
        </div>

        {/* Section 2: Damage Dice Xd6 */}
        <div className="p-4 rounded-xl bg-[#14141a] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              Rolagem de Dano (Xd6)
            </span>
            {isRed && (
              <span className="text-[10px] font-mono text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 2+ Seis = Crítico (+5)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 8].map(qty => (
              <button
                key={qty}
                onClick={() => {
                  setD6Count(qty);
                  rollDamage(qty);
                }}
                className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-lg border transition ${
                  d6Count === qty
                    ? 'bg-zinc-800 text-red-400 border-red-500/50'
                    : 'bg-[#0a0a0d] text-zinc-300 border-[#27272a] hover:bg-zinc-800'
                }`}
              >
                {qty}d6
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Official Critical Injury Table Roller */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-red-500" />
              <span>Sorteador de Ferimentos Críticos (2d6)</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Tabelas Oficiais RED</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => rollCriticalInjury('Corpo')}
              className="py-2.5 rounded-lg bg-zinc-900 hover:bg-red-900/40 border border-zinc-800 hover:border-red-700/60 text-xs font-mono font-semibold text-zinc-200 transition"
            >
              Crítico no Corpo (2d6)
            </button>
            <button
              onClick={() => rollCriticalInjury('Cabeça')}
              className="py-2.5 rounded-lg bg-zinc-900 hover:bg-red-900/40 border border-zinc-800 hover:border-red-700/60 text-xs font-mono font-semibold text-zinc-200 transition"
            >
              Crítico na Cabeça (2d6)
            </button>
          </div>
        </div>

        {/* Section 4: Roll History */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Histórico de Rolagens ({history.length})
            </span>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Limpar
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-600 border border-dashed border-[#27272a] rounded-xl font-mono">
              Nenhuma rolagem feita ainda.
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition ${
                    item.injuryDetail
                      ? 'bg-red-950/40 border-red-700/80 shadow-md'
                      : item.isCriticalInjury
                      ? 'bg-amber-950/20 border-amber-600/50'
                      : item.isCritSuccess
                      ? 'bg-emerald-950/20 border-emerald-600/50'
                      : item.isCritFailure
                      ? 'bg-red-950/20 border-red-600/50'
                      : 'bg-[#14141a] border-[#27272a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-300 font-medium">{item.summary}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{item.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between font-mono">
                    <span className="text-zinc-400 text-[11px]">{item.math}</span>
                    <span
                      className={`text-base font-bold ${
                        item.injuryDetail
                          ? 'text-red-400'
                          : item.isCriticalInjury
                          ? 'text-amber-400'
                          : item.isCritSuccess
                          ? 'text-emerald-400'
                          : item.isCritFailure
                          ? 'text-red-400'
                          : 'text-zinc-100'
                      }`}
                    >
                      {item.total}
                    </span>
                  </div>

                  {item.injuryDetail && (
                    <div className="p-2.5 rounded-lg bg-black/60 border border-red-800/40 text-[11px] space-y-1 mt-1 font-sans">
                      <div className="text-red-400 font-bold">{item.injuryDetail.name}</div>
                      <div className="text-zinc-300 leading-relaxed">{item.injuryDetail.effect}</div>
                      <div className="text-[10px] font-mono text-zinc-400 pt-0.5">
                        <strong>Tratamento:</strong> {item.injuryDetail.treatment}
                      </div>
                    </div>
                  )}

                  {item.isCriticalInjury && !item.injuryDetail && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold pt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Ferimento Crítico Ativado (+5 dano no HP)!</span>
                    </div>
                  )}
                  {item.isCritSuccess && (
                    <div className="text-[11px] text-emerald-400 font-semibold font-mono">
                      Sucesso Crítico (10 Explodiu)!
                    </div>
                  )}
                  {item.isCritFailure && (
                    <div className="text-[11px] text-red-400 font-semibold font-mono">
                      Falha Crítica (1 Subtraiu)!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
};
