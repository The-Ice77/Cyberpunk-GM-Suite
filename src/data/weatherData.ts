import { WeatherCondition } from '../types/system';

export interface WeatherSensoryDetails {
  visual: string;
  scentAndAir: string;
  soundscape: string;
  streetLife: string;
}

export interface WeatherRollEntry {
  d6: number;
  temperature: string;
  condition: string;
  narrativeDescription: string;
  sensoryAtmosphere: WeatherSensoryDetails;
  boxedNarration: string;
  tacticalEffects: string;
  recommendedGear: string[];
}

export interface WeatherSeasonTable {
  season: string;
  months: string;
  rolls: WeatherRollEntry[];
}

export const seasonalWeatherTables: WeatherSeasonTable[] = [
  {
    season: 'Inverno (Winter)',
    months: 'Dezembro a Fevereiro',
    rolls: [
      {
        d6: 1,
        temperature: 'Frio extremo (~2°C / 35°F)',
        condition: 'Céu Limpo com Névoa Tóxica',
        narrativeDescription: 'O ar é gelado e cortante como vidro moído. O céu parece estranhamente límpido e azul-metálico nas altitudes, mas ao nível da rua uma névoa rasteira pesada com gases de enxofre e exaustão industrial se acumula nos becos, fazendo os olhos lacrimejarem.',
        sensoryAtmosphere: {
          visual: 'Luz solar pálida filtrada por um filtro amarelo-esverdeado ao rés do chão; neons de lojas tremulam e cortam a bruma rasteira como lâminas de bisturi.',
          scentAndAir: 'Cheiro pungente de gás de combustão e enxofre mineral; sensação de queimação nas fossas nasais a cada respiração funda sem máscara.',
          soundscape: 'Som seco e metálico de passos no concreto gelado; estalos de tubulações de vapor expostas tentando aquecer cortiços superlotados.',
          streetLife: 'População encasacada com sobretudos sintéticos forrados e golas levantadas; mendigos se aglomeram ao redor de tambores de óleo em chamas sob viadutos.',
        },
        boxedNarration: 'O ar do inverno de Night City corta o rosto como uma lâmina de monofilamento. Acima dos prédios, o céu exibe um azul estéril e desbotado, mas aqui embaixo as ruas estão afogadas em uma névoa rasteira amarelada que queima as narinas com o ranço de exaustão industrial e solventes petroquímicos.',
        tacticalEffects: 'Sem proteção térmica, teste de Resist Torture/Drugs após 4 horas de exposição. A névoa ao nível do chão concede Cobertura Leve (-1 em ataques de armas de longo alcance a mais de 20 metros).',
        recommendedGear: ['Sobretudo Pesado Forrado', 'Filtro Nasal Químico', 'Luvas Térmicas Reforçadas'],
      },
      {
        d6: 2,
        temperature: 'Frio (~4°C / 40°F)',
        condition: 'Chuva Leve / Chuva com Neve Ácida',
        narrativeDescription: 'Gotículas de água congelante misturadas com flocos de fuligem ácida cinzenta caem lentamente sobre o asfalto. A lama química resultante forma poças escorregadias que corroem solados de borracha e mancham roupas claras.',
        sensoryAtmosphere: {
          visual: 'Flocos cinzentos e imundos derretendo instantaneamente no contato com o asfalto úmido; reflexos distorcidos de hologramas piscando em poças gordurosas.',
          scentAndAir: 'Odor de cinza molhada misturado a solvente e gordura sintética frita de barraquinhas ambulantes.',
          soundscape: 'Gotejamento persistente em marquises de metal ondulado; o silvo constante de carros e motos com pneus derrapando no asfalto liso.',
          streetLife: 'Vendedores ambulantes oferecem guarda-chuvas descartáveis de plástico barato a 10eb que desmancham na terceira rajada de vento.',
        },
        boxedNarration: 'Não é neve de verdade — é lama congelada e ácido diluído caindo do céu em flocos cinzentos que derretem no instante em que tocam sua jaqueta. A cidade tem a temperatura de um necrotério e o cheiro de um depósito de pneus em chamas após a chuva.',
        tacticalEffects: 'Piso escorregadio: testes de Condução e Atletismo em alta velocidade sofrem penalidade de -1. Queda contínua de água impõe -1 em testes de Percepção visual.',
        recommendedGear: ['Capa de Chuva Sintética Impermeável', 'Botas com Solado Antiderrapante', 'Guarda-chuva Reforçado'],
      },
      {
        d6: 3,
        temperature: 'Frio (~4°C / 40°F)',
        condition: 'Nublado com Smog Industrial',
        narrativeDescription: 'Uma abóbada impenetrável de nuvens escuras de chumbo bloqueia completamente o sol. A fumaça das refinarias e fábricas de Santo Domingo e Watson paira sobre a cidade sem dispersar, retendo o frio e sufocando a metrópole.',
        sensoryAtmosphere: {
          visual: 'Crepúsculo artificial mesmo ao meio-dia; a linha do horizonte entre o mar e os arranha-céus desaparece numa muralha acinzentada.',
          scentAndAir: 'Gosto metálico persistente na boca; cheiro de metal queimado, fuligem diesel e ar espesso como óleo mineral.',
          soundscape: 'Eco grave e abafado das buzinas e turbinas de AVs voando em altitude baixa para evitar os bolsões de turbulência.',
          streetLife: 'Tráfego lento e constante; policiais e gangers mantêm as mãos dentro dos bolsos dos coletes balísticos para não congelar os dedos no gatilho.',
        },
        boxedNarration: 'O meio-dia em Night City parece mais uma meia-noite suja. Nuvens de chumbo e fumaça petroquímica selam a cidade sob uma tampa impenetrável, mantendo o frio trancado nas calçadas e transformando as luzes de neon na única bússola confiável.',
        tacticalEffects: 'Iluminação baixa natural permanente mesmo durante o dia (penalidade de -1 para atiradores sem Visão Noturna ou Mira Térmica a mais de 30m).',
        recommendedGear: ['Máscara Anti-Smog Filtrante', 'Ciberolhos com Baixa Luminosidade', 'Gola Balística Corta-Vento'],
      },
      {
        d6: 4,
        temperature: 'Fresco (~10°C / 50°F)',
        condition: 'Nublado e Ventoso',
        narrativeDescription: 'Rajadas violentas de vento canalizadas pelos corredores de concreto e vidro dos megaprédios uivam a mais de 60 km/h, arremessando jornais velhos, copos plásticos e folhas de lona pelas avenidas.',
        sensoryAtmosphere: {
          visual: 'Letreiros de neon soltos balançando ruidosamente nos suportes de ferro; turbilhões de poeira e detritos rodopiando nos cruzamentos.',
          scentAndAir: 'Ar fresco com rajadas repentinas de pó e partículas secas de entulho dos Badlands.',
          soundscape: 'Uivo cortante do vento através das frestas arquitetônicas; portas de metal batendo nos becos desertos.',
          streetLife: 'Pedestres andam inclinados contra a força do vento; motociclistas reduzem drasticamente a velocidade para não serem jogados nas pistas vizinhas.',
        },
        boxedNarration: 'Night City se transforma em um túnel de vento de escala ciclópica. As rajadas descem pelas fachadas espelhadas das megacorporações em City Center como torrentes invisíveis, fazendo letreiros de neon gemerem e sacos de lixo voarem como morcegos de plástico.',
        tacticalEffects: 'Vento forte: disparos com armas de arremesso (facas, shurikens, granadas) sofrem -2 na jogada de ataque. Disparos com armas de fogo além de 25 metros sofrem -1.',
        recommendedGear: ['Óculos de Proteção Balística Selados', 'Casaco de Vento Reforçado', 'Grampos de Fixação em Cinto'],
      },
      {
        d6: 5,
        temperature: 'Fresco (~10°C / 50°F)',
        condition: 'Chuva Forte com Granizo Ácido',
        narrativeDescription: 'Pedras translúcidas de gelo ácido do tamanho de bolinhas de gude despencam dos céus, estalando contra vidraças e perfurando capotas de tecido. A chuva ácida que as acompanha é implacável e ferve levemente ao atingir metais aquecidos.',
        sensoryAtmosphere: {
          visual: 'Estilhaços de gelo amarelo estourando nas calçadas; vapor subindo das carcaças de carros quentes como caldeirões.',
          scentAndAir: 'Odor cáustico intenso de vinagre industrial e cloro que irrita os pulmões instantaneamente.',
          soundscape: 'Ruído ensurdecedor de metralhadora natural: milhares de pedras de gelo martelando o asfalto, latarias e telhados de zinco.',
          streetLife: 'Desespero nas ruas: pedestres correm aos tropeços para dentro de estações do metrô, portas de lojas e becos cobertos com mochilas sobre a cabeça.',
        },
        boxedNarration: 'O céu despenca com ódio mineral. Pedras pontiagudas de gelo ácido explodem contra o asfalto estalando como tiros de calibre .22, corroendo o verniz dos carros e forçando qualquer alma viva a mergulhar para debaixo da marquise mais próxima antes que o couro da jaqueta comece a chiar.',
        tacticalEffects: 'Ablação de armadura: -1 SP de Cabeça e Corpo a cada 10 minutos exposto sem abrigo rígido. Visibilidade severamente reduzida (-2 em Percepção e ataques à distância).',
        recommendedGear: ['Capacete Rígido Balístico', 'Escudo Balístico Móvel', 'Guarda-chuva Tático Reforçado'],
      },
      {
        d6: 6,
        temperature: 'Ameno (~15°C / 60°F)',
        condition: 'Clima Estranho (Rolar Tabela de Anomalias)',
        narrativeDescription: 'O barômetro desce em queda livre. A atmosfera adquire uma coloração bizarra arroxeada ou cobre opaco. Fenômenos climáticos violentos provocados pelas cicatrizes da 4ª Guerra e da Hot Zone se manifestam na baía.',
        sensoryAtmosphere: {
          visual: 'Céu tingido em tons radioativos de magenta e âmbar; faíscas elétricas de estática estalam entre cabos de alta tensão.',
          scentAndAir: 'Gosto metálico de cobre e ozônio ionizado; pelos dos braços e nuca se arrepiam com a eletricidade estática.',
          soundscape: 'Um silêncio tenso e opressivo seguido por trovões distantes e sirenes de alerta civil da defesa civil de Night City.',
          streetLife: 'Transeuntes olham para o céu com medo visceral; lojas descem portas de aço reforçadas e gangers recolhem as patrulhas.',
        },
        boxedNarration: 'Os sensores do seu Agent começam a emitir um bipe rítmico de advertência meteorológica. O céu sobre Night City adquire um tom cobre-doentio, e a estática no ar faz os implantes zumbirem na nuca. Algo muito errado está sendo empurrado pelo vento da baía.',
        tacticalEffects: 'Rolar imediatamente na Tabela de Anomalias Climáticas Estranhas (1d10) para determinar o perigo letal que assola o setor.',
        recommendedGear: ['Traje de Proteção NBC / Traje de Risco', 'Filtros Nasais Nível Militar', 'Rádio de Frequência de Emergência'],
      },
    ],
  },
  {
    season: 'Primavera (Spring)',
    months: 'Março a Maio',
    rolls: [
      {
        d6: 1,
        temperature: 'Frio (~4°C / 40°F)',
        condition: 'Céu Limpo',
        narrativeDescription: 'O vento frio sopra do Pacífico afastando o grosso da fumaça para os Badlands. A luz do sol da manhã bate com nitidez brutal nas superfícies espelhadas dos arranha-céus, revelando cada rachadura e pichação nas paredes da cidade.',
        sensoryAtmosphere: {
          visual: 'Brilho ofuscante do sol refratando em cromo polido e vidro; sombras nítidas e compridas desenhadas no asfalto limpo.',
          scentAndAir: 'Ar fresco com leve brisa marítima salgada, ainda com notas sutis de diesel distante.',
          soundscape: 'Burburinho animado dos mercados de rua da manhã; música sintetizada ecoando das barracas de comida.',
          streetLife: 'Ruas cheias de nômades, executivos apressados e vendedores ambulantes; sensação passageira de normalidade urbana.',
        },
        boxedNarration: 'Em manhãs raras como esta, Night City quase consegue mentir para você. O vento da baía limpou o smog e o sol bate direto nos painéis solares dos megaprédios. O ar é frio e limpo o suficiente para respirar fundo sem engasgar, mas a ilusão dura apenas até você dobrar a primeira esquina suja.',
        tacticalEffects: 'Condições visuais ideais. Sem penalidades de terreno ou visibilidade. Ataques de franco-atiradores operam com precisão máxima.',
        recommendedGear: ['Óculos Escuros Estilosos com Proteção UV', 'Jaqueta Leve de Couro', 'Roupas Casuais de Rua'],
      },
      {
        d6: 2,
        temperature: 'Fresco (~10°C / 50°F)',
        condition: 'Chuva Leve Intermitente',
        narrativeDescription: 'Uma garoa fina e preguiçosa cai em intervalos regulares ao longo do dia, mantendo o asfalto escuro e brilhante como ônix. As poças d’água capturam os reflexos dos letreiros luminosos em vermelho, azul e ciano.',
        sensoryAtmosphere: {
          visual: 'Cenário clássico de filme noir cyberpunk: asfalto molhado espelhando neons, gotas escorrendo em óculos e visores ópticos.',
          scentAndAir: 'Petrichor sintético: o cheiro de chuva fresca misturado com o calor das calçadas de concreto e asfalto recém-lavados.',
          soundscape: 'O ruído suave e relaxante da garoa pontuado pelo som de limpadores de para-brisa elétricos batendo em ritmo cadenciado.',
          streetLife: 'Transeuntes usam capuzes e guarda-chuvas transparentes de fibra; táxis da Combat Cab e Delamain circulam com luzes amarelas acesas.',
        },
        boxedNarration: 'A cidade parece saída de uma transmissão clássica de braindance noir. Uma garoa leve molha o concreto, transformando o asfalto em um espelho líquido que multiplica os neons dos bares e farmácias clandestinas a cada passo que você dá.',
        tacticalEffects: 'Superfícies úmidas impõem -1 em testes de Escalar superfícies lisas. Sem penalidade em disparos de armas de fogo.',
        recommendedGear: ['Casaco Impermeável com Capuz', 'Botas de Rua Urbanas', 'Limpador de Lente Ótica'],
      },
      {
        d6: 3,
        temperature: 'Fresco (~10°C / 50°F)',
        condition: 'Nublado',
        narrativeDescription: 'Céu cinzento e homogêneo, como uma tela de estática desligada. O calor do solo é retido sob uma camada uniforme de nuvens médias, criando uma atmosfera melancólica e sem contrastes.',
        sensoryAtmosphere: {
          visual: 'Luz difusa sem sombras fortes; as cores da cidade parecem desbotadas e uniformemente frias.',
          scentAndAir: 'Ar denso e neutro, levemente úmido, sem rajadas de vento expressivas.',
          soundscape: 'Zumbido contínuo e monótono do tráfego urbano nos viadutos; ruído industrial de fundo de Watson.',
          streetLife: 'Movimento rotineiro nas zonas de corporações e mercados; atmosfera de cansaço generalizado da classe trabalhadora.',
        },
        boxedNarration: 'O céu tem a cor de um computador sem sinal. Nem sol, nem tempestade — apenas um cinza opaco que cobre tudo como um lençol úmido, deixando a cidade cinzenta e fazendo os holofotes dos aeródromos brilharem como olhos brancos no vazio.',
        tacticalEffects: 'Condição neutra. Ausência de sombras marcantes concede -1 para quem tenta se esconder nas sombras em áreas abertas.',
        recommendedGear: ['Agasalho Tático Urbano', 'Cigarros Sintéticos ou Pastilhas de Cafeína', 'Fones com Abafador de Ruído'],
      },
      {
        d6: 4,
        temperature: 'Fresco (~10°C / 50°F)',
        condition: 'Chuva Ácida Leve',
        narrativeDescription: 'Gotas mornas com leve acidez caem sobre a cidade. O pH é suficiente para picar pequenas escoriações na pele, manchar tintas automotivas e descolorir tecidos sintéticos comuns.',
        sensoryAtmosphere: {
          visual: 'Pequenos fios de fumaça sobem quando a chuva encosta em escapamentos de motos e tubos de vapor superaquecidos.',
          scentAndAir: 'Cheiro acre característico de bateria vazando ou vinagre morno; ardência leve nos olhos desprotegidos.',
          soundscape: 'Chiado tênue nas folhas de palmeiras sintéticas e nas lonas plásticas dos camelôs de rua.',
          streetLife: 'Quem tem bom senso puxa o capuz da jaqueta tratada e acelera o passo para se abrigar em galerias comerciais cobertas.',
        },
        boxedNarration: 'Uma chuva fina e morna começa a cair, mas o arrepio vem na pele: as gotas ardem suavemente nos arranhões dos nós dos dedos. A chuva ácida da primavera chegou — não é letal de imediato, mas corrói o cromo desprotegido e deixa a roupa com cheiro de bateria velha.',
        tacticalEffects: 'Exposição desprotegida por mais de 30 minutos causa irritação cutânea e ablação de -1 SP em armaduras não tratadas. -1 em Percepção visual a distância.',
        recommendedGear: ['Spray Selante Impermeável Anti-Ácido', 'Jaqueta Balística com Tratamento Teflon', 'Óculos de Proteção'],
      },
      {
        d6: 5,
        temperature: 'Ameno (~15°C / 60°F)',
        condition: 'Tempestade de Chuva Pesada',
        narrativeDescription: 'Um dilúvio torrencial desaba sobre Night City. Calhas e bueiros entupidos de plástico e lixo transbordam em minutos, transformando sarjetas em rios turbulentos de água negra e oleosa.',
        sensoryAtmosphere: {
          visual: 'Cortina espessa de água caindo que reduz a visibilidade a menos de 15 metros; os neons se transformam em borrões indistintos de cor.',
          scentAndAir: 'Cheiro de esgoto saturado subindo dos bueiros misturado com o vapor quente que escapa dos respiradouros subterrâneos.',
          soundscape: 'Baque ensurdecedor da torrente de água contra o asfalto; trovões estrondosos fazendo vibrar as vidraças dos prédios.',
          streetLife: 'Ruas desertas de pedestres; carros andam devagar com pisca-alerta ligado em meio a espirros colossais de água nas calçadas.',
        },
        boxedNarration: 'O céu desaba em uma tromba d’água furiosa. Bueiros entupidos de lixo eletrônico cospem água negra pelas tampas, e os neons de Japantown se tornam manchas aquareladas indistintas através de uma cortina de chuva tão grossa que mal dá para ver o cruzamento à frente.',
        tacticalEffects: 'Visibilidade muito prejudicada: penalidade de -2 em todos os testes de Percepção visual e tiros a mais de 12 metros. Carros sofrem -2 em testes de controle em curvas rápidas.',
        recommendedGear: ['Traje Tático Estanque', 'Visor com Tratamento Hidrofóbico', 'Comunicação por Fio Subdérmico'],
      },
      {
        d6: 6,
        temperature: 'Quente (~21°C / 70°F)',
        condition: 'Clima Estranho (Rolar Tabela de Anomalias)',
        narrativeDescription: 'A primavera dá lugar a um salto anômalo e perigoso de temperatura. O ar do litoral da baía de Coronado se torna espesso, eletrificado e sufocante, anunciando a chegada de uma anomalia severa de Night City.',
        sensoryAtmosphere: {
          visual: 'O horizonte sobre o mar apresenta uma névoa espessa vermelho-sangue ou esverdeada que sobe em colunas giratórias.',
          scentAndAir: 'Calor súbito e opressivo com ardor químico; dificuldade súbita de puxar o ar para os pulmões.',
          soundscape: 'Bipes de estações de monitoramento ambiental soando em postes públicos; alarme de código amarelo.',
          streetLife: 'Seguranças corporativos fecham portões blindados de condomínios fechados e evacuam áreas externas.',
        },
        boxedNarration: 'O calor sobe abruptamente em questão de minutos, como se alguém tivesse aberto a porta de uma fornalha subterrânea. Os radares climáticos nos letreiros públicos começam a piscar em vermelho vivo com a mensagem "ALERTA AMBIENTAL - CÓDIGO AMARELO". O clima enlouqueceu de novo.',
        tacticalEffects: 'Rolar 1d10 na Tabela de Anomalias Climáticas Estranhas para determinar a ocorrência exata e seus impactos mecânicos mortais.',
        recommendedGear: ['Máscara de Oxigênio Compacta', 'Cilindro de Ar Respirável', 'Monitor de Toxinas no Agent'],
      },
    ],
  },
  {
    season: 'Verão (Summer)',
    months: 'Junho a Agosto',
    rolls: [
      {
        d6: 1,
        temperature: 'Ameno (~15°C / 60°F)',
        condition: 'Chuva Quente e Poluída',
        narrativeDescription: 'Uma chuva morna, grossa e pegajosa que parece evaporar assim que atinge o asfalto ardente, criando uma sauna urbana sufocante com cheiro de alcatrão e solventes químicos.',
        sensoryAtmosphere: {
          visual: 'Vapor translúcido subindo das ruas asfaltadas como em um banho turco de rua; janelas de veículos totalmente embaçadas por dentro.',
          scentAndAir: 'Umidade opressiva de 95% misturada ao cheiro de plástico quente, fritura velha e escape de caminhões pesados.',
          soundscape: 'O gotejamento constante da chuva misturado ao zumbido agonizante de aparelhos velhos de ar condicionado pendurados nas janelas.',
          streetLife: 'Pessoas com camisas sintéticas empapadas de suor e chuva; vendedores ambulantes vendem refrigerantes genéricos congelados a preços extorsivos.',
        },
        boxedNarration: 'A chuva de verão de Night City não refresca ninguém — ela cozinha. A água morna cai nas calçadas ferventes e sobe em ondas de vapor grosso que grudam na sua jaqueta e deixam sua pele melada com uma camada oleosa de fuligem e condensação química.',
        tacticalEffects: 'Ambiente saturado: aparelhos de ar condicionado e exaustores barulhentos impõem -1 em Percepção auditiva. O suor constante nos olhos impõe -1 em testes de Concentração.',
        recommendedGear: ['Roupas de Ventilação Ativa', 'Toalha de Resfriamento Rápido', 'Bebidas Isotônicas Eletrolíticas'],
      },
      {
        d6: 2,
        temperature: 'Quente (~21°C / 70°F)',
        condition: 'Céu Limpo (Poluição Visível no Horizonte)',
        narrativeDescription: 'Céu aberto com sol brilhante, contornado no horizonte por uma faixa cor de ferrugem de poluição pesada acumulada sobre os morros de North Oak e o canal de Watson.',
        sensoryAtmosphere: {
          visual: 'Luz solar intensa refletida no vidro dos arranha-céus; faixa cor de mogno/âmbar pairando acima do anel rodoviário.',
          scentAndAir: 'Ar seco com cheiro de poeira aquecida e asfalto fresco sendo reparado por equipes municipais.',
          soundscape: 'Buzinas animadas, músicas latinas e pop japonês tocando nos alto-falantes de feiras livres em Heywood e Kabuki.',
          streetLife: 'Trânsito intenso de carros conversíveis e motos barulhentas; calçadas movimentadas até altas horas da noite.',
        },
        boxedNarration: 'O sol queima limpo sobre Night City, mas se você olhar para as bordas do horizonte vai ver a assinatura eterna da cidade: uma cinta marrom e espessa de smog petroquímico abraçando os morros e lembrando a todos que o ar puro aqui é mercadoria de luxo.',
        tacticalEffects: 'Condição excelente para operações diurnas normais. Reflexos intensos de cromo podem denunciar atiradores escondidos sem camuflagem anti-reflexo.',
        recommendedGear: ['Óculos de Sol Espelhados', 'Protetor Solar Dérmico Anti-Radiação', 'Água Mineral Purificada'],
      },
      {
        d6: 3,
        temperature: 'Quente (~21°C / 70°F)',
        condition: 'Nublado e Abafado',
        narrativeDescription: 'Uma cobertura estática de nuvens amareladas retém o calor como uma estufa gigante. O vento não sopra e o ar parado nos becos acumula todo o odor da metrópole em um bolsão imóvel.',
        sensoryAtmosphere: {
          visual: 'Luz opaca e sufocante; a névoa amarela obscurece o topo dos arranha-céus a partir do 40º andar.',
          scentAndAir: 'Sensação claustrofóbica de falta de oxigênio; cheiro de lixo orgânico em decomposição nas caçambas dos becos.',
          soundscape: 'Zumbido onipresente de motores elétricos, compressores e ventiladores industriais tentando movimentar o ar.',
          streetLife: 'Gangers e pedestres com pouca paciência; brigas de bar e tiroteios de trânsito aumentam exponencialmente com a irritação térmica.',
        },
        boxedNarration: 'O ar está parado como água de esgoto. Um teto baixo de nuvens amareladas prende o calor e o bafo das refinarias contra o chão, transformando cada beco de Night City em uma estufa suja onde até respirar exige esforço e a paciência de todo mundo dura menos que um fósforo aceso.',
        tacticalEffects: 'Tensão social aumentada: testes Sociais de Persuasão ou Interrogatório para acalmar alvos sofrem -1 devido à irritabilidade extrema geral.',
        recommendedGear: ['Ventilador Portátil de Gola', 'Pastilhas de Hidratação', 'Roupas Leves de Fibra Sintética'],
      },
      {
        d6: 4,
        temperature: 'Muito Quente (~27°C / 80°F)',
        condition: 'Céu Enevoado com Ozônio',
        narrativeDescription: 'A alta radiação solar combinada aos hidrocarbonetos no ar gera altos níveis de ozônio ao nível da rua. Uma névoa branco-azulada tênue arde nas narinas e deixa os olhos avermelhados.',
        sensoryAtmosphere: {
          visual: 'Uma névoa azulada brilhante que refrata a luz em halos circulares ao redor de lâmpadas de rua e faróis de carros.',
          scentAndAir: 'Cheiro penetrante e metálico de ozônio e fios elétricos em curto-circuito; tosse seca imediata em quem corre a pé.',
          soundscape: 'Passos arrastados; o som de tosse constante vindo de pedestres pelas calçadas.',
          streetLife: 'Farmácias de rua esgotam estoques de inaladores de broncodilatadores e colírios anti-irritantes.',
        },
        boxedNarration: 'O ar tem cheiro de relâmpago e fio queimado. O sol cozinhou os poluentes das avenidas até produzir uma névoa azulada de ozônio que desce até o chão, fazendo os olhos lacrimejarem e arrancando tosses secas de qualquer um que tente andar rápido demais sem uma máscara no rosto.',
        tacticalEffects: 'Exposição pesada sem máscara por mais de 1 hora impõe penalidade de -1 em testes de Atletismo e Resistência física.',
        recommendedGear: ['Máscara com Cartucho de Carbono Ativado', 'Colírio Bio-Lubrificante', 'Inalador de Broncodilatador'],
      },
      {
        d6: 5,
        temperature: 'Muito Quente (~27°C / 80°F)',
        condition: 'Céu Limpo e Sol Escaldante',
        narrativeDescription: 'Radiação ultravioleta severa. O asfalto amolece e gruda nas solas de calçados baratos, e a lataria de veículos expostos queima a pele ao menor toque acidental.',
        sensoryAtmosphere: {
          visual: 'Ondulações térmicas visíveis distorcendo a linha do horizonte sobre as avenidas; luz cegante que queima a retina desprotegida.',
          scentAndAir: 'Cheiro forte de alcatrão derretido e borracha de pneu esturricando no solo ardente.',
          soundscape: 'Silêncio abafado nas horas centrais do dia; ninguém sai a pé ao meio-dia se não tiver uma arma apontada para a cabeça.',
          streetLife: 'Ruas praticamente desertas entre 11h e 15h; os poucos pedestres andam grudados sob as sombras das marquises e passarelas elevadas.',
        },
        boxedNarration: 'O sol do meio-dia bate como uma marreta de demolição. O asfalto da avenida está mole e gruda na sola das botas, e tocar na lataria de um carro estacionado sem luvas arranca pedaço de pele. Em Night City, o verão não é uma estação — é um cerco térmico.',
        tacticalEffects: 'Regras de Exposição ao Calor Extremo (CP:R p. 181): personagens usando armadura pesada (MetalGear ou Subdermal completa) sem sistema de refrigeração sofrem desidratação e fadiga.',
        recommendedGear: ['Óculos Balísticos Polarizados Grau 4', 'Refrescat Traje Tático com Micro-Refrigeração', 'Cantil Térmico Militar'],
      },
      {
        d6: 6,
        temperature: 'Escaldante (~32°C / 90°F+)',
        condition: 'Clima Estranho (Rolar Tabela de Anomalias)',
        narrativeDescription: 'O mercúrio ultrapassa limites históricos. O calor desértico dos Badlands colide com a poluição petroquímica da baía, disparando um colapso microclimático catastrófico no setor.',
        sensoryAtmosphere: {
          visual: 'Céu vermelho-cobre pulsante de calor; miragens térmicas nas pontes entre Watson e Westbrook.',
          scentAndAir: 'Ar superaquecido que parece queimar os alvéolos pulmonares a cada inspiração.',
          soundscape: 'Sirenes de emergência soando; transformadores de luz explodindo em labaredas com o excesso de demanda dos aparelhos de ar-condicionado.',
          streetLife: 'Blecaute parcial iminente; cidadãos invadem lojas climatizadas em busca de refúgio térmico.',
        },
        boxedNarration: 'O termômetro digital no topo da torre da Petrochem pisca em 38°C e apaga. Um vento escaldante sopra dos Badlands como a respiração de uma fornalha aberta, fazendo transformadores de energia estourarem em fagulhas e transformando as ruas de concreto em panelas de pressão prontas para explodir.',
        tacticalEffects: 'Rolar imediatamente na Tabela de Anomalias Climáticas Estranhas (1d10) para definir a calamidade climática resultante.',
        recommendedGear: ['Traje Refrescante Termoelétrico', 'Injetor de Eletrólitos', 'Protetor Solar Grau Militar'],
      },
    ],
  },
  {
    season: 'Outono (Fall)',
    months: 'Setembro a Novembro',
    rolls: [
      {
        d6: 1,
        temperature: 'Fresco (~4°C / 40°F)',
        condition: 'Chuva Fria e Vento Forte',
        narrativeDescription: 'Ventos outonais rigorosos vindos do mar fustigam a baía de Coronado, empurrando chuva gelada em ângulo oblíquo contra as janelas e becos estreitos.',
        sensoryAtmosphere: {
          visual: 'Chuva caindo quase na horizontal empurrada pelo vendaval; luzes de neon distorcidas e refletidas nas paredes molhadas.',
          scentAndAir: 'Cheiro de maresia salgada e ferrugem úmida de containers enferrujados das docas de Watson.',
          soundscape: 'Barulho incessante de cabos de sustentação tinindo contra mastros e guindastes portuários.',
          streetLife: 'Tráfego marítimo no porto suspenso; barcos de carga ancoram no largo esperando o vento ceder.',
        },
        boxedNarration: 'O vento vem do mar com fúria de outono, empurrando a chuva gelada de lado e jogando rajadas de água salgada e ferrugem até o vigésimo andar dos prédios. Quem está na rua anda com o queixo colado no peito e as mãos trancadas nos bolsos.',
        tacticalEffects: 'Chuva em ângulo impõe -2 em disparos de longa distância desprotegidos. Ventania extrema dificulta vôos de drones leves e AVs pequenos.',
        recommendedGear: ['Jaqueta Corta-Vento Náutica Tática', 'Gola Balística Impermeável', 'Fixador de Equipamento Magnético'],
      },
      {
        d6: 2,
        temperature: 'Ameno (~15°C / 60°F)',
        condition: 'Céu Limpo',
        narrativeDescription: 'Uma tarde límpida e dourada de outono com temperaturas perfeitas. A brisa suave dissipa o grosso da fuligem e a luz do crepúsculo tinge os arranha-céus de cobre e ouro.',
        sensoryAtmosphere: {
          visual: 'Pôr do sol cinematográfico tingindo o mar em degradê de laranja, rosa e violeta; neons começam a acender na penumbra suave.',
          scentAndAir: 'Ar fresco e respirável, com notas confortáveis de café sintético e castanhas assadas de quiosques de rua.',
          soundscape: 'Trânsito fluindo com suavidade incomum; vozes e risadas em mesas ao ar livre em bares de Northside e Japantown.',
          streetLife: 'Ruas cheias de gente aproveitando o clima ameno; músicos de rua tocando guitarras acústicas cibernéticas nas praças.',
        },
        boxedNarration: 'Por uma hora rara antes do anoitecer, Night City parece um sonho dourado. O sol poente tinge os espelhos da Arasaka de cobre puro e a brisa limpa o ar o suficiente para você esquecer o fedor dos lixões. É o tipo de tarde que faz mercenário veterano baixar a guarda e morrer baleado por distração.',
        tacticalEffects: 'Condição excelente para operações urbanas, vigilância e reconhecimento visual. Alcance máximo de visores óticos sem interferência.',
        recommendedGear: ['Óculos de Sol Leves', 'Jaqueta Casual Estilosa', 'Câmera Ótica de Gravação'],
      },
      {
        d6: 3,
        temperature: 'Ameno (~15°C / 60°F)',
        condition: 'Nublado e Vento Seco dos Badlands',
        narrativeDescription: 'Ventos secos sopram do deserto oriental, trazendo partículas finas de argila vermelha e areia que cobrem para-brisas de carros com uma película ocre fina.',
        sensoryAtmosphere: {
          visual: 'Céu com tonalidade marrom-dourada fosca; sol parece um disco de latão borrado atrás do véu de poeira.',
          scentAndAir: 'Ar ressecado que resseca lábios e garganta rapidamente; cheiro mineral de terra seca e combustível fóssil.',
          soundscape: 'Chiado seco da poeira colidindo contra fachadas de vidro e telhados metálicos.',
          streetLife: 'Lava-rápidos de beira de estrada com filas imensas; motoristas limpando limpadores de para-brisa em cada semáforo.',
        },
        boxedNarration: 'O vento vem do interior seco, carregando o pó vermelho dos Badlands direto para o coração da metrópole. O sol parece uma moeda de cobre suja no céu e cada gole de café vem acompanhado de uma pitada de areia do deserto que range entre os dentes.',
        tacticalEffects: 'Partículas de areia reduzem a eficiência de miras térmicas baratas a mais de 50 metros. Dificulta disfarces impecáveis devido à poeira grudada nas roupas.',
        recommendedGear: ['Protetor Labial Hidratante', 'Pano de Limpeza de Lentes', 'Máscara Contra Poeira'],
      },
      {
        d6: 4,
        temperature: 'Ameno (~15°C / 60°F)',
        condition: 'Névoa Amarelada Baixa',
        narrativeDescription: 'Uma neblina espessa de cor mostarda rasteja pelos bueiros e viadutos, acumulando-se a até dois metros de altura nas avenidas principais de Heywood e Santo Domingo.',
        sensoryAtmosphere: {
          visual: 'Carros parecem deslizar sobre um mar de fumaça densa e amarelada; pedestres têm apenas tronco e cabeça visíveis acima da bruma.',
          scentAndAir: 'Cheiro de enxofre e resíduos químicos condensados; umidade gelada que gruda nas calças e canos das botas.',
          soundscape: 'Buzinas de advertência soando rítmicas nos cruzamentos com pouca visibilidade; passos abafados.',
          streetLife: 'Gangers usam a névoa para se aproximar sorrateiramente de alvos desavisados em calçadas mal iluminadas.',
        },
        boxedNarration: 'Uma névoa pesada da cor de mostarda velha escorre pelos bueiros e abraça o asfalto até a altura do peito. Você caminha como se estivesse afundado em um pântano químico luminoso, onde os faróis dos carros cortam a fumaça amarela como olhos de predadores à espreita.',
        tacticalEffects: 'Cobertura natural ao nível do chão: rastejar ou ficar agachado concede Cobertura Média (+2 na Defesa contra tiros). Penalidade de -1 em Percepção visual baixa.',
        recommendedGear: ['Filtros Respiratórios Nasais', 'Botas de Cano Alto Impermeáveis', 'Lanterna Tática de Luz Ultravioleta'],
      },
      {
        d6: 5,
        temperature: 'Quente (~21°C / 70°F)',
        condition: 'Céu Limpo',
        narrativeDescription: 'O outono presenteia a metrópole com uma calmaria estável e ar agradável. A brisa da noite traz frescor do oceano enquanto a vida noturna explode em luzes e som.',
        sensoryAtmosphere: {
          visual: 'Céu estrelado (com estrelas visíveis entre as pontas dos arranha-céus nas áreas menos iluminadas); neons refletem em alta nitidez.',
          scentAndAir: 'Brisa leve e confortável; aroma de churrasco de proteína sintética e cerveja barata emanando das portas de bares.',
          soundscape: 'Batidas graves de synthwave e industrial rock vazando dos clubes noturnos subterrâneos.',
          streetLife: 'Ruas lotadas de edgerunners, fixers e clientes executivos buscando diversão noturna; atividade comercial máxima.',
        },
        boxedNarration: 'Night City veste sua melhor jaqueta de couro nesta noite. O céu está limpo, o ar é agradável e as luzes da cidade pulsam com promessas de dinheiro fácil e diversão cara. Uma daquelas noites em que qualquer trabalho parece possível antes do primeiro tiro ser disparado.',
        tacticalEffects: 'Condição perfeita. Movimentação tática e acrobática opera sem qualquer penalidade de terreno ou clima.',
        recommendedGear: ['Armas Limpas e Prontas', 'Traje de Gala ou Roupa Noturna Impecável', 'Chip de Créditos Abastecido'],
      },
      {
        d6: 6,
        temperature: 'Muito Quente (~27°C / 80°F)',
        condition: 'Clima Estranho (Rolar Tabela de Anomalias)',
        narrativeDescription: 'Mudança barométrica extrema e repentina. Nuvens de tempestade com descargas elétricas estáticas verde-esmeralda se formam rapidamente sobre as montanhas e descem em direção à costa.',
        sensoryAtmosphere: {
          visual: 'Relâmpagos silenciosos esverdeados iluminando o interior de nuvens de cinzas em formato de bigorna.',
          scentAndAir: 'Ar carregado de ozônio e sulfatos que faz a garganta arranhar ao menor esforço físico.',
          soundscape: 'Eco grave de trovões distantes rolando continuamente pelas encostas dos morros como tiros de canhão.',
          streetLife: 'Transeuntes correm para estações de metrô e lojas com portas blindadas; sirenes de defesa civil emitem tom contínuo.',
        },
        boxedNarration: 'A pressão atmosférica despenca tanto que os tímpanos estalam. Nuvens cor de carvão com relâmpagos verdes silenciosos se acumulam acima das montanhas como uma muralha de guerra. O alerta no seu Agent acende com aviso de anomalia meteorológica iminente.',
        tacticalEffects: 'Rolar imediatamente na Tabela de Anomalias Climáticas Estranhas (1d10) para determinar o evento extremo e suas consequências mortais.',
        recommendedGear: ['Kit de Primeiros Socorros para Trauma', 'Máscara com Suprimento de Oxigênio', 'Rádio Militar Criptografado'],
      },
    ],
  },
];

