export interface GangProfile {
  id: string;
  name: string;
  category: 'Booster' | 'Combat/PMC' | 'Prankster' | 'Cult' | 'Party' | 'Syndicate' | 'Poser' | 'Nomad/Racer' | 'Eco/Guerilla' | 'Street/Territorial';
  leader: string;
  turf: string[];
  threatLevel: 'Baixo' | 'Médio' | 'Alto' | 'Extremo';
  identifiers: string;
  activities: string[];
  description: string;
  philosophy: string;
  typicalGear: string[];
  signatureWeapons: string[];
  tactics: string;
  citation: string;
  logoFilename?: string;
  // Stats template for generation
  statsTemplate: {
    RED: {
      combatNumber: { mook: number; lieutenant: number; miniboss: number; boss: number };
      hp: { mook: number; lieutenant: number; miniboss: number; boss: number };
      spHead: number;
      spBody: number;
      baseSkills: string[];
    };
    CP2020: {
      bodyRange: [number, number];
      refRange: [number, number];
      btm: number;
      spHead: number;
      spTorso: number;
      spLimbs: number;
    };
  };
}

export const GANGS_LIST: GangProfile[] = [
  {
    "id": "maelstrom",
    "name": "Maelstrom",
    "category": "Booster",
    "leader": "Warlock / Declan Griffin",
    "turf": [
      "Watson",
      "Northside Industrial District (NID)",
      "Little China",
      "Totentanz Club"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Cirurgias faciais horríveis com múltiplos optocibernéticos vermelhos brilhando onde deveriam estar os olhos; jaquetas de couro preto com espinhos e fiação exposta.",
    "activities": [
      "Extorsão",
      "Tráfico de drogas pesadas (Black Lace)",
      "Contrabando de cibernéticos sujos",
      "Violência indiscriminada",
      "Trabalho mercenário sujo"
    ],
    "description": "Gangue booster obcecada por ciberware no limite da ciberpsicose. Eles desprezam a carne humana fraca e substituem seus membros e rostos por cromo militar roubado.",
    "philosophy": "A carne é uma fraqueza temporária; a máquina é a evolução eterna através da dor e do caos.",
    "typicalGear": [
      "Óptica Cibernética com Visão Termográfica e Flash",
      "Subdermal Armor",
      "Braço Cibernético Hidráulico",
      "Doses de Black Lace"
    ],
    "signatureWeapons": [
      "Espingarda Pesada 5d6 (Poor/Standard Quality)",
      "Submetralhadora Pesada 3d6 com Fogo Automático",
      "Lâmina Retrátil Wolvers (3d6)"
    ],
    "tactics": "Avançam sem medo de cobertura sob efeito de estimulantes de dor, focando fogo de supressão para encurralar alvos e fatiá-los de perto.",
    "citation": "Night City Gang Guide p. 13 • CP:R p. 308 • CP2020 p. 142",
    "logoFilename": "Maelstrom Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 13,
          "lieutenant": 15,
          "miniboss": 17,
          "boss": 19
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 85
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Autofire 13",
          "Brawling 14",
          "Heavy Weapons 13",
          "Resist Torture/Drugs 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          9,
          12
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -4,
        "spHead": 14,
        "spTorso": 18,
        "spLimbs": 14
      }
    }
  },
  {
    "id": "tyger-claws",
    "name": "Tyger Claws",
    "category": "Syndicate",
    "leader": "Mister Sato / Conselho de Oyabuns",
    "turf": [
      "Japantown",
      "Kabuki",
      "Little China",
      "Charter Hill"
    ],
    "threatLevel": "Alto",
    "identifiers": "Tatuagens japonesas tradicionais (irezumi) que brilham com tinta luminescente sob luz negra; motos esportivas velozes; ternos modernos de seda sintética ou jaquetas de motoqueiro.",
    "activities": [
      "Segurança privada",
      "Extorsão organizada",
      "Casas de apostas e pachinko",
      "Tráfico de tecnologia Arasaka",
      "Boates e prostituição de luxo"
    ],
    "description": "Gangue de temática asiática outrora patrocinada pela Arasaka, hoje uma das maiores potências do submundo em Japantown, controlando negócios com precisão implacável.",
    "philosophy": "Honra marcial, lealdade à família da gangue e punição exemplar para quem desrespeitar o território.",
    "typicalGear": [
      "Motos Yaiba Kusanagi ou Tetsuo",
      "Fiação Neural com Sandevistan ou Kerenzikov",
      "Tatuagem Luminescente",
      "Agente Criptografado"
    ],
    "signatureWeapons": [
      "Katana Monofilamentar Excelente Qualidade (4d6 ignora metade da armadura)",
      "Pistola Muito Pesada Dai Lung Streetmaster 4d6",
      "SMG Arasaka WSSA 3d6"
    ],
    "tactics": "Focam em mobilidade extrema, flanqueamento com motos, reflexos aprimorados e combate corpo a corpo letal cortando tendões.",
    "citation": "Night City Gang Guide p. 21 • CP:R p. 309 • CP2020 p. 145",
    "logoFilename": "Tyger Claws Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 14",
          "Handgun 13",
          "Evasion 14",
          "Drive Land Vehicle 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -3,
        "spHead": 12,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "6th-street",
    "name": "6th Street",
    "category": "Combat/PMC",
    "leader": "Coronel Rick Morrison / Will Gunner",
    "turf": [
      "Rancho Coronado",
      "Arroyo",
      "Charter Hill",
      "Vista Del Rey periferia"
    ],
    "threatLevel": "Alto",
    "identifiers": "Fardas camufladas urbanas, coletes táticos pesados com bandeiras das Velhas Nações Unidas e dos EUA, bonés e jaquetas militares estilizadas.",
    "activities": [
      "Venda de armas militares contrabandeadas",
      "Segurança de bairro cobrada à força",
      "Patrulhas de vigilantes paramilitares",
      "Desmanche de veículos blindados"
    ],
    "description": "Fundada por veteranos desiludidos da 4ª Guerra Corporativa para proteger suas famílias da omissão da polícia corporativa. Com o passar das décadas, degenerou em uma milícia mafiosa armada até os dentes.",
    "philosophy": "A lei só existe na boca de um fuzil; nós protegemos os nossos e esmagamos invasores.",
    "typicalGear": [
      "Colete Balístico Kevlar Pesado",
      "Rádio Tático Militar Criptografado",
      "Drones de Vigilância Micro",
      "Pickups blindadas 4x4"
    ],
    "signatureWeapons": [
      "Fuzil de Assalto Militech Ronin 5d6",
      "Pistola Pesada Sternmeyer 3d6",
      "Lança-Granadas de Mão 6d6"
    ],
    "tactics": "Empregam doutrina de esquadrão militar regular: cobertura mútua, fogo cruzado, granadas de fumaça e contenção de perímetro.",
    "citation": "Night City Gang Guide p. 25 • CP:R p. 308 • CP2020 p. 146",
    "logoFilename": "6th Street Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 13,
          "lieutenant": 15,
          "miniboss": 17,
          "boss": 19
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 11,
        "spBody": 13,
        "baseSkills": [
          "Shoulder Arms 14",
          "Tactics 13",
          "Heavy Weapons 13",
          "Handgun 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          10
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 14,
        "spTorso": 18,
        "spLimbs": 12
      }
    }
  },
  {
    "id": "bozos",
    "name": "Bozos",
    "category": "Prankster",
    "leader": "The Great Bobo / Sem liderança centralizada formal",
    "turf": [
      "Zonas de Combate de Night City",
      "Parques de Diversão Abandonados em Pacifica",
      "Galerias Pluviais Subterrâneas"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Cirurgias biosculpt permanentes com pés de palhaço ampliados, narizes vermelhos bulbosos que buzinam, cabelos sintéticos fluorescentes e sorrisos esculpidos com dentes afiados.",
    "activities": [
      "Atentados terroristas sádicos com pegadinhas letais",
      "Uso de neurotoxinas alucinógenas e gases hilariantes",
      "Sequestros aleatórios e tortura cômica"
    ],
    "description": "Gangue de ciberpsicopatas temáticos de palhaço sanguinários. Eles não buscam dinheiro nem território permanente: seu único objetivo é semear pânico absoluto e humilhação letal.",
    "philosophy": "A vida humana em Night City é uma piada sem graça; nós somos a gargalhada final que explode seu crânio.",
    "typicalGear": [
      "Gás Hilariante Tóxico (ácido/neurotoxina)",
      "Sapatos de Palhaço com Lâminas Ocultas",
      "Flor de Lapela que Espirra Ácido 4d6",
      "Buzinas que atordoam audição"
    ],
    "signatureWeapons": [
      "Flor de Lapela Ácida 4d6 (Ignora SP)",
      "Revólver Pesado com Canos Duplos 4d6",
      "Marreta de Borracha com Carga Explosiva 4d6"
    ],
    "tactics": "Atraem alvos para armadilhas cômicas bizarras, usam bombas de fumaça colorida e risadas estereofônicas para desorientar e despedaçar vítimas.",
    "citation": "Night City Gang Guide p. 33 • CP:R p. 308 • CP2020 p. 143",
    "logoFilename": "Bozos Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Stealth 14",
          "Conceal/Reveal 13",
          "Demolitions 14",
          "Brawling 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          9
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "inquisitors",
    "name": "Inquisidores",
    "category": "Cult",
    "leader": "Bispo Zachary / O Conclave dos Justos",
    "turf": [
      "Zona de Combate Central",
      "Igrejas Católicas e Protestantes em Ruínas",
      "Distritos de Cortiços Desolados"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Túnicas compridas de linho cru com cruzes de madeira penduradas; NENHUM ciberware visível nem interno; cicatrizes de extração manual de implantes.",
    "activities": [
      "Caça a qualquer pessoa com cibernéticos",
      "Arrancamento cirúrgico de ciberware a sangue frio e sem anestesia",
      "Terrorismo contra clínicas de Ripperdocs"
    ],
    "description": "Culto fundamentalista anti-tecnologia que prega que a carne humana foi feita à imagem de Deus e qualquer implante é a marca da Besta. Eles purificam pecadores arrancando seus membros de metal.",
    "philosophy": "Maldito o homem que profana o templo sagrado da carne humana com o cromo do Diabo.",
    "typicalGear": [
      "Torquês e Serras Cirúrgicas de Amputação",
      "Correntes Sagradas",
      "Blindagem Rústica Feita de Placas Metálicas e Sacos de Areia"
    ],
    "signatureWeapons": [
      "Espingarda Cano Duplo 5d6",
      "Serra Elétrica e Podador Cirúrgico 4d6",
      "Coquetéis Molotov 3d6 + Incêndio"
    ],
    "tactics": "Emboscam netrunners e indivíduos cromados em massa, usando redes para prendê-los e arrancadores manuais para desativar membros metálicos.",
    "citation": "Night City Gang Guide p. 37 • CP:R p. 309 • CP2020 p. 143",
    "logoFilename": "Inquisitors Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 40,
          "lieutenant": 55,
          "miniboss": 70,
          "boss": 85
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Resist Torture/Drugs 15",
          "Melee Weapon 14",
          "First Aid 13",
          "Brawling 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          11
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -4,
        "spHead": 8,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "valentinos",
    "name": "Valentinos",
    "category": "Syndicate",
    "leader": "Padre Ibarra / Mama Welles / Don Gustavo",
    "turf": [
      "Heywood",
      "The Glen",
      "Vista Del Rey",
      "El Coyote Cojo Bar"
    ],
    "threatLevel": "Alto",
    "identifiers": "Tatuagens de Santa Muerte e rosas douradas; crucifixos ornamentados em ouro maciço; carros lowriders modificados; roupas impecáveis com detalhes em cetim vermelho e preto.",
    "activities": [
      "Proteção comunitária em Heywood",
      "Contrabando de armas e artigos de luxo",
      "Festas de rua e competições de lowriders",
      "Guerra territorial contra 6th Street e Maelstrom"
    ],
    "description": "Uma das maiores e mais veneradas gangues de Night City, profundamente enraizada na cultura chicana e na devoção religiosa. Operam como guardiões ferozes de Heywood com forte código moral de honra.",
    "philosophy": "A família é eterna; honramos nossos santos e derramamos o sangue de quem ameaçar nossa vizinhança.",
    "typicalGear": [
      "Lowriders Personalizados com Suspensão Hidráulica",
      "Colares de Ouro com Santa Muerte",
      "Fiação Neural e Acelerador de Reflexos"
    ],
    "signatureWeapons": [
      "Pistola Pesada Banhada a Ouro 3d6 (Qualidade Excelente)",
      "Fuzil de Assalto Tático Kalashnikov 5d6",
      "Faca de Combate Estilizada 2d6"
    ],
    "tactics": "Atacam com paixão e velocidade, utilizando cobertura móvel com veículos lowriders e fogo coordenado de pistolas de alto calibre.",
    "citation": "Night City Gang Guide p. 29 • CP:R p. 309 • CP2020 p. 145",
    "logoFilename": "Street Queens Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Handgun 14",
          "Brawling 13",
          "Drive Land Vehicle 14",
          "Streetwise 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 10,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "voodoo-boys",
    "name": "Voodoo Boys",
    "category": "Cult",
    "leader": "Brigitte / Placide / Ti Neptune",
    "turf": [
      "Pacifica",
      "Coastview",
      "Batty's Hotel",
      "Subterrâneos da Antiga Rede"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Rastafáris com fios de fibra óptica luminosa entrelaçados; tatuagens e cicatrizes rituais haitianas; óculos escuros cibernéticos e jaquetas impermeáveis contra chuva ácida costeira.",
    "activities": [
      "Netrunning de alta graduação",
      "Exploração das profundezas da NET e contato com IAs Livres além da Blackwall",
      "Terrorismo cibernético contra corporações",
      "Defesa da comunidade haitiana de Pacifica"
    ],
    "description": "Comunidade insular de netrunners de elite de ascendência haitiana. Encaram a NET não apenas como uma ferramenta tecnológica, mas como o reino sobrenatural dos Loas e entidades espirituais digitais.",
    "philosophy": "O Velho Mundo se afogou na tempestade; a NET é o mar dos deuses onde navegamos livres das correntes dos homens brancos corporativos.",
    "typicalGear": [
      "Cyberdecks Militares de Alta Performance",
      "Neural Links com Interface de Plugue Direto",
      "Programas Demoníacos de Black ICE",
      "Trajes Térmicos Isolantes"
    ],
    "signatureWeapons": [
      "Submetralhadora Compacta Inteligente (Smart SMG) 3d6",
      "Monowire / Chicote de Fibra Monofilamentar 3d6",
      "Cyberdeck Customizado com Black ICE letal"
    ],
    "tactics": "Preferem nunca entrar em combate físico direto: fritam cérebros de invasores através de ataques virais à distância enquanto drones automatizados fornecem fogo de cobertura.",
    "citation": "Night City Gang Guide p. 41 • CP:R p. 309 • CP2020 p. 143",
    "logoFilename": "Voodoo Boys Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Interface 16",
          "Cryptography 15",
          "Electronics/Security 14",
          "Handgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "piranhas",
    "name": "Piranhas",
    "category": "Party",
    "leader": "Lil Fish / Apex / Matilhas Descentralizadas",
    "turf": [
      "Marina de Watson",
      "Little China canais",
      "Calçadões da Baía de Coronado"
    ],
    "threatLevel": "Médio",
    "identifiers": "Pinturas faciais fluorescentes, dentes cerrados em pontas triangulares afiadas, shorts de praia de neoprene rasgados e jaquetas térmicas com escamas sintéticas.",
    "activities": [
      "Festas rave ilegais na orla marítima",
      "Tráfico de drogas aquáticas e Smash",
      "Assaltos relâmpago a pedestres bêbados",
      "Pilhagem de armazéns portuários"
    ],
    "description": "Gangue festeira hedonista e violenta que infesta as docas de Watson e os calçadões litorâneos. Como o peixe que lhes dá o nome, atacam em cardumes barulhentos assim que farejam sangue ou vulnerabilidade.",
    "philosophy": "A festa nunca para até o sol nascer tóxico; e quem ficar sozinho no calçadão vira comida de peixe.",
    "typicalGear": [
      "Lentes de Contato Luminescentes",
      "Pranchas de Surf Motorizadas",
      "Injetores de Smash e Drogas de Festa"
    ],
    "signatureWeapons": [
      "Pistola Pesada 3d6",
      "Machadinha de Mergulho 2d6",
      "Submetralhadora 2d6 com Pente Estendido"
    ],
    "tactics": "Cercam a presa aos gritos, dançando e rindo para desorientar antes de descarregarem suas armas curtas à queima-roupa todos ao mesmo tempo.",
    "citation": "Night City Gang Guide p. 45 • CP:R p. 309 • CP2020 p. 144",
    "logoFilename": "Piranhas Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 7,
        "baseSkills": [
          "Handgun 13",
          "Athletics 13",
          "Brawling 12",
          "Play Instrument 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -2,
        "spHead": 6,
        "spTorso": 8,
        "spLimbs": 6
      }
    }
  },
  {
    "id": "red-chrome-legion",
    "name": "Red Chrome Legion",
    "category": "Cult",
    "leader": "The Beloved Gaping Maw / General Grimm",
    "turf": [
      "Estradas dos Badlands",
      "Santo Domingo periferia",
      "Depósitos de sucata industrial"
    ],
    "threatLevel": "Médio",
    "identifiers": "Tatuagens de cruz de ferro de neon vermelho, botas militares com biqueira de aço, suásticas e símbolos fascistas estilizados em spray vermelho.",
    "activities": [
      "Ataques de ódio contra minorias e nômades",
      "Vandalismo terrorista",
      "Saques em rodovias secundárias e ferros-velhos"
    ],
    "description": "Gangue neonazista xenófoba e reacionária, desprezada até mesmo pelas outras gangues criminosas da cidade. Vivem em contínua guerra suja contra os Inquisidores e clãs nômades.",
    "philosophy": "Purificação pela força bruta e supremacia armada sobre as cinzas de Night City.",
    "typicalGear": [
      "Botas pesadas com ponteira de aço",
      "Capacetes militares reciclados",
      "Correntes pesadas e cassetetes elétricos"
    ],
    "signatureWeapons": [
      "Cassetete Pesado de Metal 3d6",
      "Pistola Pesada 3d6",
      "Espingarda de Repetição 5d6"
    ],
    "tactics": "Preferem emboscar alvos isolados em superioridade numérica esmagadora com armas de impacto antes de fugir em vans enferrujadas.",
    "citation": "Night City Gang Guide p. 17 • CP:R p. 309 • CP2020 p. 144",
    "logoFilename": "Red Chrome Legion Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 35,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 13",
          "Shotgun 12",
          "Brawling 13",
          "Intimidation 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -3,
        "spHead": 10,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "philharmonic-vampyres",
    "name": "Philharmonic Vampyres",
    "category": "Prankster",
    "leader": "Count Vlad / O Maestro Fantasma",
    "turf": [
      "Centro Corporativo",
      "Teatros Abandonados de Westbrook",
      "Cemitérios e Criptas Nobres"
    ],
    "threatLevel": "Médio",
    "identifiers": "Fraques do século XIX, capas pretas com forro de veludo carmesim, presas cibernéticas afiadas retráteis e pele empalidecida artificialmente via tratamentos dérmicos.",
    "activities": [
      "Pegadinhas góticas teatrais de alta complexidade",
      "Sequestro encenado de diplomatas e executivos",
      "Bailes de máscaras ilegais em prédios corporativos"
    ],
    "description": "Gangue de brincalhões intelectuais que adotam estética de vampiros da literatura gótica clássica. Diferente dos Bozos, eles evitam assassinatos sangrentos gratuitos, preferindo o terror psicológico requintado e o caos dramático.",
    "philosophy": "A morte deve ser uma composição poética majestosa, não um tiroteio feio de rua.",
    "typicalGear": [
      "Presas Cibernéticas com Injetor de Veneno Paralítico",
      "Cartolas e Capas Balísticas com Kevlar Disfarçado",
      "Monóculos com Gravadores de Vídeo"
    ],
    "signatureWeapons": [
      "Presas Vampíricas com Toxina 2d6",
      "Bengala com Espada Oculta 3d6",
      "Pistola Pesada Suprimida 3d6"
    ],
    "tactics": "Apagam luzes, usam máquinas de fumaça densa e sistemas sonoros com músicas fúnebres de órgão para aterrorizar vítimas antes de um golpe elegante no pescoço.",
    "citation": "Night City Gang Guide p. 49 • CP2020 p. 144 • Interface RED Vol. 2",
    "logoFilename": "Philharmonic Vampyres Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Stealth 15",
          "Melee Weapon 14",
          "Acting 14",
          "Handgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "iron-sights",
    "name": "Iron Sights",
    "category": "Combat/PMC",
    "leader": "Capitão Miller / Sarge Ortiz",
    "turf": [
      "Arroyo Industrial",
      "Docas de Containers de Morro Bay",
      "Armazéns Ferroviários"
    ],
    "threatLevel": "Alto",
    "identifiers": "Miras ópticas cibernéticas militares Kiroshi instaladas nos dois olhos; jaquetas utilitárias cinza com insígnias de alvos cruzados; coldres de precisão.",
    "activities": [
      "Contratos de assassinato de elite",
      "Guarda de comboios de carga pesada",
      "Treinamento de mercenários independentes"
    ],
    "description": "Companhia de atiradores de elite e veteranos de operações especiais que formaram uma irmandade letal de mercenários urbanos.",
    "philosophy": "Um único tiro limpo vale mais do que cem rajadas barulhentas.",
    "typicalGear": [
      "Óptica Cibernética com Mira Telescópica e Telêmetro",
      "Smartgun Link",
      "Camuflagem Térmica"
    ],
    "signatureWeapons": [
      "Fuzil Sniper Nomad / Arasaka WSSA 5d6",
      "Pistola Pesada de Precisão 3d6",
      "Faca de Trincheira 2d6"
    ],
    "tactics": "Posicionam-se em telhados altos e guindastes, abatendo ameaças a centenas de metros com tiros calibrados na cabeça.",
    "citation": "Night City Gang Guide p. 53 • Solo of Fortune II",
    "logoFilename": "Iron Sights Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 13,
          "lieutenant": 15,
          "miniboss": 17,
          "boss": 19
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 11,
        "spBody": 13,
        "baseSkills": [
          "Shoulder Arms 16",
          "Stealth 14",
          "Conceal/Reveal 14",
          "Handgun 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -3,
        "spHead": 12,
        "spTorso": 16,
        "spLimbs": 12
      }
    }
  },
  {
    "id": "steel-vaqueros",
    "name": "Steel Vaqueros",
    "category": "Nomad/Racer",
    "leader": "Santiago Rodriguez / Don Hernan",
    "turf": [
      "Badlands Sul",
      "Interestadual 101",
      "Postos Abandonados de Gasolina"
    ],
    "threatLevel": "Alto",
    "identifiers": "Chapéus de vaqueiro reforçados com kevlar, botas com esporas de cromo, jaquetas de couro de novilho sintético com franjas e fivelas de prata maciça.",
    "activities": [
      "Escolta de caravanas nômades",
      "Combate contra bandos de Raffen Shiv",
      "Rodeios mecânicos com veículos blindados"
    ],
    "description": "Gangue de motoqueiros nômades de honra feroz que patrulham o deserto do sul e as fronteiras rochosas de Night City.",
    "philosophy": "A poeira do deserto limpa a alma; a lealdade ao bando é selada com pólvora e sangue.",
    "typicalGear": [
      "Motos Cruiser Customizadas com CHOOH2 Nitro",
      "Rádios de Longo Alcance CB",
      "Rifle Scabbard no Chassi"
    ],
    "signatureWeapons": [
      "Carabina de Alavanca 4d6",
      "Revólver Muito Pesado .44 Magnum 4d6",
      "Laço de Cabo de Aço e Faca Bowie 2d6"
    ],
    "tactics": "Cavalgam em formação de cerco em alta velocidade, disparando carabinas e enlaçando alvos em fuga.",
    "citation": "Neo-Tribes Nomad Guide p. 28 • CP:R p. 312",
    "logoFilename": "Steel Vaqueros Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Drive Land Vehicle 15",
          "Shoulder Arms 14",
          "Handgun 14",
          "Survival 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          10
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 10,
        "spTorso": 14,
        "spLimbs": 12
      }
    }
  },
  {
    "id": "albino-alligators",
    "name": "Albino Alligators",
    "category": "Booster",
    "leader": "Old Croc / Big Mike",
    "turf": [
      "Esgotos e Canais de Pacifica",
      "Canal de Del Coronado",
      "Estações de Tratamento Desativadas"
    ],
    "threatLevel": "Alto",
    "identifiers": "Enxertos dérmicos de escamas albinas brancas pálidas, garras de titânio nos dedos, capas impermeáveis manchadas de limo e esgoto.",
    "activities": [
      "Emboscadas subterrâneas",
      "Descarte clandestino de corpos para corporações",
      "Contrabando por via aquática subterrânea"
    ],
    "description": "Gangue bestial que colonizou os labirintos de esgoto inundados sob Night City, adaptados à vida sem luz solar.",
    "philosophy": "O que cai no esgoto pertence aos jacarés; tudo e todos são devorados no escuro.",
    "typicalGear": [
      "Equipamento de Mergulho de Circuito Fechado",
      "Garras Cibernéticas Big Knucks",
      "Lanternas Subaquáticas UV"
    ],
    "signatureWeapons": [
      "Arpão Pneumático com Corda 4d6",
      "Espingarda Serrada 5d6",
      "Garras Escamosas 2d6"
    ],
    "tactics": "Puxam vítimas para dentro da água suja das galerias pluviais, afogando e dilacerando presas em silêncio.",
    "citation": "Night City Gang Guide p. 57 • Cyberpunk RED Corebook p. 310",
    "logoFilename": "Albino Alligators Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 40,
          "lieutenant": 55,
          "miniboss": 70,
          "boss": 85
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Athletics (Swimming) 15",
          "Stealth 14",
          "Brawling 14",
          "Shotgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          9,
          11
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -4,
        "spHead": 12,
        "spTorso": 14,
        "spLimbs": 12
      }
    }
  },
  {
    "id": "andersons",
    "name": "The Andersons",
    "category": "Poser",
    "leader": "Father Anderson / Papai Sabe Tudo",
    "turf": [
      "Little Europe",
      "Subúrbios de Westbrook",
      "Ruas Residenciais de Charter Hill"
    ],
    "threatLevel": "Baixo",
    "identifiers": "Suéteres de lã sintética xadrez dos anos 50, cachimbos artificiais sem tabaco, sorrisos congelados e cortes de cabelo impecáveis estilo subúrbio retrô.",
    "activities": [
      "Sequestros de crianças para \"adoção na família perfeita\"",
      "Assaltos mantendo extrema cordialidade e etiqueta",
      "Assassinatos de vizinhos que desarrumarem a calçada"
    ],
    "description": "Posergangue bizarra que se recriou como a família tradicional americana idílica de uma sitcom de televisão de 1955. Por trás do sorriso impecável, esconde-se pura demência armada.",
    "philosophy": "Um lar perfeito exige uma família perfeita e punição exemplar para quem quebrar a paz do bairro.",
    "typicalGear": [
      "Maletas Executivas de Couro com Fecho de Aço",
      "Aparelhos Auditivos Disfarçados",
      "Pipas e Cachimbos Eletrônicos"
    ],
    "signatureWeapons": [
      "Pistola Pesada Oculta na Maleta 3d6",
      "Faca de Trinchar Carne 2d6",
      "Espingarda de Caça Doméstica 5d6"
    ],
    "tactics": "Aproximam-se com um sorriso educado e um prato de torta antes de sacar revólveres pesados.",
    "citation": "Night City Gang Guide p. 61 • Posergang Archives",
    "logoFilename": "Andersons Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 10,
          "lieutenant": 12,
          "miniboss": 14,
          "boss": 16
        },
        "hp": {
          "mook": 25,
          "lieutenant": 35,
          "miniboss": 50,
          "boss": 65
        },
        "spHead": 4,
        "spBody": 7,
        "baseSkills": [
          "Acting 15",
          "Handgun 12",
          "Persuasion 14",
          "Stealth 11"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          7,
          8
        ],
        "btm": -2,
        "spHead": 4,
        "spTorso": 8,
        "spLimbs": 4
      }
    }
  },
  {
    "id": "arzin-tynon",
    "name": "Arzin Tynon",
    "category": "Nomad/Racer",
    "leader": "Kestrel Tynon / O Barão do Asfalto",
    "turf": [
      "Rotas Comerciais das Badlands",
      "Postos de Pedágio Abandonados",
      "Oásis Tóxicos"
    ],
    "threatLevel": "Alto",
    "identifiers": "Caminhonetes e buggies cobertos com blindagem de placas de sinalização de trânsito rebitadas; lenços de poeira cinza e óculos de soldador.",
    "activities": [
      "Pedágio forçado em comboios corporativos",
      "Pilhagem de carregamentos de baterias",
      "Venda de água filtrada no deserto"
    ],
    "description": "Bando guerreiro das autoestradas especializado em cercar e saquear carretas corporativas de CHOOH2 e suprimentos médicos.",
    "philosophy": "Se passa na nossa estrada, paga o dízimo em combustível ou vira sucata fumegante.",
    "typicalGear": [
      "Buggies off-road com esteiras de tração",
      "Lança-Farpas Pneumático",
      "Tanques Extras de Nitro"
    ],
    "signatureWeapons": [
      "Rifle Automático com Tambor Duplo 5d6",
      "Lança-Granadas de Mão 6d6",
      "Pistola Pesada 3d6"
    ],
    "tactics": "Atacam em matilha nas laterais das carretas, perfurando os pneus e saltando para o teto com arpéus.",
    "citation": "Rockerboy Magazine p. 44 • CP:R Data Pack",
    "logoFilename": "Arzin Tynon Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Drive Land Vehicle 14",
          "Shoulder Arms 13",
          "Heavy Weapons 13",
          "Brawling 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "culper-ring",
    "name": "Culper Ring",
    "category": "Combat/PMC",
    "leader": "Agente 711 / Conselho de Sombras",
    "turf": [
      "Centros Financeiros",
      "Cafés Secretos em Charter Hill",
      "Prédios de Telecomunicações"
    ],
    "threatLevel": "Alto",
    "identifiers": "Ternos discretos sob medida com cortes clássicos; ausência total de logotipos ou insígnias visíveis; pequenos anéis de prata no mindinho.",
    "activities": [
      "Espionagem corporativa profunda",
      "Venda de segredos industriais e chantagem política",
      "Assassinatos que parecem mortes naturais"
    ],
    "description": "Célula de operadores de inteligência e espiões independentes que operam como uma sociedade secreta conspiratória no coração de Night City.",
    "philosophy": "A informação mais perigosa é aquela que você nem sabe que foi roubada.",
    "typicalGear": [
      "Gravadores Oculares Kiroshi Criptografados",
      "Cibernéticos Subdérmicos Ocultos",
      "Injetores de Veneno Indetectável"
    ],
    "signatureWeapons": [
      "Pistola Pesada Suprimida com Munição Perfurante 3d6",
      "Monofilamento Invisível Garrote 3d6",
      "Dartgun com Neurotoxina 2d6"
    ],
    "tactics": "Evitam tiroteios abertos; usam disfarces perfeitos, infiltração silenciosa e execuções a curta distância com silenciadores.",
    "citation": "Corporate Report Vol. 3 • Night City Sourcebook",
    "logoFilename": "Culper Ring Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Stealth 16",
          "Conceal/Reveal 15",
          "Handgun 14",
          "Bribery 15"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -3,
        "spHead": 10,
        "spTorso": 12,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "deadwoods",
    "name": "Deadwoods",
    "category": "Eco/Guerilla",
    "leader": "Sylvan / Timber",
    "turf": [
      "Florestas Queimadas ao Norte",
      "Colinas de North Oak desmatadas",
      "Parques Desérticos"
    ],
    "threatLevel": "Médio",
    "identifiers": "Roupas feitas de cascas de árvores sintéticas, galhos carbonizados presos nas mochilas, pinturas de camuflagem de cinzas na face.",
    "activities": [
      "Emboscadas contra caminhões de lixo tóxico corporativo",
      "Eco-sabotagem de oleodutos",
      "Guerrilha florestal nas fronteiras de Night City"
    ],
    "description": "Eco-rebeldes fanáticos que juraram vingar a destruição das florestas da Califórnia e combatem qualquer um que lucre com poluição.",
    "philosophy": "A cinza da terra queimada exige o sangue das corporações que a mataram.",
    "typicalGear": [
      "Arcos Compostos com Pontas Explosivas",
      "Equipamento de Sobrevivência Selvagem",
      "Camuflagem Ghillie Suit Térmica"
    ],
    "signatureWeapons": [
      "Arco de Alta Potência com Pontas Incendiárias 4d6",
      "Machado Florestal 3d6",
      "Fuzil de Caça 5d6"
    ],
    "tactics": "Atacam a partir de copas de árvores secas ou buracos no chão, sumindo na fumaça antes que reforços cheguem.",
    "citation": "Green Earth Guerrillas Guide • CP:R p. 311",
    "logoFilename": "Deadwoods Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 35,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Stealth 15",
          "Survival 15",
          "Shoulder Arms 13",
          "Melee Weapon 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "dirty-hippies",
    "name": "Dirty Hippies",
    "category": "Party",
    "leader": "Sunburst / Mama Gaia",
    "turf": [
      "Praias Tóxicas de Pacifica",
      "Acampamentos de Tendas em Santo Domingo",
      "Lixões"
    ],
    "threatLevel": "Baixo",
    "identifiers": "Túnicas tie-dye desbotadas, colares de contas de plástico reciclado, pés descalços ou sandálias de pneu, cheiro forte de patchouli sintético e fumaça alucinógena.",
    "activities": [
      "Distribuição de ácido sintético em festivais",
      "Ocupações pacíficas que viram rebeliões caóticas",
      "Assaltos para comprar mantimentos"
    ],
    "description": "Gangue anarco-psicodélica que prega amor livre e anticonsumismo, mas financia sua loucura assaltando com pedras, facas e armas caseiras.",
    "philosophy": "Faça amor, não guerra corporativa — a menos que a gente precise da sua carteira para comprar mais ácido.",
    "typicalGear": [
      "Vans Pintadas com Cores Psicodélicas",
      "Incenso Alucinógeno",
      "Pandeiros com Navalhas"
    ],
    "signatureWeapons": [
      "Pistola Leve Barata 2d6",
      "Spray de Gás Lacrimogêneo e Alucinógeno",
      "Cassetete de Madeira 2d6"
    ],
    "tactics": "Cantam em roda enquanto cercam o alvo, lançando pó alucinógeno nos olhos antes de derrubá-lo no chão.",
    "citation": "Night City Stories • CP2020 Gangs Catalog",
    "logoFilename": "Dirty Hippies Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 9,
          "lieutenant": 11,
          "miniboss": 13,
          "boss": 15
        },
        "hp": {
          "mook": 25,
          "lieutenant": 35,
          "miniboss": 50,
          "boss": 65
        },
        "spHead": 4,
        "spBody": 7,
        "baseSkills": [
          "Brawling 12",
          "Streetwise 13",
          "Play Instrument 14",
          "Stealth 11"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          6,
          8
        ],
        "btm": -2,
        "spHead": 4,
        "spTorso": 6,
        "spLimbs": 4
      }
    }
  },
  {
    "id": "dragula-racers",
    "name": "Dragula Racers",
    "category": "Nomad/Racer",
    "leader": "Herman Munster / Baron von Drag",
    "turf": [
      "Interestaduais de Santo Domingo",
      "Autódromo Abandonado de Pacifica",
      "Estrada das Colinas"
    ],
    "threatLevel": "Alto",
    "identifiers": "Carros funerários pretos rebaixados equipados com motores V8 superalimentados e chamas saindo dos escapamentos; jaquetas de couro de vampiro motoqueiro.",
    "activities": [
      "Rachas mortais clandestinos com apostas em dinheiro e membros corporais",
      "Tráfico de peças automotivas raras",
      "Sabotagem de veículos rivais"
    ],
    "description": "Adoradores da velocidade extrema e da estética de horror gótico em alta cilindrada. Pilotam verdadeiros caixões com rodas capazes de ultrapassar 300 km/h.",
    "philosophy": "A morte é o único passageiro que nunca desce do nosso banco de trás.",
    "typicalGear": [
      "Carros Funerários Blindados com Cilindros de Nitro Duplos",
      "Capacetes Fechados com Viseira Fumê",
      "Sinalizadores Náuticos"
    ],
    "signatureWeapons": [
      "Submetralhadora Pesada 3d6",
      "Espingarda Serrada de Canos Duplos 5d6",
      "Corrente Pesada com Ponta de Ferro 2d6"
    ],
    "tactics": "Fecham o trânsito com batidas deliberadas, disparando de dentro dos veículos em manobras de derrapagem.",
    "citation": "Night City Gang Guide p. 65 • Maximum Metal",
    "logoFilename": "Dragula Racers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Drive Land Vehicle 16",
          "Handgun 13",
          "Autofire 13",
          "Basic Tech 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -3,
        "spHead": 10,
        "spTorso": 12,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "enhanced",
    "name": "The Enhanced",
    "category": "Booster",
    "leader": "Titan Prime / Dra. Valerie Grey",
    "turf": [
      "Little China",
      "Watson Centro Médico",
      "Laboratórios Desativados"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Cromagem completa de grau cirúrgico de luxo; quatro braços cibernéticos ou exoesqueletos cromados; olhos com matriz ótica quádrupla azul brilhante.",
    "activities": [
      "Caça a cibernéticos experimentais de ponta",
      "Sequestro de engenheiros de ciberware",
      "Combates de arena subterrânea para testar implantes"
    ],
    "description": "Transumanistas fanáticos que encaram o ciberware como a única forma aceitável de divindade cósmica, desprezando qualquer um que mantenha órgãos biológicos.",
    "philosophy": "A evolução biológica falhou; a perfeição só é esculpida no titânio e no silício.",
    "typicalGear": [
      "Exoesqueleto Linear Frame Beta",
      "Subdermal Plating Nível Militar",
      "Smartlink com Neuralware Reforçado"
    ],
    "signatureWeapons": [
      "Lâmina Mantis Dupla Monofilamentar 4d6",
      "Fuzil de Assalto Smart 5d6",
      "Canhão de Braço Micromíssil 6d6"
    ],
    "tactics": "Avançam como máquinas de guerra impiedosas, absorvendo tiros leves enquanto fatiam alvos com velocidade computacional.",
    "citation": "Chromebook 4 • CP:R p. 308",
    "logoFilename": "Enhanced Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 14,
          "lieutenant": 16,
          "miniboss": 18,
          "boss": 20
        },
        "hp": {
          "mook": 45,
          "lieutenant": 60,
          "miniboss": 80,
          "boss": 100
        },
        "spHead": 13,
        "spBody": 13,
        "baseSkills": [
          "Melee Weapon 16",
          "Brawling 16",
          "Autofire 14",
          "Cybertechnology 15"
        ]
      },
      "CP2020": {
        "bodyRange": [
          10,
          14
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -5,
        "spHead": 16,
        "spTorso": 20,
        "spLimbs": 16
      }
    }
  },
  {
    "id": "eurotrashers",
    "name": "Eurotrashers",
    "category": "Party",
    "leader": "Julian von Hohenlohe / Lady Astrid",
    "turf": [
      "North Oak",
      "Clubes Exclusivos de Cobertura em City Center",
      "Marina de Luxo"
    ],
    "threatLevel": "Médio",
    "identifiers": "Roupas de alta costura europeia de marcas como Yves Saint-Laurent Sintético e Gucci Cyber; óculos escuros com armação de platina; cheiro de champanhe caro e cocaína sintética.",
    "activities": [
      "Festas regadas a drogas proibidas em coberturas",
      "Jogos de roleta russa com criados e plebeus",
      "Caçadas noturnas a mendigos por pura adrenalina"
    ],
    "description": "Filhos pródigos de altos executivos europeus e aristocratas entediados que usam sua fortuna quase ilimitada e imunidade corporativa para cometer crimes hediondos como diversão.",
    "philosophy": "Se o dinheiro compra o perdão, o pecado não existe.",
    "typicalGear": [
      "Roupas Blindadas de Seda com Kevlar 11 SP",
      "Agentes Pessoais de Ouro com IA de Luxo",
      "Injetores de Drogas de Alta Pureza"
    ],
    "signatureWeapons": [
      "Pistola Monocroma de Platina 3d6",
      "Submetralhadora Compacta Excelente Qualidade 3d6",
      "Adaga Suíça de Titânio 2d6"
    ],
    "tactics": "Atiram rindo e zombando, contando com seus advogados e guarda-costas profissionais para tirá-los de qualquer enrascada.",
    "citation": "Eurosource Plus • CP2020 High Society Gangs",
    "logoFilename": "Eurotrashers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 10,
          "lieutenant": 12,
          "miniboss": 14,
          "boss": 16
        },
        "hp": {
          "mook": 25,
          "lieutenant": 35,
          "miniboss": 50,
          "boss": 65
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Handgun 13",
          "Wardrobe & Style 16",
          "Bribery 16",
          "Evasion 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "fixies-couriers",
    "name": "Fixies Couriers",
    "category": "Street/Territorial",
    "leader": "Sprocket / Velocity Kid",
    "turf": [
      "Calçadas de Japantown",
      "Corredores Expressos de Watson",
      "Passarelas Suspensas"
    ],
    "threatLevel": "Baixo",
    "identifiers": "Bicicletas de marcha fixa reforçadas com fibra de carbono e neons nos aros; capacetes aerodinâmicos com telas HUD; mochilas de entregador seladas a vácuo.",
    "activities": [
      "Entrega ultra-rápida de contrabando e dados em mídia física",
      "Fuga de drones policiais",
      "Espionagem de rotas de trânsito corporativo"
    ],
    "description": "Irmandade de mensageiros velocistas que navegam pelo inferno do tráfego de Night City mais rápido do que qualquer carro ou moto esportiva.",
    "philosophy": "Se parar de pedalar, você é atropelado pelo futuro.",
    "typicalGear": [
      "Bicicleta Fixie de Titânio e Grafeno",
      "Pernas Cibernéticas com Motores Jump",
      "Bolsas Térmicas Seladas à Prova d'Água"
    ],
    "signatureWeapons": [
      "Trava de Bicicleta U-Lock de Aço Maciço 3d6",
      "Pistola Leve Oculta 2d6",
      "Spray de Pimenta e Taser 2d6"
    ],
    "tactics": "Nunca param; golpeiam com travas de aço em alta velocidade e desaparecem por ruelas estreitas e becos intransitáveis para carros.",
    "citation": "Interface RED Vol. 1 • Street Couriers Guide",
    "logoFilename": "Fixies Couriers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 7,
        "baseSkills": [
          "Athletics 16",
          "Evasion 15",
          "Melee Weapon 13",
          "Streetwise 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -2,
        "spHead": 6,
        "spTorso": 8,
        "spLimbs": 6
      }
    }
  },
  {
    "id": "g3",
    "name": "G3",
    "category": "Combat/PMC",
    "leader": "Major Braxton Vance / Operador Delta",
    "turf": [
      "Charter Hill",
      "Instalações de Telecomunicações",
      "Depósitos de Armas"
    ],
    "threatLevel": "Alto",
    "identifiers": "Fardas pretas impermeáveis de intervenção tática; capacetes balísticos com visão termográfica e noturna integrada; botas táticas silenciosas.",
    "activities": [
      "Assaltos cirúrgicos a bancos e cofres de dados",
      "Resgate forçado de reféns corporativos",
      "Venda de serviços de demolição armada"
    ],
    "description": "Grupo paramilitar dissidente formado por veteranos de forças especiais que operam como uma empresa mercenária clandestina de altíssimo risco.",
    "philosophy": "Eficiência militar absoluta sem burocracia governamental.",
    "typicalGear": [
      "Capacete Tático com Smart HUD",
      "Granadas de Luz e Som (Flashbangs)",
      "Carga Oca C4"
    ],
    "signatureWeapons": [
      "Fuzil de Assalto Tático Militech 5d6",
      "Submetralhadora Heckler & Koch 3d6",
      "Pistola Muito Pesada 4d6"
    ],
    "tactics": "Explosão de portas com breaching charges, entrada dinâmica com flashbangs e neutralização de alvos em segundos com tiros duplos no peito.",
    "citation": "Solo of Fortune p. 38 • CP:R p. 310",
    "logoFilename": "G3 Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 13,
          "lieutenant": 15,
          "miniboss": 17,
          "boss": 19
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 13,
        "spBody": 13,
        "baseSkills": [
          "Shoulder Arms 15",
          "Tactics 14",
          "Demolitions 14",
          "Handgun 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          10
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -4,
        "spHead": 14,
        "spTorso": 18,
        "spLimbs": 14
      }
    }
  },
  {
    "id": "generation-red",
    "name": "Generation Red",
    "category": "Street/Territorial",
    "leader": "Scarlett / Ruby Vance",
    "turf": [
      "Rancho Coronado",
      "Escolas e Pátios em Ruínas",
      "Cortiços em Heywood"
    ],
    "threatLevel": "Médio",
    "identifiers": "Cabelos pintados de vermelho brilhante, jaquetas bordadas com nuvens vermelhas radioativas, tênis gastos com solas luminosas.",
    "activities": [
      "Vandalismo político contra megacorporações",
      "Contrabando de alimentos frescos",
      "Pichações revolucionárias e guerrilha de rua"
    ],
    "description": "Juventude nascida sob os céus vermelhos pós-4ª Guerra Corporativa. Desprezam tanto os velhos nostálgicos do século XX quanto os executivos engravatados.",
    "philosophy": "Vocês destruíram o planeta antes de nascermos; nós vamos queimar o que sobrou.",
    "typicalGear": [
      "Latas de Tinta Spray Condutora",
      "Rádios Piratas de Baixa Frequência",
      "Óculos de Proteção contra Poeira"
    ],
    "signatureWeapons": [
      "Submetralhadora 3d6",
      "Taco de Beisebol com Pregos e Arame Farpado 2d6",
      "Coquetel Molotov Caseiro 3d6 + Fogo"
    ],
    "tactics": "Atacam em bandos de dez ou quinze jovens, flanqueando viaturas e fugindo pelos telhados antes da chegada do DPNC.",
    "citation": "Night City Gang Guide p. 71 • Time of the RED Guide",
    "logoFilename": "Generation Red Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 7,
        "baseSkills": [
          "Autofire 13",
          "Streetwise 14",
          "Brawling 13",
          "Athletics 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -2,
        "spHead": 6,
        "spTorso": 8,
        "spLimbs": 6
      }
    }
  },
  {
    "id": "gold-dragons",
    "name": "Gold Dragons",
    "category": "Syndicate",
    "leader": "Dragão Dourado Chen / Shan Yu",
    "turf": [
      "Chinatown",
      "Mercado Central de Little China",
      "Docas de Frutos do Mar"
    ],
    "threatLevel": "Alto",
    "identifiers": "Tatuagens de dragões serpenteantes chineses em tinta dourada; ternos de seda brocada com dragões bordados nas costas; anéis pesados de jade verde e ouro.",
    "activities": [
      "Lavagem de dinheiro internacional",
      "Casas clandestinas de mahjong e apostas",
      "Tráfico de armas asiáticas pesadas"
    ],
    "description": "Antiga Tríade chinesa tradicionalista que controla grande parte do comércio clandestino de Little China, travando guerra silenciosa contra os Tyger Claws.",
    "philosophy": "A paciência do dragão aguarda a tempestade passar para devorar os tolos.",
    "typicalGear": [
      "Agentes Criptografados de Satélite",
      "Veículos Blindados Sedã com Vidro Fumê",
      "Amuletos de Proteção de Jade"
    ],
    "signatureWeapons": [
      "Espada Jian Chinesa Monofilamentar 4d6",
      "Fuzil de Assalto Tipo 97 5d6",
      "Pistola Muito Pesada 4d6"
    ],
    "tactics": "Empregam artes marciais letais combinadas com disparos precisos de armas pesadas, mantendo disciplina de ferro.",
    "citation": "Pacific Rim Sourcebook p. 88 • Night City Sourcebook",
    "logoFilename": "Gold Dragons Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 15",
          "Martial Arts 15",
          "Handgun 14",
          "Interrogation 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -3,
        "spHead": 12,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "julliard-guild",
    "name": "Julliard Guild",
    "category": "Poser",
    "leader": "O Diretor de Cena / Prima Donna Ophelia",
    "turf": [
      "Teatros Abandonados de Westbrook",
      "Little Italy",
      "Auditórios em Ruínas"
    ],
    "threatLevel": "Médio",
    "identifiers": "Trajes de gala renascentistas, máscaras teatrais venezianas de porcelana com sorrisos e choros trágicos, maquiagem pesada de ópera.",
    "activities": [
      "Assassinatos coreografados filmados ao vivo",
      "Sequestro de diretores de mídia para atuações forçadas",
      "Espetáculos macabros de morte nas ruas"
    ],
    "description": "Artistas cênicos ciberpsicopatas que transformaram a arte dramática em execuções teatrais sangrentas e hiperviolentas nas esquinas da cidade.",
    "philosophy": "O mundo inteiro é um palco, e a plateia paga pelo seu último suspiro em cena.",
    "typicalGear": [
      "Máscara Facial Balística de Porcelana Reforçada",
      "Microfones Sem Fio com Efeito Sonoro Dramático",
      "Bombas de Confete Explosivo"
    ],
    "signatureWeapons": [
      "Rapieira Monofilamentar de Duelo 3d6",
      "Pistola de Dardo com Veneno Paralisante 2d6",
      "Bengala com Escopeta Embutida 5d6"
    ],
    "tactics": "Citam monólogos shakespearianos em voz alta enquanto executam duelos de esgrima coreografados e mortais.",
    "citation": "Night City Gang Guide p. 77 • Posergang Profiles",
    "logoFilename": "Julliard Guild Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 11,
        "spBody": 7,
        "baseSkills": [
          "Melee Weapon 15",
          "Acting 16",
          "Evasion 14",
          "Handgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -2,
        "spHead": 10,
        "spTorso": 10,
        "spLimbs": 6
      }
    }
  },
  {
    "id": "kill-krashers",
    "name": "Kill Krashers",
    "category": "Booster",
    "leader": "Demolition Dan / Sledge",
    "turf": [
      "Zona de Combate Sul",
      "Pátios de Demolição de Arroyo",
      "Armazéns Abandonados"
    ],
    "threatLevel": "Alto",
    "identifiers": "Macacões de operário manchados de óleo e sangue com placas de ferro rebitadas; capacetes de solda com grades de ferro; marretas industriais no ombro.",
    "activities": [
      "Demolição criminosa de edifícios ocupados",
      "Esmagamento de veículos com compactadores industriais",
      "Rixas sangrentas com clãs rivais"
    ],
    "description": "Gangue de bárbaros urbanos obcecados por máquinas pesadas de demolição, marretas pneumáticas e destruição de estruturas de concreto.",
    "philosophy": "Se foi construído pelo homem, pode ser quebrado em pedregulhos pela nossa marreta.",
    "typicalGear": [
      "Marreta Pneumática Industrial",
      "Braço Cibernético Hidráulico Reforçado",
      "Óculos de Proteção contra Estilhaços"
    ],
    "signatureWeapons": [
      "Marreta Pesada de Duas Mãos 4d6",
      "Lança-Granadas de Demolição 6d6",
      "Espingarda de Cano Serrado 5d6"
    ],
    "tactics": "Derrubam paredes e pilares de sustentação para soterrar oponentes antes de esmagar sobreviventes com martelos industriais.",
    "citation": "Night City Gang Guide p. 81 • Maximum Metal",
    "logoFilename": "Kill Krashers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 40,
          "lieutenant": 55,
          "miniboss": 70,
          "boss": 90
        },
        "spHead": 11,
        "spBody": 13,
        "baseSkills": [
          "Brawling 15",
          "Demolitions 14",
          "Melee Weapon 14",
          "Shotgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          9,
          12
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -4,
        "spHead": 14,
        "spTorso": 18,
        "spLimbs": 12
      }
    }
  },
  {
    "id": "lightning-cats",
    "name": "Lightning Cats",
    "category": "Street/Territorial",
    "leader": "Flash / Kitty Neon",
    "turf": [
      "Kabuki",
      "Beco dos Sintetizadores",
      "Telhados de Little China"
    ],
    "threatLevel": "Médio",
    "identifiers": "Jaquetas de couro sintético roxas e amarelas com relâmpagos fluorescentes; patins a jato ou tênis com propulsores pneumáticos; orelhas de gato cibernéticas.",
    "activities": [
      "Roubo relâmpago de cargas em movimento",
      "Acrobacias aéreas ilegais entre prédios",
      "Venda de peças eletrônicas contrabandeadas"
    ],
    "description": "Gangue ágil especializada em furtos em alta velocidade nos labirintos verticais de Kabuki, desaparecendo nos dutos de ar e passarelas elevadas.",
    "philosophy": "O raio cai duas vezes sim — e leva sua carteira na segunda.",
    "typicalGear": [
      "Patins a Jato Motorizados",
      "Ganchos de Escalada Pneumáticos",
      "Lentes de Visão Noturna"
    ],
    "signatureWeapons": [
      "Pistola Pesada com Mira Laser 3d6",
      "Bolas de Choque Elétrico 2d6",
      "Garras Retráteis de Pulso 2d6"
    ],
    "tactics": "Atacam em disparada descendo cabos de energia, disparando tasers de alta voltagem e saltando de volta para a escuridão dos telhados.",
    "citation": "Night City Gang Guide p. 85 • Interface RED",
    "logoFilename": "Lightning Cats Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Athletics 16",
          "Evasion 15",
          "Handgun 13",
          "Stealth 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 10,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "mudang-gumi",
    "name": "Mudang Gumi",
    "category": "Cult",
    "leader": "Xamã Park Eun-ji / A Dama dos Sete Espíritos",
    "turf": [
      "Beco dos Templos em Japantown",
      "Subterrâneos de Little China",
      "Santuários Clandestinos"
    ],
    "threatLevel": "Alto",
    "identifiers": "Vestes rituais coreanas de seda multicolorida (hanbok modificado com kevlar); sinos de bronze e tiras de papel com encantamentos digitais amarradas nos pulsos.",
    "activities": [
      "Exorcismos cibernéticos de ciberpsicopatas",
      "Adivinhação de dados baseada em ruído quântico da NET",
      "Proteção espiritual armada de comerciantes coreanos"
    ],
    "description": "Culto xamânico cibernético de netrunners e místicos que veneram as IAs antigas como deuses ancestrais coreanos e praticam rituais de transe digital.",
    "philosophy": "O silício é o novo osso dos antepassados; as IAs são os espíritos que guiam nosso destino.",
    "typicalGear": [
      "Cyberdeck Camuflado em Sino Cerimonial",
      "Espelhos Hexagonais de Refração a Laser",
      "Incenso Purificador"
    ],
    "signatureWeapons": [
      "Adaga Ritual Monofilamentar 3d6",
      "Submetralhadora Disfarçada nas Mangas 3d6",
      "Programas de Ataque Mental Neural"
    ],
    "tactics": "Entoam mantras em transe enquanto desferem ataques de sobrecarga sináptica e golpes cirúrgicos com adagas nos pontos de pressão.",
    "citation": "Pacific Rim Sourcebook p. 104 • CP:R Homebrew Compendium",
    "logoFilename": "Mudang Gumi Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Interface 14",
          "Melee Weapon 14",
          "Conceal/Reveal 14",
          "Concentration 15"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "muses",
    "name": "The Muses",
    "category": "Poser",
    "leader": "Calliope / Terpsichore",
    "turf": [
      "Galerias de Arte de Westbrook",
      "Distrito da Moda em City Center",
      "Hotéis de Luxo"
    ],
    "threatLevel": "Baixo",
    "identifiers": "Túnicas gregas translúcidas de fibra holográfica; coroas de louros dourados com transmissores de micro-ondas; rostos esculpidos com proporção áurea divina.",
    "activities": [
      "Roubo requintado de obras de arte e biochips protótipos",
      "Chantagem estética de estilistas corporativos",
      "Vandalismo artístico de monumentos"
    ],
    "description": "Posergangue de modelos biomodificados obcecados pela beleza clássica greco-romana e pela criação de escândalos culturais que chocam a elite.",
    "philosophy": "A beleza é a única verdade inquestionável; tudo que é feio merece ser destruído.",
    "typicalGear": [
      "Projetores Holográficos Pessoais",
      "Cosméticos Nanotecnológicos",
      "Joias com Câmeras Espiãs"
    ],
    "signatureWeapons": [
      "Pistola Pesada com Acabamento em Mármore 3d6",
      "Lira Musical com Cordas Monofilamentares Cortantes 3d6",
      "Gás Sedativo 2d6"
    ],
    "tactics": "Criam ilusões holográficas deslumbrantes que paralisam testemunhas enquanto executam assaltos com elegância impecável.",
    "citation": "Chromebook 2 • Posergang Archives",
    "logoFilename": "Muses Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 10,
          "lieutenant": 12,
          "miniboss": 14,
          "boss": 16
        },
        "hp": {
          "mook": 25,
          "lieutenant": 35,
          "miniboss": 50,
          "boss": 65
        },
        "spHead": 4,
        "spBody": 7,
        "baseSkills": [
          "Wardrobe & Style 16",
          "Handgun 12",
          "Persuasion 15",
          "Evasion 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -2,
        "spHead": 4,
        "spTorso": 8,
        "spLimbs": 4
      }
    }
  },
  {
    "id": "primetime-players",
    "name": "PrimeTimePlayers",
    "category": "Poser",
    "leader": "Johnny Carson Clone / O Produtor Executivo",
    "turf": [
      "Estúdios de TV Abandonados",
      "Centro Comercial de Japantown",
      "Bairros de Entretenimento"
    ],
    "threatLevel": "Baixo",
    "identifiers": "Ternos de apresentador de talk show dos anos 70 em cores berrantes; microfones falsos que guardam tasers; risadas falsas gravadas disparadas por alto-falantes de ombro.",
    "activities": [
      "Sequestros transmitidos ao vivo como reality shows de sangue",
      "Assaltos com contagem regressiva comercial",
      "Chantagem de atores de braindance"
    ],
    "description": "Gangue de temática televisiva que trata suas ondas de crimes como temporadas de uma série de TV que precisa manter os índices de audiência no topo a todo custo.",
    "philosophy": "Se não deu audiência no horário nobre, não aconteceu.",
    "typicalGear": [
      "Câmeras Voadoras de Braindance",
      "Alto-falantes de Claque com Risadas",
      "Fichas de Roteiro Plastificadas"
    ],
    "signatureWeapons": [
      "Pistola Pesada 3d6",
      "Microfone de Choque de Alta Voltagem 2d6",
      "Submetralhadora Oculta na Câmera 3d6"
    ],
    "tactics": "Atuam como repórteres fazendo uma entrevista ao vivo antes de sacar armas de choque e amarrar os alvos na frente das câmeras.",
    "citation": "Night City Gang Guide p. 89 • CP2020 Sourcebook",
    "logoFilename": "PrimeTimePlayers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 10,
          "lieutenant": 12,
          "miniboss": 14,
          "boss": 16
        },
        "hp": {
          "mook": 25,
          "lieutenant": 35,
          "miniboss": 50,
          "boss": 65
        },
        "spHead": 4,
        "spBody": 7,
        "baseSkills": [
          "Acting 15",
          "Bribery 14",
          "Handgun 12",
          "Streetwise 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          7,
          8
        ],
        "btm": -2,
        "spHead": 4,
        "spTorso": 8,
        "spLimbs": 4
      }
    }
  },
  {
    "id": "princesses-of-justice",
    "name": "Princesses of Justice",
    "category": "Street/Territorial",
    "leader": "Princesa Sakura / Starlight",
    "turf": [
      "Kabuki",
      "Arcades de Little China",
      "Shopping Centers Subterrâneos"
    ],
    "threatLevel": "Médio",
    "identifiers": "Saias plissadas com estampas holográficas mágicas inspiradas em heroínas de anime; cabelos rosa e turquesa em marias-chiquinhas enormes; varinhas que disparam lasers de verdade.",
    "activities": [
      "Vigilantismo feroz contra agressores sexuais e predadores de rua",
      "Proteção de adolescentes em situação de rua",
      "Assalto a clínicas de Ripperdocs que exploram garotas"
    ],
    "description": "Gangue de garotas justiceiras ferozes que adotaram a estética de animes de garotas mágicas para esconder um arsenal militar pesado e impiedoso.",
    "philosophy": "Em nome da justiça cósmica e da fúria das ruas, nós vamos punir quem machucar os inocentes.",
    "typicalGear": [
      "Varinhas Mágicas com Projetores Laser Militares",
      "Lentes de Contato com Mira Inteligente Rosa",
      "Botas com Amortecedores Pneumáticos"
    ],
    "signatureWeapons": [
      "Varinha Laser Smartgun 4d6",
      "Fuzil de Assalto Rosa Choque 5d6",
      "Pistola Muito Pesada 4d6"
    ],
    "tactics": "Posam em sincronia antes de abrir fogo fulminante com fuzis camuflados em estojos escolares brilhantes.",
    "citation": "Night City Gang Guide p. 93 • Interface RED Vol. 2",
    "logoFilename": "Princesses of Justice Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Shoulder Arms 14",
          "Handgun 14",
          "Evasion 14",
          "Athletics 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "rat-kings",
    "name": "Rat Kings",
    "category": "Street/Territorial",
    "leader": "O Grande Roedor / Splinter Vermelho",
    "turf": [
      "Túneis do Antigo Metrô Abandonado",
      "Galerias Subterrâneas de City Center",
      "Lixão Central"
    ],
    "threatLevel": "Médio",
    "identifiers": "Capotes rasgados com dezenas de bolsos secretos; caudas mecânicas articuladas nas costas; respiradores enferrujados presos no pescoço.",
    "activities": [
      "Saques na sucata eletrônica do submundo",
      "Espionagem em cabos subterrâneos de fibra ótica",
      "Guia clandestino pelas galerias secretas sob a cidade"
    ],
    "description": "Comunidade subterrânea de sem-teto cibernéticos que conhece cada centímetro da rede de esgotos, túneis de serviço e cabos enterrados de Night City.",
    "philosophy": "Night City cospe sua sujeira para baixo; nós construímos nosso reino sobre o lixo que vocês descartam.",
    "typicalGear": [
      "Ratos Cibernéticos Espiões com Transmissor de Vídeo",
      "Pés de Cabra e Cortadores Hidráulicos",
      "Óculos de Visão Noturna Cat's Eye"
    ],
    "signatureWeapons": [
      "Besta Pneumática Silenciosa 3d6",
      "Pistola Pesada 3d6",
      "Faca de Trincheira Enferrujada 2d6"
    ],
    "tactics": "Emergem de tampas de bueiro atrás das costas do inimigo, cravam dardos e puxam a vítima para o escuro das galerias.",
    "citation": "Night City Gang Guide p. 97 • Underground Night City",
    "logoFilename": "Rat Kings Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 40,
          "miniboss": 55,
          "boss": 70
        },
        "spHead": 7,
        "spBody": 7,
        "baseSkills": [
          "Stealth 16",
          "Conceal/Reveal 15",
          "Handgun 12",
          "Electronics/Security 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -2,
        "spHead": 6,
        "spTorso": 8,
        "spLimbs": 6
      }
    }
  },
  {
    "id": "reckoners",
    "name": "Reckoners",
    "category": "Cult",
    "leader": "Profeta Mordecai / O Juiz de Sangue",
    "turf": [
      "Zonas de Combate",
      "Encruzilhadas Desoladas de Santo Domingo",
      "Ruínas do Holocausto Nuclear"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Túnicas vermelhas esfarrapadas manchadas de fuligem; placas de contagem regressiva amarradas ao peito marcando o fim do mundo; cicatrizes de autoflagelação.",
    "activities": [
      "Cobrança do \"Imposto do Apocalipse\" de viajantes",
      "Homem-bomba e atentados suicidas contra corporações",
      "Destruição de bancos de dados com vírus térmicos"
    ],
    "description": "Culto apocalíptico do Tempo do Vermelho que acredita que a 4ª Guerra foi o prelúdio do Juízo Final e que é dever sagrado deles acelerar a extinção da humanidade.",
    "philosophy": "O Tempo do Vermelho não é uma era passageira; é o fogo que limpará a podridão da Terra.",
    "typicalGear": [
      "Coletes de Dinamite e C4 com Detonador no Polegar",
      "Ampulhetas de Sangue Sintético",
      "Bíblia Apócrifa Escrita em Papel Carbono"
    ],
    "signatureWeapons": [
      "Espingarda Pesada 5d6",
      "Cinturão de Granadas Suicida 8d6",
      "Lâmina Longa de Sacrifício 3d6"
    ],
    "tactics": "Avançam sem hesitação gritando profecias do fim do mundo, ignorando ferimentos até ativarem explosivos plásticos colados ao corpo.",
    "citation": "Cyberpunk RED Corebook p. 310 • Faith & Fire Suplemento",
    "logoFilename": "Reckoners Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Demolitions 16",
          "Resist Torture/Drugs 16",
          "Shotgun 13",
          "Brawling 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          10
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "shroomers",
    "name": "Shroomers",
    "category": "Party",
    "leader": "Dr. Spore / Mycella",
    "turf": [
      "Túneis Úmidos de Pacifica",
      "Estufas Clandestinas em Heywood",
      "Porões de Watson"
    ],
    "threatLevel": "Baixo",
    "identifiers": "Boinas em formato de cogumelos com pontos vermelhos e brancos; roupas tingidas com extratos botânicos; dedos manchados de fungos luminosos.",
    "activities": [
      "Cultivo de cogumelos geneticamente modificados de alta potência",
      "Tráfico de esporos alucinógenos terapêuticos e recreativos",
      "Cura alternativa para veteranos traumatizados"
    ],
    "description": "Químicos botânicos e traficantes que desenvolveram cepas de fungos adaptadas à radiação e poluição de Night City, oferecendo viagens psicodélicas intensas.",
    "philosophy": "A mente humana precisa se conectar ao micélio invisível que une todas as almas da cidade.",
    "typicalGear": [
      "Frascos Herméticos com Esporos Fluorescentes",
      "Respiradores com Filtros de Esporos",
      "Luzes de Cultivo UV Portáteis"
    ],
    "signatureWeapons": [
      "Pistola Pesada 3d6",
      "Espargidor de Esporos Alucinógenos (Paralisia / Confusão)",
      "Adaga de Colheita Curva 2d6"
    ],
    "tactics": "Liberam nuvens de esporos que causam alucinações violentas nos inimigos, permitindo que escapem rindo pelos dutos.",
    "citation": "Night City Gang Guide p. 101 • Street Drugs Compendium",
    "logoFilename": "Shroomers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 10,
          "lieutenant": 12,
          "miniboss": 14,
          "boss": 16
        },
        "hp": {
          "mook": 25,
          "lieutenant": 35,
          "miniboss": 50,
          "boss": 65
        },
        "spHead": 4,
        "spBody": 7,
        "baseSkills": [
          "Science (Chemistry) 15",
          "Handgun 12",
          "First Aid 14",
          "Streetwise 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          5,
          7
        ],
        "refRange": [
          7,
          8
        ],
        "btm": -2,
        "spHead": 4,
        "spTorso": 8,
        "spLimbs": 4
      }
    }
  },
  {
    "id": "sinful-adams",
    "name": "Sinful Adams",
    "category": "Cult",
    "leader": "Adão Supremo / Mãe Eva Negra",
    "turf": [
      "Zona de Combate de Morro Bay",
      "Hospitais Psiquiátricos Abandonados",
      "Subterrâneos de Charter Hill"
    ],
    "threatLevel": "Alto",
    "identifiers": "Pele completamente tatuada com motivos anatômicos de órgãos expostos; enxertos exóticos como caudas pré-henséis e dentes de carnívoro; roupas mínimas de couro e correntes.",
    "activities": [
      "Rituais de carne e excesso hedonista",
      "Sequestro de cirurgiões plásticos para enxertos corporais aberrantes",
      "Batalhas de gladiadores de carne crua"
    ],
    "description": "Culto hedonista da modificação corporal extrema que rejeita a alma imortal e busca a transcensão exclusivamente através do prazer, da dor e da carne mutada.",
    "philosophy": "A carne é a única tela real; todo pecado é um traço sagrado na pele.",
    "typicalGear": [
      "Garras de Titânio Biológicas",
      "Estimuladores de Dor e Endorfina Subdérmicos",
      "Chicotes de Aço Trançado"
    ],
    "signatureWeapons": [
      "Chicote de Aço 3d6",
      "Lâminas Biológicas nos Dedos 2d6",
      "Pistola Muito Pesada 4d6"
    ],
    "tactics": "Atacam em fúria maníaca sob efeito de estimulantes neuroquímicos, sentindo prazer com os próprios ferimentos.",
    "citation": "Night City Gang Guide p. 105 • Cyberpunk Flesh & Metal",
    "logoFilename": "Sinful Adams Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 15",
          "Brawling 14",
          "Resist Torture/Drugs 16",
          "Handgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          10
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "street-queens",
    "name": "Street Queens",
    "category": "Street/Territorial",
    "leader": "Rainha Roxy / Bianca Diamond",
    "turf": [
      "Kabuki",
      "Beco dos Bordéis",
      "Avenida das Lanterna Vermelhas"
    ],
    "threatLevel": "Médio",
    "identifiers": "Perucas volumosas de neon, espartilhos blindados com fibra de carbono, botas de cano alto com salto agulha de aço temperado e maquiagem impecável à prova de água e sangue.",
    "activities": [
      "Segurança armada para profissionais do sexo",
      "Extorsão de agenciadores abusivos",
      "Controle da noite e boates em Kabuki"
    ],
    "description": "Irmandade armada formada por trabalhadoras sexuais e artistas de boates que se organizaram para proteger sua comunidade contra cafetões cruéis e clientes violentos.",
    "philosophy": "Nenhum cafetão vai nos dizer como viver, e nenhum cliente abusador vai sair andando daqui.",
    "typicalGear": [
      "Espartilho de Kevlar Reforçado 11 SP",
      "Gás de Pimenta Oculto no Batom",
      "Saltos Agulha de Aço com Lâmina"
    ],
    "signatureWeapons": [
      "Pistola Pesada Cromada 3d6",
      "Salto Alto com Lâmina de Estocada 2d6",
      "Submetralhadora Disfarçada na Bolsa 3d6"
    ],
    "tactics": "Fingem vulnerabilidade antes de sacar pistolas pesadas das botas ou perfurar artérias com os saltos afiados.",
    "citation": "Night City Gang Guide p. 109 • Street Voices",
    "logoFilename": "Street Queens Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Handgun 14",
          "Melee Weapon 13",
          "Persuasion 14",
          "Streetwise 15"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "toecutters",
    "name": "ToeCutters",
    "category": "Booster",
    "leader": "Bones / Serra Dentada",
    "turf": [
      "Zonas Industriais de Arroyo",
      "Desmanches de Automóveis",
      "Matadouros Abandonados"
    ],
    "threatLevel": "Alto",
    "identifiers": "Aventais de açougueiro sujos de sangue com placas de ferro rebitadas; alicates cirúrgicos pesados presos no cinto; dentes de metal moído.",
    "activities": [
      "Cobrança violenta de empréstimos ilegais",
      "Amputação de dedos e membros como garantia de dívidas",
      "Desmanche forçado de cibernéticos usados"
    ],
    "description": "Gangue implacável de torturadores e cobradores de dívidas a serviço de agiotas do submundo, conhecidos por cortar os dedos dos pés dos devedores.",
    "philosophy": "Se você não tem os Eddies, seu corpo paga a parcela em gramas de carne.",
    "typicalGear": [
      "Alicates Hidráulicos Corta-Vergalhão",
      "Serras de Osso Cirúrgicas",
      "Sacos de Gel Térmico"
    ],
    "signatureWeapons": [
      "Serra Elétrica Cirúrgica 4d6",
      "Pistola Muito Pesada 4d6",
      "Alicate Corta-Vergalhão 3d6"
    ],
    "tactics": "Cercam o alvo com veículos pesados, imobilizam os membros com correntes e executam mutilações com ferramentas elétricas.",
    "citation": "Night City Gang Guide p. 113 • CP:R Bestiary",
    "logoFilename": "ToeCutters Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 14",
          "Intimidation 15",
          "Brawling 14",
          "Handgun 12"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          10
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "tombstone-preservers",
    "name": "Tombstone Preservers",
    "category": "Cult",
    "leader": "O Guardião das Cinzas / Irmão Mortis",
    "turf": [
      "Cemitério de Night City",
      "Crematórios de North Oak periferia",
      "Mausoléus"
    ],
    "threatLevel": "Médio",
    "identifiers": "Casacos longos pretos com cinzas de crematório espalhadas nos ombros; máscaras funerárias de chumbo; anéis com pedras de ônix funerário.",
    "activities": [
      "Defesa fanática dos túmulos e criptas contra ladrões de corpos",
      "Pilhagem de ouro e implantes de cadáveres nobres",
      "Cerimônias fúnebres ilegais para mercenários"
    ],
    "description": "Irmandade macabra que governa o cemitério de Night City, oferecendo descanso eterno com proteção armada contra ripperdocs que desenterram corpos.",
    "philosophy": "Os mortos têm mais dignidade do que os vivos que poluem as ruas da cidade.",
    "typicalGear": [
      "Pás Balísticas Reforçadas",
      "Baldes de Cinzas Crematórias que Cegam",
      "Óculos Escuros Funerários"
    ],
    "signatureWeapons": [
      "Pá Afiada de Aço 3d6",
      "Espingarda de Chumbo Grosso 5d6",
      "Revólver Pesado .45 4d6"
    ],
    "tactics": "Atacam saindo de trás de lápides e mausoléus, jogando cinzas nos olhos dos invasores antes de desferir tiros de espingarda à queima-roupa.",
    "citation": "Night City Gang Guide p. 117 • CP2020 Tales from the Forlorn Hope",
    "logoFilename": "Tombstone Preservers Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Shotgun 13",
          "Melee Weapon 13",
          "Stealth 14",
          "First Aid 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "undertow",
    "name": "Undertow",
    "category": "Street/Territorial",
    "leader": "Capitão Hook / Maremoto Maria",
    "turf": [
      "Docas de Morro Rock",
      "Barcaças Flutuantes da Baía",
      "Píeres de Watson"
    ],
    "threatLevel": "Alto",
    "identifiers": "Tatuagens náuticas com âncoras e sereias cibernéticas; jaquetas de pescador amarelas manchadas de óleo combustível; pernas e braços biônicos reforçados com ligas marinhas anti-ferrugem.",
    "activities": [
      "Piratas fluviais atacando navios cargueiros",
      "Contrabando de armas e eletrônicos via baía",
      "Tráfico de peixes geneticamente modificados"
    ],
    "description": "Piratas urbanos implacáveis que dominam as águas da baía de Night City e os canais industriais, assaltando barcaças corporativas.",
    "philosophy": "Na água de Night City, não há leis corporativas — o que boia é nosso.",
    "typicalGear": [
      "Botes Infláveis Rápidos com Motores Silenciosos",
      "Arpéus Pneumáticos de Abordagem",
      "Sinalizadores Náuticos Incendiários"
    ],
    "signatureWeapons": [
      "Espingarda Pesada 5d6",
      "Lança-Arpão Náutico 4d6",
      "Facão de Bordo 3d6"
    ],
    "tactics": "Abordam embarcações em alta velocidade à noite, escalam o convés com arpéus e abrem caminho com fogo de espingarda pesada.",
    "citation": "Night City Gang Guide p. 121 • Firestorm Sourcebook",
    "logoFilename": "Undertow Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 11,
        "spBody": 11,
        "baseSkills": [
          "Athletics 14",
          "Shotgun 14",
          "Drive Sea Vehicle 15",
          "Melee Weapon 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          10
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -3,
        "spHead": 10,
        "spTorso": 14,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "wild-things",
    "name": "Wild Things",
    "category": "Booster",
    "leader": "O Alfa / Garra Vermelha",
    "turf": [
      "Zonas Florestais Abandonadas",
      "Combat Zone Norte",
      "Galpões Ferroviários"
    ],
    "threatLevel": "Alto",
    "identifiers": "Enxertos de presas caninas afiadas, orelhas felinas pontudas implantadas cirurgicamente, olhos com fenda vertical amarela brilhante e pelos corporais sintéticos densos.",
    "activities": [
      "Caçadas humanas como rito de passagem",
      "Assaltos lupinos a caminhões de carga",
      "Brigas clandestinas de feras nas arenas"
    ],
    "description": "Boostergangue animalesca e predatória que adotou biomodificações de feras selvagens, caçando em alcateias territoriais com instintos afiados.",
    "philosophy": "A civilização urbana é uma ilusão frágil; nós somos as feras famintas que vão devorá-la.",
    "typicalGear": [
      "Implantes de Garras Retráteis Wolvers",
      "Olhos Biônicos com Visão Noturna Térmica",
      "Rastreadores Olfativos Cibernéticos"
    ],
    "signatureWeapons": [
      "Garras Retráteis Wolvers 3d6",
      "Mordida com Presas de Titânio 2d6",
      "Submetralhadora Pesada 3d6"
    ],
    "tactics": "Rastreiam presas pelo cheiro, cercam em círculo em quatro patas e atacam a garganta com saltos acrobáticos violentos.",
    "citation": "Chromebook 3 • CP:R p. 308",
    "logoFilename": "Wild Things Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 35,
          "lieutenant": 50,
          "miniboss": 65,
          "boss": 80
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 15",
          "Brawling 15",
          "Athletics 15",
          "Tracking 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          11
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -4,
        "spHead": 10,
        "spTorso": 12,
        "spLimbs": 10
      }
    }
  },
  {
    "id": "willows",
    "name": "The Willows",
    "category": "Syndicate",
    "leader": "Madame Liu / A Rosa Negra",
    "turf": [
      "Hotéis de Luxo de City Center",
      "Casas de Chá de Charter Hill",
      "Clubes Privados"
    ],
    "threatLevel": "Alto",
    "identifiers": "Kimônos modernos de seda preta com folhas de salgueiro bordadas a fio de prata; leques com bordas de titânio afiadas; elegância aristocrática impecável.",
    "activities": [
      "Espionagem de quarto e chantagem de altos executivos",
      "Assassinatos discretos por envenenamento e estocada",
      "Gestão de salões de acompanhantes de alto luxo"
    ],
    "description": "Sindicato secreto de cortesãs assassinas e espiãs refinadas que manipulam executivos ingênuos e recolhem os segredos mais caros de Night City.",
    "philosophy": "O salgueiro se curva com o vento, mas chicoteia com força letal quem tentar quebrá-lo.",
    "typicalGear": [
      "Leques de Combate com Lâminas Ocultas",
      "Batom com Injetor de Neurotoxina",
      "Agentes Ocultos em Pingentes"
    ],
    "signatureWeapons": [
      "Leques Cortantes de Titânio 3d6",
      "Pistola Leve Suprimida 2d6",
      "Agulha Envenenada com Cianeto 2d6"
    ],
    "tactics": "Seduzem alvos isolados em suítes blindadas, neutralizam seguranças com bebidas adulteradas e golpeiam na carótida com seus leques afiados.",
    "citation": "Night City Gang Guide p. 125 • Cyberpunk High Society",
    "logoFilename": "Willows Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 12,
          "lieutenant": 14,
          "miniboss": 16,
          "boss": 18
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 15",
          "Persuasion 16",
          "Stealth 15",
          "Bribery 15"
        ]
      },
      "CP2020": {
        "bodyRange": [
          6,
          8
        ],
        "refRange": [
          9,
          11
        ],
        "btm": -2,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "yellow-brick-road",
    "name": "Yellow Brick Road",
    "category": "Poser",
    "leader": "Dorothy / O Espantalho Louco",
    "turf": [
      "Colinas Orientais de Santo Domingo",
      "Ruas de Paralelepípedo Pintadas de Amarelo",
      "Ferro-Velho"
    ],
    "threatLevel": "Médio",
    "identifiers": "Roupas de personagens do Mágico de Oz: homens de lata com latarias soldadas, espantalhos com palha saindo das mangas e Dorothys com sapatos de rubi reluzentes.",
    "activities": [
      "Pintura forçada de ruas com tinta amarela tóxica",
      "Assaltos cantando músicas infantis dementes",
      "Sequestro de cachorros cibernéticos para serem seus \"Totos\""
    ],
    "description": "Posergangue insana que recriou a fantasia do Mágico de Oz em meio ao cenário pós-apocalíptico das periferias industriais.",
    "philosophy": "Siga a estrada dos tijolos amarelos — ou nós arrancamos seu coração para dar ao Homem de Lata.",
    "typicalGear": [
      "Sapatos de Rubi com Biqueira de Titânio",
      "Machados de Lenhador do Homem de Lata",
      "Tinta Amarela Fosforescente Tóxica"
    ],
    "signatureWeapons": [
      "Machado de Duas Mãos 4d6",
      "Espingarda de Repetição 5d6",
      "Pistola Pesada 3d6"
    ],
    "tactics": "Marcham de braços dados cantando antes de dispersarem em velocidade para abater alvos com golpes de machado e tiros de chumbo grosso.",
    "citation": "Night City Gang Guide p. 129 • Posergang Compendium",
    "logoFilename": "Yellow Brick Road Gang.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 11,
          "lieutenant": 13,
          "miniboss": 15,
          "boss": 17
        },
        "hp": {
          "mook": 30,
          "lieutenant": 45,
          "miniboss": 60,
          "boss": 75
        },
        "spHead": 7,
        "spBody": 11,
        "baseSkills": [
          "Melee Weapon 14",
          "Acting 14",
          "Shotgun 13",
          "Brawling 13"
        ]
      },
      "CP2020": {
        "bodyRange": [
          7,
          9
        ],
        "refRange": [
          7,
          9
        ],
        "btm": -3,
        "spHead": 8,
        "spTorso": 12,
        "spLimbs": 8
      }
    }
  },
  {
    "id": "zoners",
    "name": "Zoners",
    "category": "Combat/PMC",
    "leader": "Warlord Vance / Capitão Rex",
    "turf": [
      "Zona de Combate Central",
      "Prédios Fortificados de Pacifica",
      "Perímetros Murados"
    ],
    "threatLevel": "Extremo",
    "identifiers": "Armaduras pesadas montadas com placas balísticas de carros destruídos; máscaras de gás com filtros duplos; fuzis amarrados com fita adesiva e arame.",
    "activities": [
      "Defesa armada impiedosa do perímetro das Zonas de Combate",
      "Cobrança de pedágio em qualquer entrada ou saída",
      "Guerra de extermínio contra policiais invasores"
    ],
    "description": "Sobreviventes calejados e veteranos de guerrilha urbana que transformaram as Zonas de Combate em verdadeiras fortalezas autônomas impenetráveis.",
    "philosophy": "Atrás desse muro, a lei corporativa está morta; quem entra sem pagar vira adubo de asfalto.",
    "typicalGear": [
      "Máscara de Gás Nível Militar",
      "Placas Balísticas de Sucata Reforçada 13 SP",
      "Rádios de Campanha Blindados"
    ],
    "signatureWeapons": [
      "Fuzil de Assalto Personalizado 5d6",
      "Lança-Granadas de Tambor 6d6",
      "Machete Pesado 3d6"
    ],
    "tactics": "Atraem patrulhas e corporativos para campos minados urbanos com fogo cruzado de metralhadoras pesadas a partir de janelas fortificadas.",
    "citation": "Night City Gang Guide p. 133 • CP:R Combat Zone Rules",
    "logoFilename": "Zoners Logo.png",
    "statsTemplate": {
      "RED": {
        "combatNumber": {
          "mook": 13,
          "lieutenant": 15,
          "miniboss": 17,
          "boss": 19
        },
        "hp": {
          "mook": 40,
          "lieutenant": 55,
          "miniboss": 70,
          "boss": 90
        },
        "spHead": 13,
        "spBody": 13,
        "baseSkills": [
          "Shoulder Arms 15",
          "Heavy Weapons 14",
          "Demolitions 14",
          "Tactics 14"
        ]
      },
      "CP2020": {
        "bodyRange": [
          8,
          11
        ],
        "refRange": [
          8,
          10
        ],
        "btm": -4,
        "spHead": 14,
        "spTorso": 18,
        "spLimbs": 14
      }
    }
  }
];
