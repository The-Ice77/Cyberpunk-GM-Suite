/**
 * Cyberpunk RED Dice Rolling Utility
 * Supports NdX, modifiers, explosive d10 (RED rules), and damage critical detection (2+ sixes on d6).
 */

export interface DiceRollResult {
  formula: string;
  diceCount: number;
  diceSides: number;
  modifier: number;
  rolls: number[];
  explosions?: number[]; // For RED d10 exploding dice
  fumbles?: number[];    // For RED d10 fumble subtraction
  total: number;
  isCritInjury: boolean; // Cyberpunk RED: 2 or more sixes on d6 damage
  sixesCount: number;
  isExploded: boolean;
  isFumbled: boolean;
  breakdown: string;
}

export function parseAndRollDice(formula: string): DiceRollResult | null {
  // Matches expressions like: 3d6, 1d10+5, 4d6-2, 2d10+12, d6, d10
  const clean = formula.trim().toLowerCase();
  const match = clean.match(/^(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?$/i);
  if (!match) return null;

  const diceCount = match[1] ? Math.max(1, parseInt(match[1], 10)) : 1;
  const diceSides = parseInt(match[2], 10);
  const sign = match[3] || '+';
  const rawMod = match[4] ? parseInt(match[4], 10) : 0;
  const modifier = sign === '-' ? -rawMod : rawMod;

  if (isNaN(diceSides) || diceSides < 2 || diceCount > 100) return null;

  const rolls: number[] = [];
  let sixesCount = 0;
  let sum = 0;

  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(Math.random() * diceSides) + 1;
    rolls.push(roll);
    sum += roll;
    if (diceSides === 6 && roll === 6) {
      sixesCount++;
    }
  }

  const isCritInjury = diceSides === 6 && sixesCount >= 2;
  let isExploded = false;
  let isFumbled = false;
  const explosions: number[] = [];
  const fumbles: number[] = [];

  // Special Cyberpunk RED rule for single d10 roll
  if (diceSides === 10 && diceCount === 1) {
    if (rolls[0] === 10) {
      isExploded = true;
      let extra = Math.floor(Math.random() * 10) + 1;
      explosions.push(extra);
      sum += extra;
      while (extra === 10) {
        extra = Math.floor(Math.random() * 10) + 1;
        explosions.push(extra);
        sum += extra;
      }
    } else if (rolls[0] === 1) {
      isFumbled = true;
      let extra = Math.floor(Math.random() * 10) + 1;
      fumbles.push(extra);
      sum -= extra;
      while (extra === 10) {
        extra = Math.floor(Math.random() * 10) + 1;
        fumbles.push(extra);
        sum -= extra;
      }
    }
  }

  const total = sum + modifier;

  let breakdown = `${diceCount}d${diceSides} [${rolls.join(', ')}]`;
  if (explosions.length > 0) {
    breakdown += ` + EXPLOSÃO [${explosions.join(', ')}]`;
  }
  if (fumbles.length > 0) {
    breakdown += ` - FALHA [${fumbles.join(', ')}]`;
  }
  if (modifier !== 0) {
    breakdown += ` ${modifier > 0 ? '+' : ''}${modifier}`;
  }
  breakdown += ` = ${total}`;

  return {
    formula,
    diceCount,
    diceSides,
    modifier,
    rolls,
    explosions: explosions.length > 0 ? explosions : undefined,
    fumbles: fumbles.length > 0 ? fumbles : undefined,
    total,
    isCritInjury,
    sixesCount,
    isExploded,
    isFumbled,
    breakdown,
  };
}