export interface StrangeWeatherRoll {
  d10: number;
  name: string;
  namePt: string;
  duration: string;
  description: string;
  mechanics: string;
  citation: string;
  sensoryAtmosphere: WeatherSensoryDetails;
  boxedNarration: string;
  survivalProtocols: string;
  recommendedGear: string[];
}

export const strangeWeatherTable: StrangeWeatherRoll[] = [
  {
    d10: 1,
    name: 'Radioactive Windstorm',
    namePt: 'Vendaval Radioativo',
    duration: '1d6 x 10 Minutos (rajadas de 1d6 rodadas)',
    description: 'Ventos fortíssimos varrem a Hot Zone e a cratera da Torre Arasaka, espalhando isótopos de césio e partículas atômicas por bairros vizinhos.',
    mechanics: 'Qualquer um exposto sem Traje Anti-Radiação sofre efeitos de Radiação Severa (CP:R p. 181): DV15 Resist Torture/Drugs a cada hora ou perde 2d6 HP e adquire condição Enjoado.',
    citation: 'Night City Weather DLC p. 5 • CP:R p. 181',
    sensoryAtmosphere: {
      visual: 'O ar ganha uma fluorescência azulada fantasmagórica sob a luz fraca; contadores Geiger nos Agents estalam em frenesi contínuo.',
      scentAndAir: 'Gosto metálico amargo e intenso no fundo da língua; ardor imediato na garganta e olhos secos.',
      soundscape: 'Uivo estarrecedor do vendaval entre as carcaças retorcidas de aço da Hot Zone; estalos rítmicos dos dosímetros de radiação.',
      streetLife: 'Pânico nas ruas: pedestres quebram vidraças de lojas em busca de abrigo subterrâneo; patrulhas da NCPD se fecham em veículos blindados selados.',
    },
    boxedNarration: 'Um vento quente e seco sopra da cratera atômica do Corporate Center trazendo o passado radioativo de volta à vida. Os dosímetros de radiação nos celulares começam a estalar loucamente, e o ar fica com o gosto amargo de moeda de cobre na boca. Poeira de césio e átomos mortos de 2022 estão voando pelas ruas.',
    survivalProtocols: 'Buscar abrigo imediatamente dentro de estruturas de concreto maciço ou subsolos; selar frestas de portas e respiradouros com fita adesiva plástica.',
    recommendedGear: ['Traje Anti-Radiação NBC Grau Militar', 'Injetor de Rad-Purge (Desintoxicante)', 'Dosímetro Geiger de Pulso'],
  },
  {
    d10: 2,
    name: 'Ash Storm',
    namePt: 'Tempestade de Cinzas',
    duration: '1d6 x 10 Minutos',
    description: 'Incêndios maciços nos lixões ou nos Badlands empurram colunas densas de fuligem tóxica sobre a cidade, obscurecendo a luz solar em tons carmesins.',
    mechanics: 'Quem passar mais de 1 minuto sem Filtros Nasais ou Máscara Anti-Smog sofre teste de DV13 Resist Torture/Drugs ou sofre dano de Frasco de Veneno (2d6 direto no HP, CP:R p. 355) e ganha Ferimento Crítico de Corpo Estranho (Foreign Object) nos pulmões. Penalidade de -2 em Percepção e ataques à distância.',
    citation: 'Night City Weather DLC p. 4 • CP:R p. 355',
    sensoryAtmosphere: {
      visual: 'Céu carmesim-sangue obscurecido por tempestade de flocos negros de fuligem; visibilidade cai para menos de 5 metros.',
      scentAndAir: 'Fumaça asfixiante de borracha queimada e plástico incinerado que fecha as vias aéreas quase instantaneamente.',
      soundscape: 'Tosse coletiva ecoando nas ruas; ruído suave e sinistro de chuva de fuligem caindo como neve negra sobre os ombros.',
      streetLife: 'Trânsito para totalmente; motoristas abandonam veículos parados nas avenidas para buscar ar em prédios com filtragem ativa.',
    },
    boxedNarration: 'O céu sangra cinzas negras sobre Night City. Os lixões nos arredores pegaram fogo e o vento trouxe uma nevasca de fuligem industrial tão grossa que o meio-dia parece uma fornalha avermelhada. Sem máscara, cada respiração puxa lascas de plástico e fibra de vidro direto para dentro dos pulmões.',
    survivalProtocols: 'Cobrir boca e nariz com tecido umedecido caso não tenha filtro nasal; evitar esforço físico intenso que aumente a frequência respiratória.',
    recommendedGear: ['Máscara Facial Anti-Smog com Filtro Hepa', 'Filtros Nasais Químicos', 'Colírio Hidratante com Anestésico'],
  },
  {
    d10: 3,
    name: 'Flooding',
    namePt: 'Inundação Costeira / Ressaca',
    duration: '1d6 Dias',
    description: 'O solo instável compactado após a explosão atômica de 2022 cede, e águas do Pacífico e de esgotos industriais transbordam avenidas, subsolos e estações subterrâneas.',
    mechanics: 'Nas ruas, água atinge 15 a 30 cm (dificulta tração de veículos). Em subsolos e túneis, vira terreno difícil (gasta o dobro de MOVE) e risco de choques elétricos por fiação exposta.',
    citation: 'Night City Weather DLC p. 5 • CP:R p. 169',
    sensoryAtmosphere: {
      visual: 'Avenidas transformadas em canais lamacentos com detritos boiando; lixeiras, tambores de óleo e carcaças de carros submersas.',
      scentAndAir: 'Fedor nauseante de água de esgoto misturada com chorume, gasolina e peixes mortos trazidos pela maré alta da baía.',
      soundscape: 'Água chapinhando ruidosamente sob rodas e botas; alarmes de curto-circuito e zumbidos de cabos de força faiscando na água.',
      streetLife: 'Cidadãos andam sobre parapeitos e muretas; barcos infláveis improvisados cobram 20eb para atravessar cruzamentos alagados.',
    },
    boxedNarration: 'O mar da baía de Coronado resolveu cobrar seu território de volta. A maré subiu, o dique rachou e a água negra do porto engoliu as ruas até a altura do joelho, trazendo lixo, óleo de navio e carcaças mecânicas boiando entre os carros parados.',
    survivalProtocols: 'Evitar entrar em água que esteja em contato com cabos de alta tensão caídos; buscar rotas elevadas por passarelas suspensas.',
    recommendedGear: ['Botas de Voo / Anfíbias', 'Mochila Estanque com Vedação IP68', 'Corda com Gancho Magnético'],
  },
  {
    d10: 4,
    name: 'Blood Rain',
    namePt: 'Chuva de Sangue (Blood Rain)',
    duration: '1d6 Horas',
    description: 'Precipitação oleosa, viscosa e avermelhada carregada de produtos químicos corrosivos e compostos de guerra bacteriológica/química da 4ª Guerra Corporativa.',
    mechanics: 'Rolar 1d6: Em 1-3 age como Chuva Ácida (-1 SP de armadura por minuto exposto sem proteção). Em 4-6, a cada minuto exposto sem proteção, o personagem é tratado como dosado com um Frasco de Biotoxina (DV15 Resist Torture/Drugs ou sofre 3d6 de dano direto no HP). Penalidade de -1 em Percepção e ataques à distância.',
    citation: 'Night City Weather DLC p. 4 • CP:R p. 355',
    sensoryAtmosphere: {
      visual: 'Gotas vermelhas espessas escorrendo em vidros e vitrines, deixando rastros carmesins que parecem sangue coagulado.',
      scentAndAir: 'Cheiro de ferro velho e carne em decomposição misturado com produtos químicos pungentes que causam ânsia de vômito.',
      soundscape: 'Pancadas pesadas e viscosas das gotas caindo; choro e preces em dialetos de rua ecoando sob viadutos.',
      streetLife: 'Gangers supersticiosos veem o evento como presságio de massacre; rituais de facções e recolhimento total da população civil.',
    },
    boxedNarration: 'A chuva que cai do céu tem a cor e a viscosidade de sangue venoso. Gotas vermelhas escorrem pelas fachadas dos megaprédios como lágrimas de uma cidade condenada, deixando manchas pegajosas de toxinas da 4ª Guerra que corroem armaduras e corroem a sanidade de quem não se trancar a tempo.',
    survivalProtocols: 'Proteger todas as partes de pele exposta com trajes impermeáveis; lavar imediatamente qualquer contato cutâneo com solução desinfetante.',
    recommendedGear: ['Traje Químico Selado com Capuz', 'Frascos de Desintoxicante Universal', 'Óculos de Visão Noturna Fechados'],
  },
  {
    d10: 5,
    name: 'Acid Rain',
    namePt: 'Chuva Ácida Severa',
    duration: '1d6 Horas',
    description: 'Gotas altamente cáusticas de pH 2.5 dissolvem tecidos sintéticos, desgastam tintas de carros e queimam pele desprotegida.',
    mechanics: 'Ablação contínua: Para cada minuto inteiro gasto sob a chuva ácida sem cobertura ou guarda-chuva, TODA armadura vestida sofre 1 ponto de ablação (-1 SP na Cabeça e no Corpo). Danifica itens expostos e pintura.',
    citation: 'Night City Weather DLC p. 4',
    sensoryAtmosphere: {
      visual: 'Vapor branco e fumaça subindo de quase todas as superfícies tocadas pelas gotas; buracos queimados surgindo em roupas comuns.',
      scentAndAir: 'Ardor violento nos olhos e nariz como ácido muriático puro borrifado no ar.',
      soundscape: 'Chiado constante e agressivo de corrosão de metais, plásticos e tintas por toda a avenida.',
      streetLife: 'Pessoas correm desesperadas com mochilas e jaquetas sobre a cabeça; guarda-chuvas baratos derretem nos aros em minutos.',
    },
    boxedNarration: 'A chuva ácida severa de Night City é um solvente vivo. As gotas assobiam ao atingirem o capô dos veículos, abrindo buracos brancos na pintura e soltando fios de vapor cáustico. Ficar exposto lá fora sem abrigo rígido é ver sua armadura derreter centímetro por centímetro.',
    survivalProtocols: 'Usar guarda-chuvas reforçados de teflon ou painéis balísticos; refugiar-se sob marquises de concreto maciço ou passarelas.',
    recommendedGear: ['Guarda-chuva Tático de Carbono / Kevlar', 'Capa Anti-Corrosiva Rígida', 'Pomada Neutralizadora de Queimadura'],
  },
  {
    d10: 6,
    name: 'Deadly Thunderstorm',
    namePt: 'Tempestade de Raios Destrutiva',
    duration: '1d6 x 10 Minutos',
    description: 'Tempestade elétrica violenta. A estática no ar faz os implantes zumbirem antes dos relâmpagos romperem os prédios.',
    mechanics: 'A cada 10 minutos, o Mestre rola 1d6. Em 4-6, um raio atinge a estrutura mais alta ou o personagem mais alto / segurando arma de metal com as duas mãos. Dano de 6d6 no corpo + efeito idêntico a Granada Flashbang (CP:R p. 346, DV15 Resist Torture/Drugs ou atordoado/cego). -2 em testes de Percepção e disparos à distância.',
    citation: 'Night City Weather DLC p. 4-5 • CP:R p. 346',
    sensoryAtmosphere: {
      visual: 'Relâmpagos azuis e violetas rasgam a escuridão estourando transformadores em bolas de fogo; clarões cegantes a cada três segundos.',
      scentAndAir: 'Cheiro fortíssimo de ozônio ionizado puro misturado a madeira e cabos em curto-circuito.',
      soundscape: 'Estrondos sísmicos de trovões que fazem o chão tremer sob as solas das botas; alarmes de carros disparando em coro pela cidade toda.',
      streetLife: 'Transeuntes jogam no chão hastes de guarda-chuvas metálicos com medo de virarem para-raios humanos nas calçadas.',
    },
    boxedNarration: 'O céu explode em violência elétrica pura. Relâmpagos azuis do tamanho de troncos de árvore cravam nos para-raios dos arranha-céus, e o trovão que se segue faz os implantes cibernéticos zumbirem na nuca como abelhas presas sob o crânio.',
    survivalProtocols: 'Não segurar objetos metálicos compridos erguidos; afastar-se de postes de iluminação e estruturas isoladas em descampados.',
    recommendedGear: ['Isolante Elétrico em Malha de Borracha', 'Protetores Auriculares Cibernéticos', 'Óculos com Filtro Anti-Clarão'],
  },
  {
    d10: 7,
    name: 'Inversion Smog',
    namePt: 'Inversão Térmica com Smog Asfixiante',
    duration: '1d6 Dias',
    description: 'Massa de ar frio prende uma camada densa de fumaça de CHOOH2, fuligem e vapores petroquímicos sobre a cidade, como uma sopa amarela impenetrável.',
    mechanics: 'Visibilidade quase nula. Penalidade brutal de -4 em todos os testes de Percepção e ataques à distância. Quem passar mais de 1 minuto sem Máscara Anti-Smog ou Filtros Nasais sofre DV13 Resist Torture/Drugs como exposição a Frasco de Veneno (2d6 no HP).',
    citation: 'Night City Weather DLC p. 5 • CP:R p. 355',
    sensoryAtmosphere: {
      visual: 'Uma sopa amarela e opaca onde luzes de postes a cinco metros parecem vaga-lumes mortos; edifícios desaparecem da vista.',
      scentAndAir: 'Gás de exaustão espesso, óleo quente e enxofre; sensação imediata de asfixia sem filtro de ar ativo.',
      soundscape: 'Sons completamente abafados e fantasmagóricos; o silêncio de uma cidade que tenta respirar sem conseguir.',
      streetLife: 'Ruas quase vazias; os poucos que circulam usam máscaras completas com tubos de oxigênio pendurados nas costas.',
    },
    boxedNarration: 'Uma muralha de ar frio prendeu a fumaça de quinhentas mil chaminés de refinarias e motores de CHOOH2 rente ao chão. Night City virou uma piscina de sopa química amarela onde você mal enxerga a própria mão estendida e respirar sem máscara é beber veneno aos goles.',
    survivalProtocols: 'Uso obrigatório ininterrupto de máscara filtrante classe militar ou rebreather; movimentação apenas com radares de curta distância.',
    recommendedGear: ['Máscara de Gás Fechada com Cartuchos Militares', 'Radar de Proximidade / Sonar Tático', 'Módulo de Oxigênio Portátil'],
  },
  {
    d10: 8,
    name: 'Cold Snap / Heat Wave',
    namePt: 'Onda Térmica Extrema (Frio Polar ou Calor Extremo)',
    duration: '1d6 Dias',
    description: 'Oscilação climática violenta. No frio, gelo negro cobre o asfalto. No calor, o mercúrio sobe para 45°C (113°F) com sensação térmica sufocante.',
    mechanics: 'Se Frio Polar: Regras de Exposição (CP:R p. 181). Gelo escorregadio impõe -2 em Atletismo, Condução e Esquiva. Se Onda de Calor: Aumenta em +2 a penalidade de armadura para REF, DEX e MOVE (ex: penalidade de -2 vira -4!). Regras de Exposição ao calor (desidratação e fadiga).',
    citation: 'Night City Weather DLC p. 4-5 • CP:R p. 181',
    sensoryAtmosphere: {
      visual: 'No frio: superfícies cobertas por vidro escuro escorregadio de gelo negro. No calor: miragens ondulantes e distorções visuais.',
      scentAndAir: 'No frio: ar seco que racha lábios e faz os pulmões doerem. No calor: ar opressivo de fornalha com poeira suspensa.',
      soundscape: 'No frio: derrapagens contínuas e batidas de veículos. No calor: zumbido desesperado de geradores elétricos sobrecarregados.',
      streetLife: 'No frio: cadáveres de moradores de rua recolhidos pela manhã pelos serviços funerários. No calor: colapsos por insolação nas calçadas.',
    },
    boxedNarration: 'O termômetro de Night City enlouqueceu completamente. Seja o frio polar que congela o cromo das articulações e transforma as curvas em pistas de boliche assassinas, ou o bafo de fornalha que amolece o asfalto e ferve o sangue nos implantes, a cidade tenta matar seus habitantes pela temperatura.',
    survivalProtocols: 'Ajustar camadas térmicas conforme a onda; buscar zonas com geradores privados ou aquecimento/refrigeração autônomos.',
    recommendedGear: ['Traje Térmico com Controle Eletrônico de Temperatura', 'Grampos de Aço para Botas (Gelo)', 'Soro Eletrolítico'],
  },
  {
    d10: 9,
    name: 'Dust Storm',
    namePt: 'Tempestade de Poeira dos Badlands',
    duration: '1d6 x 10 Minutos',
    description: 'Ventos uivantes arrastam areia vermelha e partículas dos Badlands secos, cegando câmeras e diminuindo a tração nas estradas.',
    mechanics: 'Mais de 5 minutos sem máscara/filtros provoca Ferimento Crítico de Corpo Estranho (Foreign Object) nos pulmões (5 de dano sempre que se mover mais de 4m a pé no turno). Penalidade de -2 em testes de Percepção visual e tiros de longo alcance.',
    citation: 'Night City Weather DLC p. 5',
    sensoryAtmosphere: {
      visual: 'Uma muralha avermelhada e ocre varre os arranha-céus, tingindo toda a cidade em tons escuros de terra e ferrugem.',
      scentAndAir: 'Areia fina nos olhos, narinas e dentes; secura brutal nas mucosas e cheiro de poeira mineral quente.',
      soundscape: 'Rugido contínuo e áspero de bilhões de grãos de areia batendo contra vidros espelhados como lixa industrial.',
      streetLife: 'Tráfego nas autoestradas interestaduais colapsa; nômades colocam óculos de deserto e cobrem radiadores com tecidos grossos.',
    },
    boxedNarration: 'O deserto dos Badlands resolveu engolir a metrópole. Uma muralha vermelha de areia e terra seca despenca sobre os prédios de concreto com o rugido de um trem de carga, lixando a pintura dos carros e enchendo os dentes de poeira ácida que arranha a garganta.',
    survivalProtocols: 'Usar óculos com vedação completa em silicone e máscara facial; estacionar veículos com a traseira voltada para a direção do vento.',
    recommendedGear: ['Óculos de Deserto Nômade com Vedação Hermética', 'Keffiyeh / Lenço Tático Nômade', 'Filtro de Ar para Veículo'],
  },
  {
    d10: 10,
    name: 'City Grid Blackout',
    namePt: 'Apagão Elétrico de Setor',
    duration: '1d6 Dias',
    description: 'Subestações sobrecarregam ou são sabotadas. Setores inteiros perdem luz, conexões CitiNet, sinal de celulares e Data Pool.',
    mechanics: 'Raio de 1d10 quarteirões afetado. Prédios sem geradores próprios ficam em breu total (-4 sem Visão Noturna). Telefones/Agentes não alcançam o Data Pool nem conseguem chamar a polícia ou Trauma Team sem linha dedicada com fio.',
    citation: 'Night City Weather DLC p. 4',
    sensoryAtmosphere: {
      visual: 'O terror de uma Night City sem luz: quarteirões inteiros mergulhados na escuridão absoluta, quebrada apenas por faróis e disparos de armas.',
      scentAndAir: 'Cheiro de fumaça de geradores a diesel improvisados misturado à queima de transformadores elétricos destruídos.',
      soundscape: 'Tiros ecoando no breu, gritos distantes, vidraças sendo quebradas e o silêncio perturbador da ausência de neons e propagandas holográficas.',
      streetLife: 'Saques imediatos em lojas locais; gangues tomam as esquinas cobrando pedágio de passagem no escuro.',
    },
    boxedNarration: 'De repente, a eletricidade morre. As luzes de neon apagam em cascata como dominós de vidro e os outdoors holográficos colapsam em estática antes de sumirem no breu. Em três segundos, Night City se torna uma selva escura como breu onde a única lei é o feixe da lanterna montada no cano do seu fuzil.',
    survivalProtocols: 'Ativar lanternas e visores noturnos imediatamente; evitar avenidas abertas onde snipers com miras térmicas caçam alvos.',
    recommendedGear: ['Lanterna Tática de Arma', 'Ciberolho com Visão Noturna / Térmica', 'Baterias Sobressalentes / Gerador Portátil'],
  },
];

