export interface FactionProfile {
  id: string;
  name: string;
  category: 'Trauma Team' | 'Corporação' | 'Polícia & Governo' | 'Nômades e Civis';
  description: string;
  unitTypes: {
    roleName: string;
    tier: 'mook' | 'lieutenant' | 'miniboss' | 'boss';
    equipment: string[];
    weaponsRED: string[];
    weapons2020: string[];
    tactics: string;
    notes: string;
    citation: string;
    statsRED: {
      combatNumber?: number;
      hp: number;
      spHead: number;
      spBody: number;
      move: number;
      body: number;
      will: number;
      ref: number;
      dex: number;
    };
    stats2020: {
      body: number;
      ref: number;
      cool: number;
      tech: number;
      btm: number;
      spHead: number;
      spTorso: number;
      spLimbs: number;
    };
  }[];
}

export const FACTIONS_LIST: FactionProfile[] = [
  {
    id: 'trauma-team',
    name: 'Trauma Team™ Internacional',
    category: 'Trauma Team',
    description: 'A maior corporação médica paramilitar do planeta. Suas equipes de resgate AV-4 respondem em menos de 3 minutos a clientes com cartões Gold e Platinum, com autorização legal para eliminar qualquer ameaça no caminho da maca.',
    unitTypes: [
      {
        roleName: 'Médico de Campo / Médico Chefe (Lead Medic)',
        tier: 'lieutenant',
        equipment: ['Capacete Tático com HUD Biomonitor', 'Colete Kevlar Leve Médico (SP 11)', 'Bolsa Trauma com Speedheal e Sangue Sintético', 'Desfibrilador de Choque Rápido'],
        weaponsRED: ['Pistola Pesada 3d6 (ROF 2)', 'Injetor de Criotoxina / Sedativo'],
        weapons2020: ['Pistola Sternmeyer P-35 (WA 0, Dano 3d6, Tiros 8, Rel MB)', 'Injetor Hipodérmico'],
        tactics: 'Prioriza a estabilização e evacuação do cliente enquanto os Solos mantêm a linha de fogo. Só atira se o cliente ou ele próprio forem diretamente alvejados.',
        notes: 'Possui Perícia Paramedic / Cirurgia nível 15.',
        citation: 'CP:R p. 223 • CP2020 p. 118 • Trauma Team Protocol',
        statsRED: { hp: 45, spHead: 11, spBody: 11, move: 6, body: 6, will: 7, ref: 7, dex: 7, combatNumber: 13 },
        stats2020: { body: 6, ref: 7, cool: 8, tech: 9, btm: -2, spHead: 14, spTorso: 16, spLimbs: 12 },
      },
      {
        roleName: 'Solo de Segurança Pesada Trauma Team',
        tier: 'miniboss',
        equipment: ['Armadura Pesada Metalgear / Heavy Armorjack (SP 15)', 'Capacete Hermético Tático com Visor Térmico', 'Escudo Balístico Móvel (HP 30)', 'Sandevistan Boost (+3 Ref)'],
        weaponsRED: ['Espingarda Tática Rostović 5d6', 'Fuzil de Assalto Militech 5d6 (Autofire 4)', 'Granada de Fumaça / Flashbang'],
        weapons2020: ['Fuzil Militech Ronin (WA +1, Dano 5d6, Tiros 30, CdT 30, Rel MB)', 'Espingarda Arasaka 20 WSA 4d6', 'Granadas Flash'],
        tactics: 'Cria uma parede impenetrável de fogo de supressão e escudos para proteger o perímetro da AV-4. Não aceita negociação nem rendição enquanto o cliente estiver em perigo.',
        notes: 'Combate implacável. Resposta armada automática a qualquer civil que não se afaste em 5 segundos.',
        citation: 'CP:R p. 224 • CP2020 p. 119',
        statsRED: { hp: 60, spHead: 15, spBody: 15, move: 6, body: 9, will: 8, ref: 8, dex: 8, combatNumber: 16 },
        stats2020: { body: 9, ref: 10, cool: 9, tech: 6, btm: -3, spHead: 20, spTorso: 25, spLimbs: 18 },
      },
      {
        roleName: 'Piloto / Técnico de AV-4',
        tier: 'mook',
        equipment: ['Jaqueta Leve Anti-chamas (SP 7)', 'Interface de Ligação Veicular (Vehicle Interface Plug)', 'Kit de Ferramentas Mecânicas de Emergência'],
        weaponsRED: ['Submetralhadora Compacta 2d6 (Autofire 3)', 'Pistola Média 2d6'],
        weapons2020: ['SMG Uzi 3000 (WA 0, Dano 2d6, Tiros 30, CdT 30)', 'Pistola Dai Lung 9mm'],
        tactics: 'Permanece dentro da cabine da AV-4 operando o canhão automático rotativo do teto enquanto a equipe opera em solo.',
        notes: 'Se a AV for danificada, tenta decolagem forçada imediatamente.',
        citation: 'CP:R p. 224',
        statsRED: { hp: 35, spHead: 7, spBody: 7, move: 6, body: 6, will: 6, ref: 7, dex: 7, combatNumber: 11 },
        stats2020: { body: 6, ref: 8, cool: 7, tech: 8, btm: -2, spHead: 10, spTorso: 12, spLimbs: 8 },
      },
    ],
  },
  {
    id: 'arasaka',
    name: 'Arasaka Corporation',
    category: 'Corporação',
    description: 'O temido gigante japonês de segurança e manufatura bélica. Soldados da Arasaka operam com disciplina samurai fanática, ciberware de precisão e armaduras pretas angulares.',
    unitTypes: [
      {
        roleName: 'Guarda Tático de Perímetro Arasaka',
        tier: 'mook',
        equipment: ['Colete Light Armorjack Preto Fosco (SP 11)', 'Capacete Tático com Comunicador Seguro', 'Chips de Identificação Biométrica'],
        weaponsRED: ['Fuzil de Assalto Arasaka 5d6', 'Pistola Pesada Arasaka 3d6'],
        weapons2020: ['Fuzil de Assalto Arasaka WSSA (WA +1, Dano 5d6, Tiros 30, CdT 30)', 'Pistola Arasaka WSAP 3d6'],
        tactics: 'Formação tática estrita, usando rádio silencioso e miras laser para sobrecarregar invasores com tiros de cobertura.',
        notes: 'Prefere capturar invasores vivos para interrogatório da Divisão de Inteligência.',
        citation: 'CP:R p. 272 • CP2020 p. 178',
        statsRED: { hp: 35, spHead: 11, spBody: 11, move: 6, body: 7, will: 7, ref: 7, dex: 7, combatNumber: 12 },
        stats2020: { body: 7, ref: 8, cool: 8, tech: 6, btm: -2, spHead: 14, spTorso: 16, spLimbs: 12 },
      },
      {
        roleName: 'Agente Ninja / Assassino Solo Arasaka',
        tier: 'boss',
        equipment: ['Traje Camaleônico Térmico (Furtividade +2)', 'Fiação Neural Sandevistan Ativado', 'Implante Subdérmico Reforçado (SP 13)', 'Ciberolho com Visão Noturna e Termográfica'],
        weaponsRED: ['Katana Monofilamentar de Elite 4d6 (ignora metade do SP)', 'Pistola Muito Pesada com Silenciador 4d6', 'Shurikens com Neurotoxina'],
        weapons2020: ['Katana Kendachi Mono (WA +2, Dano 4d6, ignora 2/3 SP)', 'Pistola Arasaka 11mm com Supressor', 'Dardos Venenosos'],
        tactics: 'Ataca pelas sombras com Sandevistan ligado, decapitando o líder do esquadrão antes que os alarmes possam ser acionados.',
        notes: 'Lealdade inabalável à família Arasaka; possui chip suicida embutido para evitar captura.',
        citation: 'CP:R p. 273 • CP2020 p. 179',
        statsRED: { hp: 75, spHead: 13, spBody: 13, move: 8, body: 9, will: 9, ref: 9, dex: 9, combatNumber: 18 },
        stats2020: { body: 9, ref: 11, cool: 10, tech: 8, btm: -3, spHead: 16, spTorso: 20, spLimbs: 16 },
      },
      {
        roleName: 'Executivo de Operações Arasaka',
        tier: 'lieutenant',
        equipment: ['Terno Blindado de Grife (SP 11)', 'Agente Executivo de Alto Luxo', 'Contrato com Escolta de Guarda-costas', 'Cartão Platinum de Trauma Team'],
        weaponsRED: ['Pistola Pesada Ocultável Dai Lung 3d6'],
        weapons2020: ['Pistola Walther WA-2000 ou Colt Officer 3d6'],
        tactics: 'Fica sempre atrás de seus subordinados e da blindagem, usando ações para chamar reforços e ativar defesas eletrônicas do prédio.',
        notes: 'Pode oferecer subornos vultosos ou ameaçar destruir a vida civil dos Edgerunners.',
        citation: 'CP:R p. 273',
        statsRED: { hp: 40, spHead: 11, spBody: 11, move: 5, body: 6, will: 8, ref: 6, dex: 6, combatNumber: 13 },
        stats2020: { body: 6, ref: 6, cool: 9, tech: 7, btm: -2, spHead: 12, spTorso: 14, spLimbs: 10 },
      },
    ],
  },
  {
    id: 'militech',
    name: 'Militech Arms International',
    category: 'Corporação',
    description: 'O gigante militar norte-americano. Especializado em infantaria pesada, armamento bruto, tanques urbanos e contratos de defesa corporativa.',
    unitTypes: [
      {
        roleName: 'Soldado de Choque Militech',
        tier: 'mook',
        equipment: ['Armadura Heavy Armorjack Verde Oliva (SP 13)', 'Capacete Balístico Tático com HUD', 'Rádio Criptografado Militar'],
        weaponsRED: ['Fuzil de Assalto Militech Ronin 5d6', 'Lança-Granadas Acoplado 6d6', 'Pistola Pesada 3d6'],
        weapons2020: ['Militech Ronin Light Assault 5d6 (30 tiros, CdT 30)', 'Militech Arms 45 Heavy Pistol 3d6+1'],
        tactics: 'Doutrina militar pura: supressão contínua com fuzis, granadas de fragmentação em esquinas e avanço metódico.',
        notes: 'Veteranos de combate disciplinados.',
        citation: 'CP:R p. 278 • CP2020 p. 182',
        statsRED: { hp: 40, spHead: 13, spBody: 13, move: 6, body: 8, will: 7, ref: 8, dex: 7, combatNumber: 13 },
        stats2020: { body: 8, ref: 8, cool: 8, tech: 6, btm: -3, spHead: 16, spTorso: 18, spLimbs: 14 },
      },
      {
        roleName: 'Oficial de Inteligência / Comandante de Campo',
        tier: 'lieutenant',
        equipment: ['Colete Balístico Executivo Camuflado (SP 13)', 'Cyberdeck Militar com ICE de Defesa', 'Scanner Biométrico Portátil'],
        weaponsRED: ['Submetralhadora Pesada Militech 3d6', 'Pistola Muito Pesada 4d6'],
        weapons2020: ['Militech Crusher Shotgun / Submachine gun 3d6', 'Pistola 12mm Heavy'],
        tactics: 'Coordena drones aéreos e chama ataques de morteiro ou suporte de AV armada se a resistência for duradoura.',
        notes: 'Possui autoridade para declarar quarentena em áreas civis.',
        citation: 'CP:R p. 278',
        statsRED: { hp: 50, spHead: 13, spBody: 13, move: 6, body: 8, will: 8, ref: 8, dex: 8, combatNumber: 15 },
        stats2020: { body: 8, ref: 9, cool: 9, tech: 8, btm: -3, spHead: 18, spTorso: 20, spLimbs: 16 },
      },
    ],
  },
  {
    id: 'biotechnica',
    name: 'Biotechnica / Tecnologias Médicas',
    category: 'Corporação',
    description: 'Criadores do combustível padrão do planeta, CHOOH2, e pioneiros em clonagem, engenharia genética e ciberware biológico.',
    unitTypes: [
      {
        roleName: 'Segurança de Laboratório Biológico',
        tier: 'mook',
        equipment: ['Traje de Proteção Biológica Selado (SP 11)', 'Respirador Químico', 'Injetor de Antídotos'],
        weaponsRED: ['Espingarda de Dispersão Química 5d6', 'Pistola de Dardos Tranquilizantes'],
        weapons2020: ['Espingarda Mossberg 4d6', 'Pistola de Dardo com Biotoxina'],
        tactics: 'Evitam danificar tanques de contenção de espécimes; tentam isolar portas e liberar gás soporífero nas salas.',
        notes: 'Imunes a toxinas químicas e gases nervinos devido ao traje selado.',
        citation: 'CP:R p. 274 • CP2020 p. 180',
        statsRED: { hp: 35, spHead: 11, spBody: 11, move: 6, body: 7, will: 6, ref: 7, dex: 7, combatNumber: 12 },
        stats2020: { body: 7, ref: 7, cool: 7, tech: 7, btm: -2, spHead: 12, spTorso: 14, spLimbs: 10 },
      },
    ],
  },
  {
    id: 'kang-tao',
    name: 'Kang Tao',
    category: 'Corporação',
    description: 'Gigante bélico de origem taiwanesa que dominou a vanguarda das Armas Inteligentes (Smart Weapons) e sistemas giroscópicos micro-guiados.',
    unitTypes: [
      {
        roleName: 'Operador Smartgun Kang Tao',
        tier: 'lieutenant',
        equipment: ['Capacete Tático Smart-Link Integrado', 'Colete Light Armorjack Hexagonal (SP 12)', 'Interface Neural Smartlink'],
        weaponsRED: ['Fuzil Smartgun Kang Tao Dian 5d6 (+1 no ataque e mira computadorizada)', 'Pistola Inteligente 3d6'],
        weapons2020: ['Smart Assault Rifle Kang Tao (WA +2, Dano 5d6)', 'Smart Pistol 3d6'],
        tactics: 'Disparam de trás de cobertura total usando miras ópticas angulares e projéteis que fazem curva para perseguir alvos.',
        notes: 'Suas armas não disparam se o portador não tiver a autenticação neural correta.',
        citation: 'CP:R p. 276 • Black Chrome p. 62',
        statsRED: { hp: 45, spHead: 12, spBody: 12, move: 6, body: 7, will: 7, ref: 8, dex: 8, combatNumber: 15 },
        stats2020: { body: 7, ref: 9, cool: 8, tech: 8, btm: -2, spHead: 14, spTorso: 16, spLimbs: 12 },
      },
    ],
  },
  {
    id: 'ncpd',
    name: 'Departamento de Polícia de Night City (DPNC / NCPD)',
    category: 'Polícia & Governo',
    description: 'A força policial cronicamente subfinanciada, sobrecarregada e corrupta da metrópole, dividida entre patrulheiros cansados, detetives cínicos e a temida unidade MaxTac.',
    unitTypes: [
      {
        roleName: 'Patrulheiro de Rua DPNC (NCPD Patrolman)',
        tier: 'mook',
        equipment: ['Colete Kevlar Azul Marinho com Distintivo (SP 11)', 'Rádio Policial Aberto', 'Algemas Plásticas de Trava Rápida', 'Carro de Patrulha Cruiser blindado'],
        weaponsRED: ['Pistola Pesada DPNC Oficial 3d6', 'Cassetete Elétrico Não-Letal 2d6', 'Espingarda no porta-malas 5d6'],
        weapons2020: ['Pistola Sternmeyer 9mm 2d6+3', 'Cassetete Stun', 'Espingarda Remington 4d6'],
        tactics: 'Chamam reforços pelo rádio ao primeiro sinal de tiros; se estiverem sozinhos em Zonas de Perigo, preferem ignorar o crime ou aceitar um suborno.',
        notes: 'Salário baixo e moral abalada. Não querem morrer por uma corporação.',
        citation: 'CP:R p. 293 • CP2020 p. 138',
        statsRED: { hp: 35, spHead: 7, spBody: 11, move: 6, body: 7, will: 6, ref: 7, dex: 7, combatNumber: 12 },
        stats2020: { body: 7, ref: 7, cool: 7, tech: 6, btm: -2, spHead: 10, spTorso: 14, spLimbs: 10 },
      },
      {
        roleName: 'Detetive Investigador DPNC',
        tier: 'lieutenant',
        equipment: ['Sobretudo de Kevlar Discreto (SP 11)', 'Agente Policial com Acesso ao Banco de Dados Criminal', 'Scanner Balístico e Químico Forense'],
        weaponsRED: ['Pistola Muito Pesada de Colecionador 4d6', 'Revólver Snubnose Oculto 3d6'],
        weapons2020: ['Colt AMT Model 2000 3d6+1', 'Algemas de Aço'],
        tactics: 'Usa a lábia, intimidação e contatos com Fixers de rua para cercar o suspeito antes de sacar a arma.',
        notes: 'Perícia Streetwise e Interrogação elevadas (Base 14).',
        citation: 'CP:R p. 294',
        statsRED: { hp: 45, spHead: 11, spBody: 11, move: 6, body: 7, will: 8, ref: 8, dex: 7, combatNumber: 14 },
        stats2020: { body: 7, ref: 8, cool: 9, tech: 7, btm: -2, spHead: 12, spTorso: 14, spLimbs: 10 },
      },
      {
        roleName: 'Operador MaxTac (Ciberpsico Esquadrão / Psycho Squad)',
        tier: 'boss',
        equipment: ['Armadura de Choque Flak Pesada Reforçada (SP 15)', 'Capacete Hermético Blindado com Varredura Cerebral', 'Fiação Neural Kerenzikov + Sandevistan', 'Braços e Pernas Cibernéticos com Revestimento de Titânio', 'Bomba de Estímulo de Combate'],
        weaponsRED: ['Fuzil Eletromagnético Railgun / Heavy Assault 5d6 (Autofire 4)', 'Espingarda Pesada Automática 5d6', 'Lâmina Monotérmica no Antebraço 4d6'],
        weapons2020: ['Militech Railgun / Fuzil Barret-Arasaka 5d6+2', 'Espingarda Auto-Assalto 4d6', 'Lâminas Wolvers cibernéticas'],
        tactics: 'Lethalidade máxima sem advertência verbal. Movem-se com velocidade sobre-humana, ignoram dores e esquivam de tiros com REF 9+ e Evasion 18.',
        notes: 'Monstros de combate no limiar da ciberpsicose controlada. Resposta de emergência a ciberpsicopatas.',
        citation: 'CP:R p. 294 • CP2020 p. 139 • MaxTac Protocols',
        statsRED: { hp: 80, spHead: 15, spBody: 15, move: 8, body: 10, will: 9, ref: 9, dex: 9, combatNumber: 18 },
        stats2020: { body: 10, ref: 11, cool: 10, tech: 8, btm: -4, spHead: 20, spTorso: 25, spLimbs: 20 },
      },
    ],
  },
  {
    id: 'nomads-civilians',
    name: 'Nômades e Mercenários Civis',
    category: 'Nômades e Civis',
    description: 'Gente das estradas e das ruas de Night City: clãs nômades que controlam comboios de suprimentos, corretores de rua (Fixers), cirurgiões clandestinos e Netrunners mercenários.',
    unitTypes: [
      {
        roleName: 'Guerreiro Nômade Aldecaldo / Roadrunner',
        tier: 'mook',
        equipment: ['Jaqueta de Couro Reforçado e Kevlar (SP 11)', 'Óculos de Poeira dos Badlands', 'Kit de Reparo Mecânico Rápido', 'Moto Customizada ou Picape Blindada'],
        weaponsRED: ['Rifle de Caça / Fuzil de Precisão 5d6', 'Revólver Pesado 3d6', 'Machete de Aço 2d6'],
        weapons2020: ['Winchester Combat Carbine 4d6', 'Revólver Ruger 3d6'],
        tactics: 'Aproveitam o terreno aberto, atirando de longas distâncias com miras telescópicas e usando seus veículos como cobertura dinâmica.',
        notes: 'Protegem a Família até a morte.',
        citation: 'CP:R p. 304 • CP2020 p. 147',
        statsRED: { hp: 40, spHead: 11, spBody: 11, move: 7, body: 8, will: 7, ref: 8, dex: 8, combatNumber: 13 },
        stats2020: { body: 8, ref: 8, cool: 8, tech: 7, btm: -3, spHead: 12, spTorso: 14, spLimbs: 10 },
      },
      {
        roleName: 'Fixer de Rua (Street Fixer)',
        tier: 'lieutenant',
        equipment: ['Jaqueta de Estilo Caro (SP 11)', 'Agente com Contatos VIP e Criptografia', 'Maleta Blindada com Trava Biométrica'],
        weaponsRED: ['Pistola Pesada Cromada de Luxo 3d6', 'Faca Oculta na Manga 1d6'],
        weapons2020: ['Pistola Beretta 9mm 2d6+1', 'Navalha de bolso'],
        tactics: 'Nunca luta sozinho se puder evitar; paga Solos no ato com eddies para lutarem em seu lugar.',
        notes: 'Perícias Streetwise 16, Negociação 16, Suborno 15.',
        citation: 'CP:R p. 150',
        statsRED: { hp: 35, spHead: 11, spBody: 11, move: 6, body: 6, will: 8, ref: 7, dex: 6, combatNumber: 13 },
        stats2020: { body: 6, ref: 7, cool: 9, tech: 6, btm: -2, spHead: 10, spTorso: 12, spLimbs: 8 },
      },
      {
        roleName: 'Medtech de Beco / Ripperdoc Clandestino',
        tier: 'lieutenant',
        equipment: ['Bata Cirúrgica Reforçada (SP 7)', 'Scanner Médico Biomonitor', 'Maleta de Instrumentos de Implante Cirúrgico', 'Doses de Drogas Estabilizadoras e Anestésicos'],
        weaponsRED: ['Pistola Média 2d6', 'Bisturi Monofilamentar 2d6 (ignora metade da armadura)'],
        weapons2020: ['Pistola Glock 9mm 2d6+1', 'Bisturi laser'],
        tactics: 'Defensivo; usa fumaça de anestésico ou choque estático para fugir.',
        notes: 'Perícias Medical Tech / Cirurgia 15. Fonte primária de remoção e instalação de cromo sujo.',
        citation: 'CP:R p. 148',
        statsRED: { hp: 35, spHead: 7, spBody: 7, move: 6, body: 6, will: 8, ref: 7, dex: 7, combatNumber: 12 },
        stats2020: { body: 6, ref: 7, cool: 8, tech: 10, btm: -2, spHead: 8, spTorso: 10, spLimbs: 6 },
      },
    ],
  },
];
