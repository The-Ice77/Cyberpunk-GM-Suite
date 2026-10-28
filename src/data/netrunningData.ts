export interface BlackIceStatBlock {
  name: string;
  classType: 'Anti-Personnel' | 'Anti-Program';
  spd: number;
  hp: number;
  atk: number;
  def: number;
  effect: string;
  citation: string;
}

export const RED_BLACK_ICE_ROSTER: BlackIceStatBlock[] = [
  { name: 'Hellhound (Cão Infernal)', classType: 'Anti-Personnel', spd: 4, hp: 20, atk: 6, def: 6, effect: 'Causa 2d6 de dano diretamente aos Pontos de Vida (HP) da mente do Netrunner e incendeia o cyberdeck (1d6 de dano contínuo a cada turno até apagar).', citation: 'CP:R p. 206 • Data Screen' },
  { name: 'Giant (Gigante)', classType: 'Anti-Personnel', spd: 2, hp: 25, atk: 8, def: 4, effect: 'Causa 3d6 de dano diretamente ao HP do Netrunner e derruba a conexão neural no chão mental.', citation: 'CP:R p. 206' },
  { name: 'Asp (Áspide)', classType: 'Anti-Personnel', spd: 6, hp: 15, atk: 4, def: 2, effect: 'Injeta neurotoxina mental: causa 3d6 dano ao HP se o Netrunner falhar em teste de DV13 Resist Torture/Drugs.', citation: 'CP:R p. 205' },
  { name: 'Kraken', classType: 'Anti-Personnel', spd: 2, hp: 30, atk: 8, def: 4, effect: 'Agarra o Netrunner no andar: impede de usar a ação Slide (escapar) até ser destruído ou solto.', citation: 'CP:R p. 206' },
  { name: 'Liche', classType: 'Anti-Personnel', spd: 4, hp: 25, atk: 8, def: 2, effect: 'Drena a capacidade cognitiva: causa 1d6 de dano cerebral e reduz temporariamente o atributo INT em 1.', citation: 'CP:R p. 206' },
  { name: 'Raven (Corvo)', classType: 'Anti-Program', spd: 8, hp: 15, atk: 6, def: 4, effect: 'Desinstala e destrói (De-rez) imediatamente um programa Defensor ativo do cyberdeck do Netrunner.', citation: 'CP:R p. 206' },
  { name: 'Scorpion (Escorpião)', classType: 'Anti-Personnel', spd: 6, hp: 15, atk: 6, def: 2, effect: 'Paralisa o Netrunner no meatspace: o corpo físico fica incapaz de se mover na próxima rodada física.', citation: 'CP:R p. 207' },
  { name: 'Skunk (Gambá)', classType: 'Anti-Personnel', spd: 4, hp: 10, atk: 4, def: 2, effect: 'Emite estática fétida que impõe -2 em todas as Ações de Interface do Netrunner até que saia da arquitetura.', citation: 'CP:R p. 207' },
  { name: 'Dragon (Dragão)', classType: 'Anti-Program', spd: 6, hp: 30, atk: 8, def: 6, effect: 'Destrói instantaneamente até 2 programas ativos e causa 1d6 de dano ao HP do Netrunner se penetrar a defesa.', citation: 'CP:R p. 206' },
  { name: 'Killer (Assassino)', classType: 'Anti-Program', spd: 6, hp: 20, atk: 6, def: 4, effect: 'Destrói (De-rez) imediatamente qualquer programa que não seja Black ICE ativo no deck.', citation: 'CP:R p. 206' },
];

export interface Net2020Program {
  name: string;
  category: 'Série Demônio' | 'Anti-Sistemas' | 'Anti-Pessoal (Lethal Black ICE)' | 'Utilitários & Decodificadores';
  strength: number;
  mu: number;
  cost: string;
  effect: string;
  citation: string;
}

export const CP2020_PROGRAMS_ROSTER: Net2020Program[] = [
  { name: 'Imp (Diabrete)', category: 'Série Demônio', strength: 3, mu: 3, cost: '600eb', effect: 'Demônio rápido e compacto; pode carregar e executar 2 programas secundários independentes em cada turno de combate.', citation: 'CP2020 p. 165' },
  { name: 'Afreet (Afrite)', category: 'Série Demônio', strength: 5, mu: 6, cost: '1.200eb', effect: 'Demônio alado flamejante; ataca com bola de fogo de dados e coordena defesas da fortaleza de dados.', citation: 'CP2020 p. 165' },
  { name: 'Succubus (Súcubo)', category: 'Série Demônio', strength: 6, mu: 8, cost: '2.500eb', effect: 'Disfarça o código da fortaleza e seduz programas invasores, assumindo o controle do cyberdeck inimigo.', citation: 'CP2020 p. 166' },
  { name: 'Balron (O Grande Demônio)', category: 'Série Demônio', strength: 8, mu: 12, cost: '5.000eb', effect: 'Monstro lendário de código que destrói programas invasores e frita os circuitos do deck do Netrunner.', citation: 'CP2020 p. 166' },
  { name: 'Killer 2020', category: 'Anti-Sistemas', strength: 4, mu: 5, cost: '500eb', effect: 'Programa de corte que quebra outros softwares reduzindo sua Força a 0.', citation: 'CP2020 p. 160' },
  { name: 'Cão Infernal (Hellhound 2020)', category: 'Anti-Pessoal (Lethal Black ICE)', strength: 6, mu: 6, cost: '1.500eb', effect: 'Black ICE letal; rastreia o sinal do Netrunner e queima seus centros neurais através dos plugues (dano letal ao cérebro).', citation: 'CP2020 p. 168' },
  { name: 'Apagão Mental (Brainwipe)', category: 'Anti-Pessoal (Lethal Black ICE)', strength: 7, mu: 8, cost: '3.000eb', effect: 'Apaga permanentemente as memórias e perícias do invasor transformando-o em um vegetal vivo.', citation: 'CP2020 p. 168' },
  { name: 'Descriptografador Raffles', category: 'Utilitários & Decodificadores', strength: 5, mu: 3, cost: '550eb', effect: 'Decodifica portões de código e arquivos protegidos em sistemas corporativos.', citation: 'CP2020 p. 158' },
];

export const DATA_FORTRESS_THEMES_2020 = [
  { name: 'Castelo Gótico Obscuro', description: 'Paredes de pedra negra virtual, gárgulas vigilantes como câmeras e tochas roxas crepitando.' },
  { name: 'Sala de Conselho Corporativo em Mármore', description: 'Mobiliário sóbrio de mogno holográfico, retratos de executivos vigiando e portas com maçanetas de platina.' },
  { name: 'Selva Sintética Tron', description: 'Cipós de fibra óptica neon verde e azul escorrendo de árvores poligonais, sons de animais robóticos.' },
  { name: 'Bunker Militar Brutalista', description: 'Portas de chumbo com aviso de radiação amarela, sirenes giratórias vermelhas e chão de grade de aço.' },
  { name: 'Templo Shinto Minimalista', description: 'Portões Torii de dados vermelhos marcando os Code Gates, sinos tocando quando intrusos passam.' },
];