export interface DistrictWeatherNuance {
  districtId: string;
  districtName: string;
  localAtmosphere: string;
  sensoryHook: string;
  environmentalHazard: string;
}

export const DISTRICT_WEATHER_NUANCES: Record<string, DistrictWeatherNuance> = {
  watson: {
    districtId: 'watson',
    districtName: 'Watson (Little China, Kabuki, Northside)',
    localAtmosphere: 'Smog industrial sufocante das fábricas de Northside misturado com maresia salgada das docas e vapores oleosos de barracas de comida de Kabuki.',
    sensoryHook: 'O chiado de letreiros de neon quebrados em mandarim e japonês ecoa enquanto a fuligem preta mancha os cabos elétricos que cruzam os prédios baixos.',
    environmentalHazard: 'Gotas de chuva ácida pingando de aparelhos enferrujados de ar-condicionado em becos estreitos podem causar queimaduras leves e ablação.',
  },
  westbrook: {
    districtId: 'westbrook',
    districtName: 'Westbrook (Japantown, Charter Hill, North Oak)',
    localAtmosphere: 'Em North Oak, cúpulas climáticas privadas e ionizadores de ar filtram a bruma para os executivos. Em Japantown, o asfalto espelha neons em poças douradas perfeitas.',
    sensoryHook: 'O contraste chocante entre o ar filtrado e com aroma de flor de cerejeira artificial nas colinas e o vapor de esgoto de Japantown à noite.',
    environmentalHazard: 'Superfícies de mármore e cerâmica polida em praças corporativas tornam-se escorregadias como gelo durante garoas.',
  },
  city_center: {
    districtId: 'city_center',
    districtName: 'City Center (Corpo Plaza, Downtown)',
    localAtmosphere: 'Os mega-arranha-céus da Arasaka, Militech e Petrochem criam o violento "Efeito Desfiladeiro", canalizando ventos que dobram de velocidade em nível de rua.',
    sensoryHook: 'O som uivante do vento cortando entre as fachadas espelhadas de quinhentos metros de altura, arremessando folhas de jornal contra vitrines blindadas.',
    environmentalHazard: 'Rajadas violentas repentinas em esquinas podem desestabilizar drones leves e empurrar pessoas desatentas para a frente de carros corporativos blindados.',
  },
  heywood: {
    districtId: 'heywood',
    districtName: 'Heywood (The Glen, Vista del Rey, Wellsprings)',
    localAtmosphere: 'Vapor de asfalto quente subindo de avenidas largas, misturado ao cheiro de óleo queimado de lowriders e chuva batendo em estátuas de concreto de Santa Muerte.',
    sensoryHook: 'Goteiras rítmicas caindo de viadutos rodoviários colossais sobre cortiços e garagens mecânicas onde ecoam músicas latinas sintetizadas.',
    environmentalHazard: 'Bueiros antigos transbordam com rapidez em tempestades, cobrindo cruzamentos com lama química escorregadia.',
  },
  pacifica: {
    districtId: 'pacifica',
    districtName: 'Pacifica (Coastview, West Wind Estate)',
    localAtmosphere: 'Ventos atlânticos ferozes e maresia salgada batendo sem trégua nas carcaças de concreto abandonadas de hotéis inacabados e parques temáticos em ruínas.',
    sensoryHook: 'O ranger metálico ensurdecedor de guindastes de construção abandonados girando no vento como esqueletos de ferro rangendo na escuridão.',
    environmentalHazard: 'Respingos marinhos salgados aceleram a ferrugem de armas expostas e infiltrações d’água em túneis subterrâneos geram risco de choque elétrico.',
  },
  santo_domingo: {
    districtId: 'santo_domingo',
    districtName: 'Santo Domingo (Arroyo, Rancho Coronado)',
    localAtmosphere: 'Fumaça amarelada contínua das chaminés de refinarias e micro-partículas de plástico queimado no ar criam uma névoa espessa que queima a garganta.',
    sensoryHook: 'O sol se põe com uma cor marrom-acobreada doentia atrás das chaminés fumegantes, cobrindo os telhados idênticos de Rancho Coronado com fuligem.',
    environmentalHazard: 'Níveis de smog químico severo que exigem testes de resistência física para quem corre a pé sem máscara.',
  },
  badlands: {
    districtId: 'badlands',
    districtName: 'The Badlands / South Night City',
    localAtmosphere: 'Calor sufocante e árido do deserto de dia e frio cortante à noite, com vendavais que levantam tempestades de areia vermelha e lixo tóxico arrastado.',
    sensoryHook: 'A linha do asfalto da Interestadual ondula com o calor escaldante sob um sol cegante, quebrada apenas pela silhueta de turbinas eólicas e carcaças queimadas.',
    environmentalHazard: 'Tempestades de poeira que cegam sensores térmicos e óticos desprotegidos e desgastam filtros de ar de veículos em alta velocidade.',
  },
};

