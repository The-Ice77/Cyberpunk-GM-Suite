import { RuleEntry } from '../types/system';

export const RULES_CODEX_DATABASE: RuleEntry[] = [
  {
    "id": "autofire",
    "title": "Fogo Automático (Autofire) & Fogo Supressivo",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Ataque = REF + Autofire + 1d10 vs DV da Distância | Dano = 2d6 × Margem de Sucesso (até o limite da arma)",
    "summary": "Disparo de rajada concentrada contra um único alvo ou cobertura ampla para forçar inimigos a se abaixarem em pânico.",
    "mechanics": "No RED: Gasta 1 Ação e consome 10 munições do carregador. Não pode ser combinado com Tiros Mirados. Alvos com REF 8+ podem tentar esquivar (Evasion) em vez de usar o DV da distância. O dano é calculado rolando 2d6 e multiplicando o total pelo valor que o teste superou o DV de alcance da arma (até o multiplicador máximo da arma: máx x3 para SMGs e máx x4 para Fuzis de Assalto).\n\nFogo Supressivo: Não causa dano direto. Obriga todos os alvos em uma zona de 25 metros de cone/linha de visão a realizarem imediatamente um teste de WILL + Concentration contra o resultado de REF + Autofire + 1d10 do atirador. Quem falhar deve gastar sua próxima Ação correndo para a cobertura mais próxima.",
    "steps": [
      {
        "step": 1,
        "title": "Verificar Munição & Alcance",
        "desc": "Certifique-se de que a arma tem pelo menos 10 tiros no carregador e localize a distância em metros até o alvo."
      },
      {
        "step": 2,
        "title": "Teste de Autofire",
        "desc": "Role REF + Autofire + 1d10 contra o DV da distância da arma (ou vs Evasão se o alvo tiver REF 8+)."
      },
      {
        "step": 3,
        "title": "Multiplicador de Dano",
        "desc": "Subtraia o DV do resultado tirado. Essa é a margem de sucesso (mínimo 1). Limite essa margem ao multiplicador máximo da arma (SMG = 3, Fuzil = 4)."
      },
      {
        "step": 4,
        "title": "Rolagem de Dano",
        "desc": "Role 2d6 e multiplique pelo multiplicador calculado. O dano resultante é aplicado contra a SP da blindagem do alvo."
      }
    ],
    "gmTip": "Atenção Mestre: O multiplicador do Autofire se aplica ao total de 2d6, gerando picos brutais de dano! Exemplo: Um Fuzil que supera o DV por 4 e tira 8 no 2d6 causa 8 × 4 = 32 de dano, triturando até armaduras pesadas.",
    "tableData": {
      "headers": [
        "Arma",
        "0-6m",
        "7-12m",
        "13-25m",
        "26-50m",
        "51-100m",
        "Mult. Máx."
      ],
      "rows": [
        [
          "SMG / Submetralhadora",
          "DV 20",
          "DV 17",
          "DV 20",
          "DV 25",
          "DV 30",
          "x3 (máx 6d6 equiv.)"
        ],
        [
          "Fuzil de Assalto",
          "DV 22",
          "DV 20",
          "DV 17",
          "DV 20",
          "DV 25",
          "x4 (máx 8d6 equiv.)"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 173-174 • Data Screen • Cyberpunk 2020 p. 106",
    "tags": [
      "autofire",
      "fogo automatico",
      "supressao",
      "smg",
      "fuzil",
      "dano",
      "rajada"
    ]
  },
  {
    "id": "aimed-shots",
    "title": "Tiros Mirados (Aimed Shots: Cabeça, Membro e Objetos)",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Ataque = REF + Perícia + 1d10 - 8 de penalidade | Dano na Cabeça = Dano pós-SP × 2",
    "summary": "Tiros de alta precisão visando pontos vulneráveis específicos do alvo, como crânio, membros ou armas empunhadas.",
    "mechanics": "Exige 1 Ação. O atirador declara o local antes de rolar o dado e sofre uma penalidade severa de -8 no teste de ataque. Não pode ser usado com Autofire, Espingardas em cone de chumbo ou Armas de Área.\n\nEfeitos por Localização:\n• Cabeça: Se o dano superar a SP da Cabeça, todo o dano que penetrar a carne é MULTIPLICADO POR 2! (Além de causar ferimento crítico na cabeça se houver dois ou mais 6s).\n• Membro (Braço ou Perna): Se causar pelo menos 1 de dano que supere o SP, aplica automaticamente o Ferimento Crítico correspondente (Braço Quebrado ou Perna Quebrada), sem necessidade de rolar dois 6s.\n• Objeto Empunhado / Arma: Se acertar, o objeto sofre o dano total. Se o dano superar a SP/HP do objeto, ele é quebrado ou o alvo é forçado a soltá-lo.",
    "steps": [
      {
        "step": 1,
        "title": "Declarar Alvo Específico",
        "desc": "Declare antes do teste: Cabeça, Braço, Perna ou Objeto na mão do inimigo."
      },
      {
        "step": 2,
        "title": "Aplicar Modificador de -8",
        "desc": "Role REF + Perícia da Arma + 1d10 - 8 contra o DV da distância ou contra a Evasão do alvo."
      },
      {
        "step": 3,
        "title": "Resolução de Blindagem",
        "desc": "Subtraia a SP da localização atingida (lembre-se: a cabeça usa SP de Elmo/Capacete separada do Tronco!)."
      },
      {
        "step": 4,
        "title": "Multiplicação & Crítico",
        "desc": "Se for na Cabeça, dobre o dano que passar da SP. Se for no Membro, aplique fratura crítica direta."
      }
    ],
    "gmTip": "Tiros na Cabeça são o método mais letal de eliminar inimigos de elite. Mantenha os capacetes (Head SP) dos NPCs atualizados, ou um único tiro de Fuzil (5d6) na cabeça pode resultar em morte instantânea!",
    "tableData": {
      "headers": [
        "Local Mirado",
        "Penalidade",
        "Efeito Especial em Sucesso",
        "Blindagem Usada"
      ],
      "rows": [
        [
          "Cabeça (Head)",
          "-8",
          "Dano penetrante é dobrado (×2)",
          "Head SP (Capacetes/Elmos)"
        ],
        [
          "Braço (Arm)",
          "-8",
          "Aplica Ferimento Crítico 'Braço Quebrado'",
          "Body SP (Jaqueta/Armadura)"
        ],
        [
          "Perna (Leg)",
          "-8",
          "Aplica Ferimento Crítico 'Perna Quebrada' (-4 MOVE)",
          "Body SP (Jaqueta/Armadura)"
        ],
        [
          "Item / Arma Empunhada",
          "-8",
          "Destrói ou desarma o objeto se superar HP/SP",
          "SP do próprio objeto"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 170 • Combate Avançado",
    "tags": [
      "tiro mirado",
      "cabeca",
      "headshot",
      "membro",
      "desarme",
      "sniper"
    ]
  },
  {
    "id": "critical-injuries-body",
    "title": "Ferimentos Críticos no Tronco e Membros (Body Critical Injuries)",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Gatilho: Dois ou mais dados '6' no dano | Bônus Imediato: +5 PV de Dano Direto (ignora SP)",
    "summary": "Traumas anatômicos severos nos membros e órgãos vitais do tronco causados por disparos ou golpes devastadores.",
    "mechanics": "Sempre que dois ou mais dados de dano rolarem o número '6', o alvo sofre um Ferimento Crítico! Sofre imediatamente +5 PV de dano bônus diretamente em seus Pontos de Vida (esse dano extra não é reduzido pela blindagem). Em seguida, role 2d6 na Tabela de Ferimentos Críticos do Corpo.\n\nTratamento:\n• Estabilização Rápida: Exige teste de Primeiros Socorros ou Paramédico no DV listado para cessar sangramento e efeitos agudos.\n• Cura Definitiva: Exige Cirurgia no DV listado e repouso adequado, ou substituição por cibernético de Ripperdoc.",
    "steps": [
      {
        "step": 1,
        "title": "Detectar Rolagem de Dois '6'",
        "desc": "Se a rolagem de dano da arma tiver 2 ou mais dados com face 6, o crítico é ativado."
      },
      {
        "step": 2,
        "title": "Aplicar +5 PV Direto",
        "desc": "Reduza 5 PVs do defensor imediatamente, sem abater na blindagem."
      },
      {
        "step": 3,
        "title": "Rolar 2d6 na Tabela",
        "desc": "Role 2d6 para determinar o trauma físico exato sofrido pelo personagem."
      },
      {
        "step": 4,
        "title": "Registrar Efeito Contínuo",
        "desc": "Anote as penalidades de movimento, perícias ou sangramento na ficha do combatente."
      }
    ],
    "gmTip": "NPCs Mooks (bucha de canhão) frequentemente morrem ou fogem imediatamente ao sofrer um ferimento crítico. Use isso para acelerar combates contra capangas secundários!",
    "tableData": {
      "headers": [
        "2d6",
        "Lesão Crítica",
        "Efeito Mecânico",
        "1º Socorros",
        "Cirurgia"
      ],
      "rows": [
        [
          "2",
          "Membro Desmembrado",
          "Braço amputado. Solta item. Sangra 5 PV/turno.",
          "DV 15 (estanca)",
          "DV 17"
        ],
        [
          "3",
          "Mão Desmembrada",
          "Mão decepada. Não pode empunhar itens.",
          "DV 13",
          "DV 15"
        ],
        [
          "4",
          "Colapso Pulmonar",
          "-2 em MOVE (mínimo 1). Não pode correr.",
          "DV 13",
          "DV 15"
        ],
        [
          "5",
          "Costelas Fraturadas",
          "Sofre 2 PV de dano se mover mais de 4m no turno.",
          "DV 13",
          "DV 13"
        ],
        [
          "6",
          "Braço Quebrado",
          "Braço inutilizado. Não empunha armas de 2 mãos.",
          "DV 13",
          "DV 13"
        ],
        [
          "7",
          "Corpo Estranho / Estilhaço",
          "-2 em todas as ações até remover o projétil.",
          "DV 13",
          "DV 13"
        ],
        [
          "8",
          "Perna Quebrada",
          "-4 em MOVE (mínimo 1). Não pode esquivar.",
          "DV 13",
          "DV 13"
        ],
        [
          "9",
          "Músculo / Ligamento Rompido",
          "-2 em testes de DEX e STR.",
          "DV 13",
          "DV 13"
        ],
        [
          "10",
          "Lesão na Coluna",
          "Fica paralisado no próximo turno (perde ações).",
          "DV 15",
          "DV 17"
        ],
        [
          "11",
          "Pé Desmembrado",
          "-6 em MOVE (mínimo 1). Não pode esquivar.",
          "DV 13",
          "DV 15"
        ],
        [
          "12",
          "Perna Desmembrada",
          "Perna amputada. -6 MOVE, Prone, sangra 5 PV/turno.",
          "DV 15 (estanca)",
          "DV 17"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 220 • Tabela de Ferimentos Críticos",
    "tags": [
      "critico",
      "ferimento",
      "corpo",
      "amputacao",
      "fratura",
      "sangramento"
    ]
  },
  {
    "id": "critical-injuries-head",
    "title": "Ferimentos Críticos na Cabeça (Head Critical Injuries)",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Gatilho: Dois ou mais '6' em tiros/ataques direcionados à cabeça | Bônus: +5 PV direto",
    "summary": "Lesões cranianas, oculares e cerebrais de alta gravidade causadas por impactos brutais contra a cabeça.",
    "mechanics": "Ocorre quando um ataque na Cabeça rola dois ou mais dados '6'. Aplica imediatamente +5 PV de dano direto (sem redução por blindagem) e exige uma rolagem de 2d6 na Tabela de Ferimentos Críticos da Cabeça.\n\nEfeitos Sensoriais:\nLesões cranianas afetam visão, audição, equilíbrio e capacidade cognitiva, reduzindo drasticamente as estatísticas de INT, WILL e REF do personagem.",
    "steps": [
      {
        "step": 1,
        "title": "Ataque na Cabeça com Dois '6'",
        "desc": "Confirmar se o ataque mirou a cabeça ou se o efeito indicou localização craniana."
      },
      {
        "step": 2,
        "title": "Dano Extra de +5 PV",
        "desc": "Aplique 5 pontos de dano imediato nos PVs do personagem."
      },
      {
        "step": 3,
        "title": "Rolar 2d6 na Tabela Craniana",
        "desc": "Consulte a tabela de lesões específicas na cabeça."
      },
      {
        "step": 4,
        "title": "Aplicar Sequelas",
        "desc": "Aplique penalidades de percepção sensorial ou multiplicador de dano craniano."
      }
    ],
    "gmTip": "Um Crânio Fraturado (resultado 4) faz com que TODO dano subsequente na cabeça seja multiplicado por x3 em vez de x2. Isso torna o alvo extremamente frágil a tiros seguintes!",
    "tableData": {
      "headers": [
        "2d6",
        "Lesão Craniana",
        "Efeito Mecânico",
        "1º Socorros",
        "Cirurgia"
      ],
      "rows": [
        [
          "2",
          "Olho Perdido",
          "Olho destruído. -2 em ataques à distância e percepção visual.",
          "DV 15",
          "DV 17 (Cromar)"
        ],
        [
          "3",
          "Dano Cerebral",
          "-2 em todas as ações baseadas em INT, WILL ou TECH.",
          "DV 15",
          "DV 17"
        ],
        [
          "4",
          "Crânio Fraturado",
          "Dano na cabeça é multiplicado por x3 em vez de x2!",
          "DV 15",
          "DV 15"
        ],
        [
          "5",
          "Dentes Quebrados",
          "Dificuldade na fala (-2 em testes sociais falados).",
          "DV 13",
          "DV 13"
        ],
        [
          "6",
          "Tímpano Estourado",
          "-2 em percepção auditiva e equilíbrio/acrobacias.",
          "DV 13",
          "DV 13"
        ],
        [
          "7",
          "Olho Danificado",
          "-1 em ataques à distância e visão.",
          "DV 13",
          "DV 13"
        ],
        [
          "8",
          "Concussão",
          "-2 em TODAS as ações até receber socorro médico.",
          "DV 13",
          "DV 13"
        ],
        [
          "9",
          "Nariz Quebrado",
          "-2 em percepção olfativa e atordoamento temporário.",
          "DV 13",
          "DV 13"
        ],
        [
          "10",
          "Efeito Chicote / Traqueia",
          "-2 em ações físicas no próximo turno.",
          "DV 13",
          "DV 13"
        ],
        [
          "11",
          "Orelha Decepada",
          "-4 em testes de percepção auditiva do lado atingido.",
          "DV 13",
          "DV 15"
        ],
        [
          "12",
          "Crânio Esmagado",
          "Inconsciente por 1d6 horas se sobreviver ao dano.",
          "DV 15",
          "DV 17"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 221 • Tabela de Ferimentos da Cabeça",
    "tags": [
      "critico",
      "cabeca",
      "concussao",
      "cranio",
      "olho",
      "cerebral"
    ]
  },
  {
    "id": "armor-ablation",
    "title": "Ablação de Blindagem, Escudos Balísticos & Penetrabilidade",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Se Dano > SP: SP da Armadura reduz em -1 ponto permanente até conserto (Techfix)",
    "summary": "O desgaste físico e perfuração das placas balísticas de kevlar e policarbonato quando submetidas a impactos de armas de fogo.",
    "mechanics": "Toda vez que um ataque causa dano total que SUPERA o valor de Pontos de Parada (SP) da armadura do defensor (mesmo que por apenas 1 ponto):\n1. O alvo sofre a diferença de dano diretamente nos seus Pontos de Vida (PV).\n2. A blindagem daquela localização sofre ABLAÇÃO: o valor de SP é reduzido permanentemente em 1 ponto (-1 SP).\n\nMunições e Armas Especiais:\n• Munição Armor-Piercing (AP): Se penetrar o SP, causa -2 de ablação na blindagem em vez de -1.\n• Escudos Balísticos: Possuem Pontos de Vida próprios (HP 10 ou HP 25). Absorvem todo o impacto do ataque até que seu HP chegue a 0. O excedente não passa para o portador naquele disparo.",
    "steps": [
      {
        "step": 1,
        "title": "Comparar Dano vs SP",
        "desc": "Compare o total rolado no dado contra o SP atual da peça atingida (Body SP ou Head SP)."
      },
      {
        "step": 2,
        "title": "Subtrair Dano",
        "desc": "Se Dano <= SP: O tiro ricocheteia! Nenhum PV é perdido e a blindagem não é danificada."
      },
      {
        "step": 3,
        "title": "Penetração & Ablação",
        "desc": "Se Dano > SP: Defensor perde (Dano - SP) de PV. Reduza o SP da armadura em 1 ponto (-1 SP)."
      },
      {
        "step": 4,
        "title": "Anotar Novo SP",
        "desc": "Atualize a ficha: nos próximos tiros, a blindagem estará mais fraca (ex: Jaqueta 11 vira 10)."
      }
    ],
    "gmTip": "A ablação é cumulativa durante o tiroteio! Armaduras leves como Kevlar (SP 7) tornam-se quase inúteis após 3 ou 4 acertos. Incentive os jogadores a procurar cobertura antes que seu SP se esgote.",
    "tableData": {
      "headers": [
        "Armadura",
        "SP Inicial",
        "Penalidade (REF/DEX/MOVE)",
        "Custo",
        "Reparo (Tech DV)"
      ],
      "rows": [
        [
          "Couro (Leather)",
          "4 SP",
          "Nenhuma",
          "20eb",
          "DV 9 (1 hora)"
        ],
        [
          "Kevlar®",
          "7 SP",
          "Nenhuma",
          "50eb",
          "DV 13 (1 hora)"
        ],
        [
          "Jaqueta Leve (Light Armorjack)",
          "11 SP",
          "Nenhuma",
          "100eb",
          "DV 13 (1 hora)"
        ],
        [
          "Jaqueta Média (Medium Armorjack)",
          "12 SP",
          "-2 em REF, DEX, MOVE",
          "100eb",
          "DV 15 (2 horas)"
        ],
        [
          "Jaqueta Pesada (Heavy Armorjack)",
          "13 SP",
          "-2 em REF, DEX, MOVE",
          "500eb",
          "DV 15 (2 horas)"
        ],
        [
          "Flak Jacket",
          "15 SP",
          "-4 em REF, DEX, MOVE",
          "500eb",
          "DV 17 (3 horas)"
        ],
        [
          "MetalGear™ Exosuit",
          "18 SP",
          "-4 em REF, DEX, MOVE",
          "1.000eb",
          "DV 21 (4 horas)"
        ],
        [
          "Escudo Balístico Padrão",
          "10 HP",
          "Empunhado com 1 mão",
          "100eb",
          "Descartável"
        ],
        [
          "Escudo Tático de Choque",
          "25 HP",
          "Empunhado com 1 mão",
          "500eb",
          "Descartável"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 184-186 • Equipamento Balístico",
    "tags": [
      "armadura",
      "sp",
      "ablacao",
      "kevlar",
      "metalgear",
      "escudo",
      "reparo"
    ]
  },
  {
    "id": "bullet-dodging",
    "title": "Esquiva de Projéteis & Evasão (Bullet Dodging - Regra REF 8+)",
    "category": "Combate",
    "system": "RED",
    "quickFormula": "Requisito: Ter REF 8 ou superior | Teste: DEX + Evasion + 1d10 vs REF + Habilidade de Arma + 1d10",
    "summary": "A capacidade sobre-humana de reflexos cibernéticos de prever trajetórias e esquivar de balas e projéteis balísticos.",
    "mechanics": "No Cyberpunk RED, ataques de armas de fogo normalmente são resolvidos contra o DV estático da distância da arma (ex: Pistola a 10m é DV 15 fixo).\n\nPorém, se o defensor possuir REFLEXOS (REF) 8 ou superior (seja natural ou via aceleradores de reflexos como Sandevistan/Kerenzikov), ele PODE escolher tentar esquivar ativamente de tiros!\n\nNesse caso, a rolagem passa a ser um teste resistido: DEX + Evasion + 1d10 do defensor contra REF + Habilidade da Arma + 1d10 do atacante. Se o atacante não superar a rolagem de evasão, o tiro erra, independente da distância!",
    "steps": [
      {
        "step": 1,
        "title": "Checar Atributo REF",
        "desc": "Verifique se o personagem alvo possui REF 8 ou superior na sua ficha."
      },
      {
        "step": 2,
        "title": "Declaração de Esquiva",
        "desc": "Antes do atacante rolar o dano, o defensor declara se vai usar a tabela de DV de distância ou se vai esquivar ativamente."
      },
      {
        "step": 3,
        "title": "Rolagem Resistida",
        "desc": "Atacante rola (REF + Perícia + 1d10). Defensor rola (DEX + Evasion + 1d10)."
      },
      {
        "step": 4,
        "title": "Resultado",
        "desc": "O atacante só acerta se seu total for ESTRITAMENTE MAIOR que o total de evasão do defensor."
      }
    ],
    "gmTip": "Cuidado com o risco: Em distâncias onde o DV da arma é alto (ex: Sniper a 5 metros tem DV 30!), esquivar pode ser prejudicial se a evasão do defensor for menor do que o DV original!",
    "bookCitation": "Cyberpunk RED Corebook p. 169 • Esquiva Balística",
    "tags": [
      "esquiva",
      "evasao",
      "ref 8",
      "sandevistan",
      "balas",
      "teste resistido"
    ]
  },
  {
    "id": "cover-destructible",
    "title": "Coberturas, Proteção e Pontos de Estrutura de Objetos (Cover HP)",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "A cobertura absorve 100% do dano até que seu HP chegue a 0. O excedente não passa no mesmo disparo!",
    "summary": "Uso de obstáculos físicos do cenário para proteção balística contra disparos diretos e fogo de supressão.",
    "mechanics": "Uma cobertura só é considerada válida se ocultar completamente o corpo do personagem de uma linha de visão. Em Cyberpunk RED, coberturas não concedem bônus numérico na rolagem de armadura: em vez disso, funcionam como escudos de dano com Pontos de Vida (HP) próprios!\n\nRegra Crucial de Absorção:\nQuando um tiro atinge um alvo atrás de cobertura, a cobertura absorve todo o dano do projétil. Se o dano superar o HP da cobertura, o objeto é perfurado/destruído, mas o PERSONAGEM NÃO SOFRE DANO no mesmo tiro! No próximo ataque, contudo, o personagem estará exposto.",
    "steps": [
      {
        "step": 1,
        "title": "Estar em Cobertura",
        "desc": "O personagem deve estar agachado ou posicionado totalmente atrás do obstáculo físico."
      },
      {
        "step": 2,
        "title": "Tiro Atinge a Cobertura",
        "desc": "O atacante precisa atingir a cobertura ou declarar tiro contra ela se o alvo estiver oculto."
      },
      {
        "step": 3,
        "title": "Abater HP da Cobertura",
        "desc": "Subtraia o dano total da arma dos Pontos de Estrutura (HP) da cobertura."
      },
      {
        "step": 4,
        "title": "Destruição do Obstáculo",
        "desc": "Se o HP chegar a zero, a cobertura foi estraçalhada e não poderá mais ser usada."
      }
    ],
    "gmTip": "Night City é feita de vidro, gesso e lataria barata. Armas pesadas como Fuzis (5d6 com média de 17 de dano) estouram paredes de drywall e portas no primeiro tiro!",
    "tableData": {
      "headers": [
        "Tipo de Cobertura",
        "HP Estrutural",
        "Resistência Típica",
        "Exemplo de Cenário"
      ],
      "rows": [
        [
          "Drywall / Gesso",
          "5 HP",
          "Destruído por qualquer tiro",
          "Paredes internas de prédios e escritórios"
        ],
        [
          "Madeira Residencial",
          "15 HP",
          "Suporta 1 tiro de pistola leve",
          "Portas de apartamentos, mesas de mogno"
        ],
        [
          "Lataria de Carro Comum",
          "20 HP",
          "Suporta 1-2 tiros de pistola",
          "Portas e capô de sedans executivos"
        ],
        [
          "Concreto / Tijolo Maciço",
          "25 HP",
          "Suporta fuzis leves",
          "Muretas de viadutos, pilares de prédios"
        ],
        [
          "Poste de Ferro / Hidrante",
          "30 HP",
          "Extremamente resistente",
          "Mobiliário urbano de ferro fundido"
        ],
        [
          "Concreto Reforçado Militar",
          "35 HP",
          "Nível corporativo pesado",
          "Bunkers e guaritas da Militech/Arasaka"
        ],
        [
          "Porta de Aço de Cofre",
          "50 HP",
          "Praticamente impenetrável",
          "Cofres de bancos e salas de contenção NET"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 182-183 • Cobertura e Ambiente",
    "tags": [
      "cobertura",
      "drywall",
      "obstaculos",
      "hp de objetos",
      "tiroteio",
      "cenario"
    ]
  },
  {
    "id": "grapple-human-shield",
    "title": "Agarrar, Chave de Braço e Escudo Humano (Grapple & Human Shield)",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Agarrar: DEX + Brawling + 1d10 vs DEX + Brawling + 1d10 | Escudo: Alvo absorve dano com seu corpo",
    "summary": "Táticas de combate corpo a corpo para imobilizar inimigos, forçar rendições ou utilizá-los como escudo vivo.",
    "mechanics": "Agarrar (Grapple):\nExige 1 Ação e pelo menos uma mão livre. É um teste resistido de DEX + Brawling + 1d10 de ambos. Se o atacante vencer, o alvo fica AGARRADO: não pode se mover por conta própria e sofre penalidade de -2 em todos os testes. O atacante pode mover-se carregando o alvo, com velocidade reduzida pela metade.\n\nEscudo Humano (Human Shield):\nEnquanto mantiver o alvo agarrado, em seu turno o atacante pode usar uma Ação para transformá-lo em Escudo Humano. Todo ataque à distância contra o portador do escudo atinge primeiro o corpo do inimigo agarrado, consumindo seus PVs e sua armadura!",
    "steps": [
      {
        "step": 1,
        "title": "Teste de Agarrar",
        "desc": "Atacante declara a ação corpo a corpo e rola DEX + Brawling + 1d10 vs DEX + Brawling + 1d10 do alvo."
      },
      {
        "step": 2,
        "title": "Manter o Controle",
        "desc": "Se vencer, o alvo está agarrado. No turno dele, pode gastar 1 Ação para tentar escapar com novo teste de Brawling."
      },
      {
        "step": 3,
        "title": "Usar como Escudo",
        "desc": "Gaste 1 Ação para posicionar a vítima à sua frente como escudo contra disparos."
      },
      {
        "step": 4,
        "title": "Arremessar (Choke / Throw)",
        "desc": "Você também pode escolher asfixiar (Choke) para causar dano direto igual a BODY, ou arremessar o alvo no chão."
      }
    ],
    "gmTip": "Escudos humanos são perfeitos para Solos contra tropas da NCPD ou guardas corporativos que hesitem em atirar nos próprios colegas!",
    "bookCitation": "Cyberpunk RED Corebook p. 177 • Brawling & Agarrar",
    "tags": [
      "agarrar",
      "grapple",
      "escudo humano",
      "brawling",
      "corpo a corpo",
      "imobilizacao"
    ]
  },
  {
    "id": "wound-states-death-save",
    "title": "Estados de Ferimento, Salvaguarda da Morte & Estabilização",
    "category": "Sobrevivência",
    "system": "BOTH",
    "quickFormula": "Seriamente Ferido: ≤ 50% PV (-2 em todas as ações) | Mortalmente Ferido: 0 PV (Death Save: 1d10 <= BODY)",
    "summary": "As três faixas de integridade física em Cyberpunk RED, penalidades clínicas e mecânica de salvaguarda contra a morte.",
    "mechanics": "Faixas de Ferimento:\n1. Ileso / Ferimento Leve (> 50% dos PVs máximos): Nenhuma penalidade.\n2. Seriamente Ferido (Seriously Wounded, ≤ 50% dos PVs): Sofre penalidade de -2 em TODAS as ações e testes (ataques, esquivas, iniciativas, perícias) devido a dor e hemorragia.\n3. Mortalmente Ferido (Mortally Wounded, 0 PV): Cai no chão incapacitado. Não pode se mover nem realizar ações além de sussurrar.\n\nSalvaguarda da Morte (Death Save):\nNo início de CADA um dos seus turnos enquanto estiver Mortalmente Ferido, o personagem deve rolar 1d10 contra o seu valor de BODY.\n• O dado precisa ser MENOR OU IGUAL ao BODY para sobreviver.\n• A cada turno subsequente de sucesso, o DV aumenta em +1 (penalidade cumulativa: no 2º turno precisa rolar <= BODY - 1; no 3º turno <= BODY - 2).\n• Tirar 10 no dado é falha crítica automática: MORTE INSTANTÂNEA!\n\nEstabilização Médica: Um aliado pode gastar 1 Ação e passar em teste de Primeiros Socorros / Paramédico DV 15 para estabilizar o paciente, parando os testes de morte.",
    "steps": [
      {
        "step": 1,
        "title": "Calcular 50% do PV",
        "desc": "Determine o limiar de Seriamente Ferido (ex: 40 PV máximo = limiar em 20 PV)."
      },
      {
        "step": 2,
        "title": "Aplicar Penalidade -2",
        "desc": "Ao chegar em 50% ou menos de PV, aplique -2 em tudo que o combatente tentar fazer."
      },
      {
        "step": 3,
        "title": "Chegar a 0 PV (Mortal)",
        "desc": "Combatente colapsa. Inicia contagem de Death Saves a cada rodada."
      },
      {
        "step": 4,
        "title": "Rolar 1d10 no Início do Turno",
        "desc": "Role 1d10 <= BODY menos a quantidade de turnos anteriores já sobrevividos."
      }
    ],
    "gmTip": "Nunca deixe um companheiro caído com 0 PV sem estabilização. A penalidade de +1 por turno faz com que até guerreiros com BODY 8 morram em poucas rodadas!",
    "tableData": {
      "headers": [
        "Estado de Saúde",
        "Pontos de Vida (PV)",
        "Penalidades Mecânicas",
        "Risco de Morte"
      ],
      "rows": [
        [
          "Ileso / Leve",
          "> 50% do PV Máximo",
          "Nenhuma penalidade",
          "Seguro"
        ],
        [
          "Seriamente Ferido",
          "≤ 50% do PV Máximo",
          "-2 em todas as ações e testes",
          "Sem risco imediato de morte"
        ],
        [
          "Mortalmente Ferido",
          "0 PV",
          "Incapacitado. Não age.",
          "Death Save a cada rodada (1d10 <= BODY)"
        ],
        [
          "Estabilizado",
          "0 PV (Tratado)",
          "Inconsciente, mas não rola Death Saves",
          "Recupera 1 PV após 1 hora de repouso"
        ],
        [
          "Morto",
          "Falha no Death Save ou 10 no d10",
          "Cérebro cessa funções biológicas",
          "Fim da linha para o edgerunner"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 222 • Trauma, Ferimentos & Morte",
    "tags": [
      "morte",
      "death save",
      "body",
      "pv",
      "seriamente ferido",
      "primeiros socorros",
      "trauma"
    ]
  },
  {
    "id": "healing-medical-care",
    "title": "Repouso, Cura Natural, Speedheal e Cuidados Hospitalares",
    "category": "Sobrevivência",
    "system": "BOTH",
    "quickFormula": "Cura Natural = BODY em PV por dia de repouso | Speedheal = +BODY em PV imediato (máx 1 dose/24h)",
    "summary": "Processo de recuperação biológica de tecidos, regeneração celular e o uso de estimulantes médicos.",
    "mechanics": "Cura Natural:\nUm personagem que descansa um dia completo (24 horas) em repouso recupera uma quantidade de PVs igual ao seu valor de BODY.\n\nSpeedheal (Drogas Ripperdoc):\nUma dose de Speedheal injetada por um Medtech acelera a regeneração, concedendo cura imediata igual ao valor de BODY do personagem por dia adicional. No entanto, o organismo só aceita 1 dose a cada 24 horas; doses adicionais causam overdose e perda de 2d6 PVs.\n\nTratamentos Especiais do Medtech:\n• Farmacêuticos (Cryo-tubes e Nanomedicina) dobram o ritmo de recuperação diária.\n• Cirurgia de Reconstrução: Exige instalações hospitalares e kit de cirurgia para remover sequelas de ferimentos críticos.",
    "steps": [
      {
        "step": 1,
        "title": "Estabilização Prévia",
        "desc": "Nenhum PV é recuperado se o personagem ainda tiver ferimentos críticos não estabilizados."
      },
      {
        "step": 2,
        "title": "Repouso de 24 Horas",
        "desc": "O personagem não pode realizar atividades extenuantes ou entrar em combate."
      },
      {
        "step": 3,
        "title": "Adicionar Valor de BODY",
        "desc": "Some seu BODY aos PVs atuais (ex: BODY 6 = recupera 6 PVs por dia)."
      },
      {
        "step": 4,
        "title": "Aplicar Medicamentos",
        "desc": "Se medicado com Speedheal por um profissional, adicione mais +BODY no dia."
      }
    ],
    "gmTip": "No Cyberpunk RED, a cura não é mágica nem instantânea. Ficar seriamente ferido pode tirar um mercenário de ação por vários dias no calendário da campanha!",
    "bookCitation": "Cyberpunk RED Corebook p. 223 • Medicina e Repouso",
    "tags": [
      "cura",
      "repouso",
      "speedheal",
      "medtech",
      "hospital",
      "body"
    ]
  },
  {
    "id": "explosives-aoe",
    "title": "Explosivos, Granadas e Dano em Área (Blast Damage)",
    "category": "Combate",
    "system": "BOTH",
    "quickFormula": "Granada: DV 15 (Athletics) para arremessar até 25m | Dano em Área: 6d6 contra todos no raio de 10x10m",
    "summary": "Uso tático de granadas de fragmentação, C4, minas antipessoal e mísseis explosivos.",
    "mechanics": "Arremesso de Granadas:\nExige 1 Ação. O atacante rola DEX + Athletics + 1d10 contra DV 15 para qualquer ponto a até 25 metros de distância.\n• Sucesso: A granada pousa exatamente na grade/coordenada desejada.\n• Falha: Desvio! Role 1d8 para direção da dispersão e 1d6 para distância em metros que a granada ricocheteou para longe do ponto mirado.\n\nResolução do Dano:\nTodos os alvos dentro do raio da explosão (normalmente 10x10 metros / raio de 5m do centro) sofrem 6d6 de dano. Cada alvo compara sua própria blindagem (Body SP) individualmente contra a rolagem de dano.\nAlvos com REF 8+ podem tentar esquivar (Evasion vs DV 15) para pular para fora do raio se tiverem movimento livre.",
    "steps": [
      {
        "step": 1,
        "title": "Escolher Ponto de Impacto",
        "desc": "Declare o ponto exato do cenário onde a granada deve detonar."
      },
      {
        "step": 2,
        "title": "Teste de Athletics DV 15",
        "desc": "Role DEX + Athletics + 1d10. Se falhar, aplique dispersão com 1d8 e 1d6."
      },
      {
        "step": 3,
        "title": "Rolagem de Dano Única",
        "desc": "Role 6d6 uma única vez para a explosão. Esse dano é aplicado a todos na área."
      },
      {
        "step": 4,
        "title": "Ablação em Massa",
        "desc": "Todas as coberturas e armaduras atingidas que tiverem SP superado sofrem -1 de ablação."
      }
    ],
    "gmTip": "Granadas de PEM (EMP) não causam dano físico em humanos puros, mas desligam cibernéticos, miras eletrônicas e cyberdecks por 1 minuto se os itens falharem em resistir!",
    "bookCitation": "Cyberpunk RED Corebook p. 174 • Armas de Área & Granadas",
    "tags": [
      "explosivos",
      "granada",
      "c4",
      "area",
      "athletics",
      "dano em massa"
    ]
  },
  {
    "id": "fire-ignition",
    "title": "Fogo, Incêndio e Queimaduras (Dano Contínuo)",
    "category": "Sobrevivência",
    "system": "BOTH",
    "quickFormula": "Fogo Leve: 2d6 PV direto no final do turno | Fogo Pesado: 4d6 PV direto | Apagar: 1 Ação",
    "summary": "Regras para personagens atingidos por lança-chamas, coquetéis molotov ou incêndios industriais.",
    "mechanics": "Estar Em Chamas:\nQuando um personagem pega fogo (seja por armas incendiárias, explosões de CHOOH2 ou molotovs), ele sofre dano térmico contínuo no FINAL de cada um dos seus turnos, ANTES de sua armadura conseguir dispersar o calor (o fogo ignora SP a menos que a armadura seja tratada com isolamento térmico).\n\nIntensidades:\n• Fogo Leve (Roupas em chamas, combustível queimando): 2d6 PV de dano direto por turno.\n• Fogo Pesado (Imerso em gasolina, lança-chamas concentrado): 4d6 PV de dano direto por turno.\n\nApagando as Chamas:\nO personagem (ou um aliado adjacente) deve gastar 1 Ação completa para rolar no chão, usar extintor ou sufocar as chamas com um cobertor antichamas.",
    "steps": [
      {
        "step": 1,
        "title": "Ignicão",
        "desc": "O ataque incendiário atinge o alvo com sucesso ou o personagem entra em área em chamas."
      },
      {
        "step": 2,
        "title": "Turno do Personagem",
        "desc": "O personagem age normalmente, mas tem o fogo consumindo seu equipamento."
      },
      {
        "step": 3,
        "title": "Fim do Turno: Sofrer Dano",
        "desc": "Role 2d6 (ou 4d6) diretamente nos PVs do personagem no final do seu turno."
      },
      {
        "step": 4,
        "title": "Extinção",
        "desc": "O personagem pode sacrificar sua Ação no turno seguinte para apagar o fogo."
      }
    ],
    "gmTip": "O fogo é o maior pesadelo de Solos fortemente blindados, pois corrói diretamente os PVs sem se importar com Jaquetas Pesadas ou MetalGear!",
    "bookCitation": "Cyberpunk RED Corebook p. 180 • Perigos Ambientais: Fogo",
    "tags": [
      "fogo",
      "chamas",
      "molotov",
      "lanca-chamas",
      "dano direto",
      "combustao"
    ]
  },
  {
    "id": "cyberpsychosis",
    "title": "Ciberpsicose, Perda de Humanidade e Terapia Psicológica",
    "category": "Cibernéticos",
    "system": "BOTH",
    "quickFormula": "Humanidade = EMP × 10 | Cada 10 pontos de Humanidade perdidos reduzem permanentemente 1 ponto de EMP",
    "summary": "A degradação psíquica e dissociativa causada pela substituição invasiva de carne biológica por circuitos e metais.",
    "mechanics": "No Cyberpunk RED, cada implante cibernético instalado possui um custo em Perda de Humanidade (HL), rolado em dados (ex: 2d6 ou 4d6) ou pago com valor fixo no caso de cirurgia supervisionada.\n\nConsequências Clínicas:\n• Para cada 10 pontos de Humanidade perdidos, o atributo EMPATIA (EMP) do personagem cai em 1 ponto.\n• EMP 3: Indivíduo frio, calculista, isolado e com aversão a contatos emocionais.\n• EMP 2: Perda de empatia básica, impulsos sádicos ou paranoicos, fixação obsessiva por eficiência mecânica.\n• EMP 1: Limiar da loucura, despersonalização severa, vê humanos de carne como sacos de órgãos frágeis.\n• EMP 0: CIBERPSICOSE COMPLETA. O personagem perde a ficha para o Mestre e vira um NPC caçado pela MaxTac!\n\nTerapia:\nSessões com psicólogos de rua ou corporativos (Medtech) restauram Humanidade mediante pagamento em eurodólares e tempo de internação clínica.",
    "steps": [
      {
        "step": 1,
        "title": "Instalação do Implante",
        "desc": "O Ripperdoc realiza a cirurgia e cobra o custo financeiro."
      },
      {
        "step": 2,
        "title": "Rolar Perda de Humanidade (HL)",
        "desc": "Role o dano de humanidade do implante e subtraia da Humanidade Atual."
      },
      {
        "step": 3,
        "title": "Recalcular EMP",
        "desc": "Divida a Humanidade Atual por 10 (arredondado para baixo) para obter o novo valor de EMP."
      },
      {
        "step": 4,
        "title": "Intervenção Terapêutica",
        "desc": "Sessões semanais com Medtech especializado recuperam 2d6 a 4d6 de Humanidade."
      }
    ],
    "gmTip": "Exija dos jogadores roleplay compatível com a perda de EMP. Conforme o valor cai abaixo de 3, os laços familiares e amigos tornam-se obstáculos incômodos para o personagem.",
    "tableData": {
      "headers": [
        "Grau de Terapia",
        "Humanidade Recuperada",
        "Tempo Exigido",
        "Custo em Eurodólares"
      ],
      "rows": [
        [
          "Terapia Padrão (Ambulatorial)",
          "2d6 pontos",
          "1 semana em repouso",
          "500eb"
        ],
        [
          "Terapia Extrema (Internação)",
          "4d6 pontos",
          "2 semanas em clínica",
          "1.000eb"
        ],
        [
          "Terapia Neurológica Avançada",
          "Recupera até o limite original",
          "1 mês sem cromo ativo",
          "5.000eb"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 230-232 • Ciberpsicose e Terapia",
    "tags": [
      "ciberpsicose",
      "humanidade",
      "emp",
      "empatia",
      "cromo",
      "terapia",
      "maxtac"
    ]
  },
  {
    "id": "netrunning-red",
    "title": "Netrunning no Cyberpunk RED: Arquitetura NET & Ações de Interface",
    "category": "Netrunning",
    "system": "RED",
    "quickFormula": "Ações NET por turno: Rank 1-2 (2 ações) | Rank 3-6 (3 ações) | Rank 7-9 (4 ações) | Rank 10 (5 ações)",
    "summary": "O sistema moderno de invasão tática local via cabos neurais Virtuality, combatendo nós corporativos e Black ICE.",
    "mechanics": "Diferente da antiga Rede global de 2020, o Netrunning no RED é estritamente LOCAL: o Netrunner precisa estar a até 6 metros (ou conectado fisicamente por cabo) do Ponto de Acesso (Access Point).\n\nAções de Interface no Turno:\n1. Pathfinder: Role Interface + 1d10 vs DV do andar para mapear a arquitetura e revelar os próximos níveis.\n2. Backdoor: Role Interface + 1d10 vs DV da Senha para abrir trancas de dados.\n3. Decrypt: Role Interface + 1d10 vs DV da Criptografia para ler arquivos sigilosos.\n4. Control: Role Interface + 1d10 vs DV do Nó de Controle para operar câmeras, torretas automáticas ou elevadores.\n5. Slide: Role Interface + 1d10 vs Percepção do Black ICE para se desconectar de um combate virtual em fuga.\n6. Virus: Crie um efeito permanente na rede (DV definido pelo Mestre baseado na ambição do vírus).",
    "steps": [
      {
        "step": 1,
        "title": "Conectar ao Ponto de Acesso",
        "desc": "Fique a até 6 metros de um terminal, roteador ou câmera da rede corporativa."
      },
      {
        "step": 2,
        "title": "Usar Virtuality (Jack In)",
        "desc": "Gasta 0 ações. A visão de realidade aumentada se sobrepõe ao mundo real."
      },
      {
        "step": 3,
        "title": "Gastar Ações NET",
        "desc": "Execute suas Ações NET permitidas pelo seu nível de Interface (2, 3, 4 ou 5 ações)."
      },
      {
        "step": 4,
        "title": "Manter Ação no Mundo Real",
        "desc": "O Netrunner ainda tem 1 Ação de movimento no mundo físico enquanto hackeia!"
      }
    ],
    "gmTip": "No RED, o Netrunning acontece na mesma rodada do combate dos combatentes normais. Alterne entre os tiros do Solo e os hacks do Netrunner para manter a adrenalina lá em cima!",
    "tableData": {
      "headers": [
        "Rank de Interface",
        "Ações NET / Turno",
        "Programas Carregados",
        "Perfil Típico"
      ],
      "rows": [
        [
          "Rank 1 - 2",
          "2 Ações NET",
          "Até 3 programas",
          "Iniciante / Script Kiddie"
        ],
        [
          "Rank 3 - 6",
          "3 Ações NET",
          "Até 5 programas",
          "Netrunner Profissional de Rua"
        ],
        [
          "Rank 7 - 9",
          "4 Ações NET",
          "Até 7 programas",
          "Especialista de Elite"
        ],
        [
          "Rank 10",
          "5 Ações NET",
          "Até 9 programas",
          "Lenda da Rede (nível Rache Bartmoss)"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 197-208 • Netrunning & Arquitetura NET",
    "tags": [
      "netrunning",
      "interface",
      "hacker",
      "black ice",
      "virtuality",
      "access point"
    ]
  },
  {
    "id": "facedown",
    "title": "Encarada (Facedown / Duelo de Olhares) & Reputação",
    "category": "Sociais",
    "system": "BOTH",
    "quickFormula": "Teste: COOL + Nível de Reputação + 1d10 vs COOL + Reputação + 1d10",
    "summary": "O teste de intimidação psicológica e presença de palco antes de qualquer tiroteio nas esquinas de Night City.",
    "mechanics": "Em Cyberpunk, a reputação precede o guerreiro. Antes de sacar as armas, combatentes podem tentar intimidar o oponente com uma Encarada (Facedown).\n\nResolução:\nAmbos os líderes de cada lado rolam COOL + Reputação + 1d10.\n• O participante com menor resultado é psicologicamente intimidado!\n• Consequência: O perdedor pode optar por recuar, baixar a guarda ou pedir desculpas. Se optar por lutar mesmo assim, sofre uma penalidade de -2 em TODAS as suas ações contra o vencedor durante todo aquele encontro!",
    "steps": [
      {
        "step": 1,
        "title": "Declarar Encarada",
        "desc": "Ocorre no momento do contato visual tenso, antes do primeiro tiro ser disparado."
      },
      {
        "step": 2,
        "title": "Somar COOL + Reputação",
        "desc": "Cada duelista soma seu atributo COOL ao seu nível oficial de Reputação (1 a 10)."
      },
      {
        "step": 3,
        "title": "Rolar 1d10",
        "desc": "Role 1d10 com regra de explosão (10 explode, 1 é desastre)."
      },
      {
        "step": 4,
        "title": "Aplicar Moral",
        "desc": "Quem perder sofre -2 moral imediato em combate ou é forçado a ceder terreno."
      }
    ],
    "gmTip": "Use a Encarada quando gangues de rua tentarem cercar os jogadores para extorquir pedágio. Um Solo famoso com Reputação 7 pode fazer 10 marginais correrem sem disparar um único tiro!",
    "tableData": {
      "headers": [
        "Nível de Reputação",
        "Fama em Night City",
        "Exemplo de Reconhecimento"
      ],
      "rows": [
        [
          "Reputação 1 - 2",
          "Zé Ninguém / Rato de Beco",
          "Apenas conhecidos da sua rua ou bloco sabem quem você é"
        ],
        [
          "Reputação 3 - 4",
          "Conhecido no Bairro",
          "Fixers locais e bartenders do distrito já ouviram seu apelido"
        ],
        [
          "Reputação 5 - 6",
          "Notório na Cidade",
          "Gangues respeitam seu grupo; corporações mantêm um dossiê básico"
        ],
        [
          "Reputação 7 - 8",
          "Lenda da Zona de Combate",
          "Veteranos de guerra e Solos de elite sabem do que você é capaz"
        ],
        [
          "Reputação 9 - 10",
          "Lenda Viva de Night City",
          "Seu nome está gravado no Afterlife ao lado de Morgan Blackhand"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 193-194 • Encaradas & Reputação",
    "tags": [
      "encarada",
      "facedown",
      "reputacao",
      "cool",
      "intimidacao",
      "moral"
    ]
  },
  {
    "id": "vehicle-combat-chase",
    "title": "Combate Veicular, Perseguições & DVs de Manobra",
    "category": "Veículos",
    "system": "RED",
    "quickFormula": "Manobra: REF + Perícia de Condução + 1d10 vs DV do Terreno | Dano de Batida: Velocidade × Tipo",
    "summary": "Regras para tiroteios em alta velocidade nas rodovias de Night City e nas Badlands fora das muralhas.",
    "mechanics": "Condução em Combate:\nO motorista gasta sua Ação para manobrar o veículo. O controle do veículo usa testes de REF + Drive Land Vehicle (ou Sea/Air) contra o DV de manobra do terreno ou manobra evasiva do adversário.\n\nBatidas e Abalroamento (Ramming):\nQuando um veículo colide deliberadamente contra outro objeto ou pessoa, o dano é calculado baseado na velocidade de combate (MOVE) e na classe de peso do veículo:\n• Carro Comum / Sedan: Causa dano em dados igual ao MOVE percorrido no turno (ex: MOVE 15 = 3d6 a 5d6).\n• Caminhão / Blindado: Multiplica o dano de impacto.\n• Pedestres atropelados sofrem o dano integral e são arremessados para longe.",
    "steps": [
      {
        "step": 1,
        "title": "Verificar Terreno",
        "desc": "Determine o DV de base: Asfalto limpo (DV 13), Chuva/Beco (DV 15), Óleo/Entulho (DV 17)."
      },
      {
        "step": 2,
        "title": "Ação do Piloto",
        "desc": "Piloto rola REF + Drive + 1d10. Passageiros podem usar suas próprias Ações para atirar pelas janelas."
      },
      {
        "step": 3,
        "title": "Tiros no Veículo",
        "desc": "Ataques atingem a Blindagem do Veículo (SP da lataria ou SP dos vidros bulletproof)."
      },
      {
        "step": 4,
        "title": "Perda de Controle",
        "desc": "Se o piloto falhar no teste de manobra, role na tabela de derrapagem e capotamento."
      }
    ],
    "gmTip": "Vidros de carros comuns têm apenas SP 5 a 10. Tiros focados nas janelas frequentemente acertam os ocupantes diretamente!",
    "tableData": {
      "headers": [
        "Condição da Pista / Manobra",
        "DV de Condução",
        "Consequência de Falha"
      ],
      "rows": [
        [
          "Rodovia Asfaltada Plana",
          "DV 13",
          "Veículo balança, perde 2 metros de MOVE"
        ],
        [
          "Tráfego Urbano Intenso / Chuva",
          "DV 15",
          "Derrapagem leve; passageiros sofrem -2 em tiros"
        ],
        [
          "Beco Estreito / Estrada de Terra",
          "DV 17",
          "Colisão lateral contra parede (perde 10 SDP)"
        ],
        [
          "Cavalo de Pau / Evasão sob Fogo",
          "DV 21",
          "Rodopio descontrolado; para imediatamente"
        ],
        [
          "Salto de Ponte / Pista Destruída",
          "DV 25",
          "Capotamento grave; 4d6 de dano aos ocupantes"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 189-192 • Perseguições & Veículos",
    "tags": [
      "veiculos",
      "perseguicao",
      "conducao",
      "colisao",
      "batida",
      "sdp"
    ]
  },
  {
    "id": "poisons-biotoxins",
    "title": "Venenos, Biotoxinas e Radiação",
    "category": "Medicina",
    "system": "BOTH",
    "quickFormula": "Resistência: BODY + Resist Torture/Drugs + 1d10 vs DV do Veneno | Falha = Dano direto aos PVs",
    "summary": "Agentes químicos, neurotoxinas sintéticas da Biotechnica e substâncias letais para assassinatos silenciosos.",
    "mechanics": "Quando um veneno entra na corrente sanguínea ou é inalado pelo personagem:\n• O alvo deve realizar imediatamente um teste de BODY + Resist Torture/Drugs + 1d10 contra o DV da substância.\n• Sucesso: O organismo metaboliza a toxina e anula os efeitos letais.\n• Falha: O personagem sofre o efeito completo da toxina (geralmente dano massivo direto aos PVs ignorando armadura, além de náusea, paralisia ou cegueira temporária).\n\nBiotoxina Militar:\nDV 15 para resistir. Se falhar, causa 3d6 de dano direto a cada 1 minuto até a administração de um antídoto.",
    "steps": [
      {
        "step": 1,
        "title": "Contato com a Toxina",
        "desc": "Inalação de gás, ingestão ou dardo envenenado perfurando a pele."
      },
      {
        "step": 2,
        "title": "Teste de BODY",
        "desc": "Role BODY + Resist Torture/Drugs + 1d10 contra o DV da toxina."
      },
      {
        "step": 3,
        "title": "Aplicação de Danos",
        "desc": "Em caso de falha, deduza os PVs diretamente e aplique as condições especiais."
      },
      {
        "step": 4,
        "title": "Aplicação de Antídoto",
        "desc": "Teste de Primeiros Socorros / Paramédico com kit químico para estabilizar."
      }
    ],
    "gmTip": "Implantes de Filtro Nasal (Nasal Filters) concedem imunidade a toxinas inalatórias e gases venenosos, tornando-se equipamento obrigatório para infiltrações!",
    "tableData": {
      "headers": [
        "Substância Química",
        "Método de Aplicação",
        "DV de Resistência",
        "Efeito em Falha"
      ],
      "rows": [
        [
          "Gás Lacrimogêneo",
          "Inalatório / Granada",
          "DV 13",
          "Cego e atordoado por 1 minuto (-4 em ações)"
        ],
        [
          "Veneno de Contato Básico",
          "Dardo / Lâmina",
          "DV 13",
          "2d6 de dano direto aos PVs"
        ],
        [
          "Biotoxina Sintética",
          "Injeção / Projétil",
          "DV 15",
          "3d6 de dano direto a cada minuto até antídoto"
        ],
        [
          "Neurotoxina Militar Arasaka",
          "Química Avançada",
          "DV 17",
          "Paralisia total do sistema nervoso; 5d6 PVs"
        ]
      ]
    },
    "bookCitation": "Cyberpunk RED Corebook p. 180 • Toxinas & Substâncias Perigosas",
    "tags": [
      "veneno",
      "biotoxina",
      "gas",
      "resistencia",
      "body",
      "quimica"
    ]
  },
  {
    "id": "cp2020-combat-btm",
    "title": "Cyberpunk 2020: Modificador de Tipo Corporal (BTM) & 6 Partes do Corpo",
    "category": "Combate",
    "system": "2020",
    "quickFormula": "Dano Final = (Dano da Arma - SP do Local) - BTM | Cabeça = Dano pós-SP × 2",
    "summary": "O sistema clássico de combate de 1990 com seis localizações de dano anatômico e amortecimento corporal.",
    "mechanics": "No Cyberpunk 2020 clássico, o corpo é dividido em 6 localizações com rolagem de 1d10 para cada acerto:\n1 = Cabeça | 2-4 = Tronco | 5 = Braço Direito | 6 = Braço Esquerdo | 7-8 = Perna Direita | 9-10 = Perna Esquerda.\n\nModificador de Tipo Corporal (BTM):\nO atributo BODY determina o BTM, um redutor fixo subtraído de TODO dano que penetrar a armadura:\n• BODY 2: BTM 0 (Muito Frágil)\n• BODY 3-4: BTM -1\n• BODY 5-7: BTM -2 (Média Humana)\n• BODY 8-9: BTM -3 (Atlético)\n• BODY 10: BTM -4 (Fisiculturista)\n• BODY 11+: BTM -5 (Aprimorado ciberneticamente)",
    "steps": [
      {
        "step": 1,
        "title": "Rolar Ataque vs Dificuldade",
        "desc": "Role REF + Habilidade de Arma + 1d10 contra a dificuldade de alcance."
      },
      {
        "step": 2,
        "title": "Rolar 1d10 para Localização",
        "desc": "Consulte a tabela de 1 a 10 para saber onde a bala atingiu."
      },
      {
        "step": 3,
        "title": "Subtrair SP daquela Peça",
        "desc": "Cada membro possui sua própria camada de blindagem e jaqueta."
      },
      {
        "step": 4,
        "title": "Subtrair BTM do Dano",
        "desc": "Reduza o valor de BTM do dano penetrante antes de descontar na trilha de ferimentos."
      }
    ],
    "gmTip": "O sistema 2020 é incrivelmente punitivo. Um tiro na cabeça (local 1) dobra todo o dano após o SP e frequentemente resulta em amputação ou morte instantânea!",
    "tableData": {
      "headers": [
        "1d10",
        "Parte do Corpo",
        "Multiplicador de Dano",
        "Efeito de Destruição"
      ],
      "rows": [
        [
          "1",
          "Cabeça",
          "×2 após SP",
          "Morte instantânea se sofrer 8+ de dano"
        ],
        [
          "2 - 4",
          "Tronco",
          "×1 normal",
          "Ferimentos vitais na trilha de dano"
        ],
        [
          "5",
          "Braço Direito",
          "×1 normal",
          "Braço inutilizado / decepado se sofrer 8+"
        ],
        [
          "6",
          "Braço Esquerdo",
          "×1 normal",
          "Braço inutilizado / decepado se sofrer 8+"
        ],
        [
          "7 - 8",
          "Perna Direita",
          "×1 normal",
          "Perna inutilizada / decepada se sofrer 8+"
        ],
        [
          "9 - 10",
          "Perna Esquerda",
          "×1 normal",
          "Perna inutilizada / decepada se sofrer 8+"
        ]
      ]
    },
    "bookCitation": "Cyberpunk 2020 Corebook p. 98-103 • Friday Night Firefight (FNFF)",
    "tags": [
      "cp2020",
      "btm",
      "body type",
      "partes do corpo",
      "classic",
      "fnff"
    ]
  }
];
