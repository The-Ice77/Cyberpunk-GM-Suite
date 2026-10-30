import React from 'react';
import { Gauge, Shield, Crosshair, Cpu, Sparkles, RotateCcw } from 'lucide-react';
import {
  ThreatCalibration,
  ThreatTrait,
  DEFAULT_CALIBRATION,
  ARMOR_BIAS_OPTIONS,
  WEAPON_BIAS_OPTIONS,
  CYBER_LEVEL_OPTIONS,
  TRAIT_OPTIONS,
  getPowerLabel,
  describeCalibration,
  isDefaultCalibration,
} from '../../utils/threatScaling';

interface Props {
  value: ThreatCalibration;
  onChange: (next: ThreatCalibration) => void;
  /** Exibe controle de variação individual (tropas). */
  showSpread?: boolean;
  accent?: 'red' | 'amber';
}

const chip = (active: boolean, accent: 'red' | 'amber') =>
  `px-2 py-1.5 rounded-lg border text-[11px] font-mono text-left transition min-w-0 break-words ${
    active
      ? accent === 'red'
        ? 'bg-red-950/60 border-red-500 text-red-200'
        : 'bg-amber-950/60 border-amber-500 text-amber-200'
      : 'bg-[#0a0a0d] border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
  }`;

const ThreatCalibrationPanel: React.FC<Props> = ({ value, onChange, showSpread = false, accent = 'red' }) => {
  const label = getPowerLabel(value.powerOffset);
  const set = (patch: Partial<ThreatCalibration>) => onChange({ ...value, ...patch });
  const toggleTrait = (t: ThreatTrait) =>
    set({ traits: value.traits.includes(t) ? value.traits.filter(x => x !== t) : [...value.traits, t] });

  return (
    <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-4 overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2 min-w-0">
          <Gauge className={`w-4 h-4 shrink-0 ${accent === 'red' ? 'text-red-400' : 'text-amber-400'}`} />
          <span className="truncate">Calibragem de Poder</span>
        </span>
        <button
          type="button"
          disabled={isDefaultCalibration(value)}
          onClick={() => onChange({ ...DEFAULT_CALIBRATION })}
          className="text-[10px] font-mono text-zinc-500 hover:text-zinc-200 disabled:opacity-30 flex items-center gap-1 shrink-0"
        >
          <RotateCcw className="w-3 h-3" /> Resetar
        </button>
      </div>

      {/* Power slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs font-mono">
          <span className="text-zinc-400">Nível do Ser:</span>
          <span className={`font-bold ${label.color}`}>
            {label.label} ({value.powerOffset > 0 ? '+' : ''}
            {value.powerOffset})
          </span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={value.powerOffset}
          onChange={e => set({ powerOffset: Number(e.target.value) })}
          className={`w-full ${accent === 'red' ? 'accent-red-500' : 'accent-amber-500'}`}
        />
        <div className="flex justify-between text-[9px] font-mono text-zinc-600">
          <span>Inofensivo</span>
          <span>Padrão</span>
          <span>Lendário</span>
        </div>
        <p className="text-[10px] text-zinc-500 leading-snug">{label.desc}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {describeCalibration(value).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-cyan-300">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Armor */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Blindagem
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {ARMOR_BIAS_OPTIONS.map(o => (
            <button key={o.id} type="button" onClick={() => set({ armorBias: o.id })} className={chip(value.armorBias === o.id, accent)}>
              {o.label} {o.delta !== 0 && <span className="opacity-60">({o.delta > 0 ? '+' : ''}{o.delta} SP)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Weapons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5" /> Qualidade do Armamento
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {WEAPON_BIAS_OPTIONS.map(o => (
            <button key={o.id} type="button" onClick={() => set({ weaponBias: o.id })} className={chip(value.weaponBias === o.id, accent)}>
              {o.label} {o.dice !== 0 && <span className="opacity-60">({o.dice > 0 ? '+' : ''}{o.dice}d6)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Cyberware */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" /> Nível de Ciberware
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {CYBER_LEVEL_OPTIONS.map(o => (
            <button key={o.id} type="button" onClick={() => set({ cyberLevel: o.id })} className={chip(value.cyberLevel === o.id, accent)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Traits */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Traços Especiais
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {TRAIT_OPTIONS.map(t => (
            <button
              key={t.id}
              type="button"
              title={t.desc}
              onClick={() => toggleTrait(t.id)}
              className={chip(value.traits.includes(t.id), accent)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {showSpread && (
        <div className="space-y-1.5 pt-1 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Variação entre membros:</span>
            <span className="text-amber-300 font-bold">{value.spread === 0 ? 'Uniforme' : `±${value.spread}`}</span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={value.spread}
            onChange={e => set({ spread: Number(e.target.value) })}
            className="w-full accent-amber-500"
          />
          <p className="text-[10px] text-zinc-500 leading-snug">
            Mistura recrutas e veteranos na mesma tropa. O líder sempre recebe +1 nível sobre o nível base.
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreatCalibrationPanel;