export interface UrbanEvent {
  id: string;
  title: string;
  zone: string;
  description: string;
  mechanics: string;
  hook: string;
}

export const urbanEventsList: UrbanEvent[] = [
  {
    id: 'militech-blockade',
    title: 'Bloqueio Armado da Militech',
    zone: 'Watson ou Corporate Center',
    description: 'Comboio militarizado de AVs e veículos blindados fechou uma avenida inteira com barricadas retráteis, revistando cidadãos sob pretexto de caça a terroristas.',
    mechanics: 'Passar pelo bloqueio exige suborno de 100eb (Fixer/Streetwise DV13) ou teste de Dissimulação / Furtividade DV15. Armas visíveis são confiscadas a menos que o porte corporativo seja válido.',
    hook: 'Um mensageiro ferido tenta passar um chip de dados escondido no bolso de um dos Edgerunners enquanto é empurrado pelos soldados.',
  },
  {
    id: 'ziggurat-outage',
    title: 'Queda de Servidor da Ziggurat',
    zone: 'Cidade Inteira',
    description: 'O Data Pool local sofre lentidão catastrófica; feeds de Realidade Aumentada (AR) piscam com estática e propagandas corrompidas.',
    mechanics: 'Testes de Biblioteca/Pesquisa no Data Pool têm penalidade de -3. Pagamentos digitais demoram 1d10 rodadas para autenticar.',
    hook: 'Durante a queda temporária de criptografia, arquivos confidenciais de executivos vazam em canais abertos de BBS.',
  },
  {
    id: 'food-riot',
    title: 'Revolta da Fome por Ração Kibble',
    zone: 'Santo Domingo ou Heywood',
    description: 'Um carregamento de comida fresca e ração sintetizada da Continental Brands atrasou, gerando motim popular em frente a um armazém da OASIS.',
    mechanics: 'Multidão enfurecida atua como terreno difícil e zona de perigo: teste de Atletismo DV13 para não ser pisoteado (2d6 de dano de contusão). Gás lacrimogêneo lançado pela polícia privada.',
    hook: 'O gerente do armazém oferece 1.000eb para quem escoltar seu carro pessoal para fora do cerco com segurança.',
  },
  {
    id: 'petrochem-leak',
    title: 'Vazamento Químico Petroquímico',
    zone: 'Industrial ou Badlands',
    description: 'Duto clandestino de CHOOH2 ou solventes pesados explodiu em um beco, liberando uma névoa inflamável e venenosa ao nível do chão.',
    mechanics: 'Qualquer faísca ou disparo de arma de fogo acende a fumaça gerando explosão de 6d6 em área de 10x10m. Sem máscara, DV13 Resist Torture/Drugs para evitar náuseas.',
    hook: 'Gangers locais estão recolhendo recipientes do produto para vender como droga sintética e atacam quem se aproximar.',
  },
  {
    id: 'trauma-evac',
    title: 'Extração de Alto Risco do Trauma Team',
    zone: 'Pacifica ou Old Combat Zone',
    description: 'Uma AV-4 de resgate desceu em emergência sob fogo pesado de foguetes caseiros de gangers para retirar um cliente com conta Platinum.',
    mechanics: 'Solos do Trauma Team estabelecem perímetro de fogo de supressão automático (DV17 Autofire). Qualquer um na linha de visão é alvejado sem aviso prévio.',
    hook: 'O piloto da AV-4 foi baleado e a nave está presa no teto; os médicos transmitem um pedido de reforço pago no canal aberto de emergência.',
  },
  {
    id: 'ncpd-sweep',
    title: 'Varredura Noturna do DPNC (NCPD Sweep)',
    zone: 'Little China ou The Glen',
    description: 'Dezenas de viaturas com sirenes abertas e holofotes aéreos isolam um quadrante caçando membros do Maelstrom que roubaram suprimentos médicos.',
    mechanics: 'Toque de recolher imposto. Qualquer pessoa na rua após às 22h é parada para identificação facial (Agente com Cidadania Legal DV13 ou prisão preventiva).',
    hook: 'Um membro ensanguentado dos Valentinos se esconde atrás da van dos PJs implorando por abrigo.',
  },
];
