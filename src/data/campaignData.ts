export interface BeatTemplate {
  beatType: 'Hook' | 'Development' | 'Cliffhanger' | 'Twist' | 'Climax' | 'Resolution';
  titlePt: string;
  objective: string;
  tips: string;
  prompts: string[];
}

export const BEAT_CHART_STRUCTURE: BeatTemplate[] = [
  {
    beatType: 'Hook',
    titlePt: '1. O Gancho (The Hook)',
    objective: 'Apresentar a proposta de trabalho ou incidente perturbador que arrasta os personagens para a trama.',
    tips: 'Faça a oferta ter um elemento de urgência e envolva um contato pessoal ou um pagamento tentador.',
    prompts: [
      'Um Fixer de confiança liga às 3h da manhã com uma proposta irrecusável que expira em duas horas.',
      'Uma testemunha ensanguentada desmaia na entrada do apartamento dos personagens segurando um chip criptografado.',
      'Um antigo amigo de infância dos Nômades pede socorro após ter sua carga confiscada por guardas corruptos.',
      'Um executivo em desgraça oferece ações corporativas secretas em troca de uma rota de fuga limpa da cidade.',
    ],
  },
  {
    beatType: 'Development',
    titlePt: '2. Desenvolvimento (The Development)',
    objective: 'Investigação, reconhecimento do terreno, coleta de recursos e primeiro contato com a oposição.',
    tips: 'Permita que diferentes perícias (Netrunning, Streetwise, Human Perception, Furtividade) brilhem.',
    prompts: [
      'A equipe precisa invadir a rede local de um armazém em Kabuki para roubar a planta de segurança do prédio.',
      'Interrogar um técnico de câmeras de segurança em uma boate lotada enquanto evitam chamar a atenção dos seguranças.',
      'Negociar a compra de uniformes e crachás falsificados com um contrabandista de Heywood que exige um favor em troca.',
      'Fazer vigília noturna para mapear o padrão de patrulhas e trocas de turno da escolta armada.',
    ],
  },
  {
    beatType: 'Cliffhanger',
    titlePt: '3. O Gancho Dramático (The Cliffhanger)',
    objective: 'Uma complicação repentina que eleva a aposta e ameaça arruinar o plano antes da execução.',
    tips: 'Crie uma sensação de pressão imediata: o tempo está acabando ou o perigo é iminente.',
    prompts: [
      'A sirene do prédio dispara inesperadamente: o cliente foi preso ou a carga foi movida para outro setor com 1 hora de antecedência!',
      'Um esquadrão rival de Solos chega ao mesmo local exatamente com a mesma missão!',
      'O sistema de câmeras reconhece o rosto de um dos personagens e tranca todas as saídas de emergência com portas corta-fogo blindadas.',
      'Uma chuva ácida severa começa a corroer os veículos de fuga enquanto tiros são disparados do telhado vizinho.',
    ],
  },
  {
    beatType: 'Twist',
    titlePt: '4. A Reviravolta (The Twist)',
    objective: 'Uma revelação chocante que subverte as expectativas dos personagens sobre o contratante ou o objetivo.',
    tips: 'O cyberpunk vive da quebra de confiança. Quem parecia vítima pode ser o vilão.',
    prompts: [
      'A carga não é um chip de dados, mas uma criança clonada ou um cientista sequestrado que implora para não ser entregue.',
      'O Fixer que contratou a equipe vendeu a localização do ponto de entrega para a corporação inimiga para limpar suas próprias dívidas.',
      'O alvo a ser eliminado é um familiar direto ou um aliado jurado de um dos membros da equipe.',
      'A inteligência corporativa revela que a missão era apenas uma distração calculada para encobrir um golpe maior no outro lado da cidade.',
    ],
  },
  {
    beatType: 'Climax',
    titlePt: '5. O Clímax (The Climax)',
    objective: 'O confronto decisivo: combate armado de alta intensidade, tiroteio de veículos ou invasão desesperada da fortaleza de dados.',
    tips: 'Use o ambiente a favor: tanques inflamáveis, guindastes oscilantes, neon quebrando e cabos elétricos caídos.',
    prompts: [
      'Tiroteio frenético no heliponto da cobertura sob tempestade de raios enquanto uma AV-4 tenta decolar.',
      'Perseguição em alta velocidade na autoestrada dos Badlands contra motos dos Tyger Claws e vans blindadas.',
      'Batalha desesperada na câmara dos servidores contra um ciborgue assassino com Sandevistan ativado.',
      'Encurralados em um galpão pegando fogo, tendo que segurar as ondas de inimigos enquanto a porta dos fundos é arrombada.',
    ],
  },
  {
    beatType: 'Resolution',
    titlePt: '6. A Resolução (The Resolution)',
    objective: 'Lidar com as consequências, receber o pagamento (ou cobrar a traição), tratar os feridos e calcular a reputação.',
    tips: 'Em Cyberpunk, vitórias são sempre agridoces. O que sobrou da equipe? Quem agora guarda rancor?',
    prompts: [
      'Pagamento efetuado com eddies limpos em um beco silencioso, mas com a promessa velada de que a corporação não esquecerá.',
      'A equipe precisa correr para um Ripperdoc de confiança antes que um dos companheiros morra por sangramento de ferimento crítico.',
      'A manchete do jornal do dia seguinte culpa a equipe por um massacre que eles não cometeram, elevando sua Reputação e atraindo o DPNC.',
      'Brinde agridoce no balcão do Afterlife lembrando dos amigos caídos na missão.',
    ],
  },
];

export interface SceneImprovTables {
  zones: { [key: string]: { sensory: { sights: string[]; sounds: string[]; smells: string[] } } };
  obstacles: string[];
  npcs: { name: string; role: string; demeanor: string; motivation: string }[];
  twists: string[];
}

export const SCENE_IMPROV_DATA: SceneImprovTables = {
  zones: {
    'Centro Corporativo': {
      sensory: {
        sights: ['Reflexos de painéis solares em vidros espelhados negros', 'Drones de segurança pairando silenciosos como abutres', 'Hologramas de luxo da Ziggurat projetados sobre a chuva'],
        sounds: ['Zumbido de turbinas de AVs cruzando os céus', 'Passos ritmados de guardas com botas polidas', 'Eco abafado de notícias da WNS em telões'],
        smells: ['Ar condicionado filtrado com ozônio sintético', 'Café expresso caro de grãos reais', 'Perfume caro de almíscar corporativo'],
      },
    },
    'Distrito Moderado / Subúrbio': {
      sensory: {
        sights: ['Varal de roupas estendido entre janelas de prédios de 6 andares', 'Luzes fluorescentes piscando sobre mercados de conveniência 24h', 'Câmeras de vigilância quebradas com fios pendurados'],
        sounds: ['Crianças jogando bola no asfalto rachado', 'Latidos de cães vira-latas e sirenes distantes de patrulha', 'Música reggaeton misturada com techno saindo de janelas abertas'],
        smells: ['Fritura de pastéis e comida de rua sintética', 'Gás de escapamento de CHOOH2 barato', 'Umidade de bueiro e lixo acumulado no calor'],
      },
    },
    'Zona de Combate': {
      sensory: {
        sights: ['Carcaças de carros queimados servindo de barricada em esquinas', 'Grafitis em spray fosforescente marcando território de gangues', 'Janelas sem vidro cobertas por placas de metal furadas de balas'],
        sounds: ['Estalo repentino de tiros de fuzil a três quarteirões', 'Vidros quebrando sob pneus de vans em fuga', 'Gargalhadas distorcidas de gangers acelerados por drogas'],
        smells: ['Pólvora queimada recente', 'Pneus derretendo em fogueiras de tambor de óleo', 'Odor adocicado e pútrido de carniça nos becos'],
      },
    },
    'Badlands': {
      sensory: {
        sights: ['Terra vermelha rachada estendendo-se até o horizonte montanhoso', 'Torres de extração de petróleo da Petrochem balançando lentamente', 'Redemoinhos de poeira soprados pelo vento seco'],
        sounds: ['Uivo constante do vento chicoteando lonas de tendas', 'Ronco grave de motores V8 customizados de carretas', 'Silêncio opulento e desolador do deserto'],
        smells: ['Poeira e areia quente', 'Gasolina sintética e óleo diesel', 'Fumaça de churrasco de lagartos do deserto'],
      },
    },
  },
  obstacles: [
    'Uma patrulha de drones com luzes estroboscópicas vasculha a rua caçando suspeitos.',
    'Um duto de vapor de alta pressão se rompeu bloqueando a travessia do beco.',
    'Dois gangers armados estão cobrando 50eb de pedágio para qualquer pedestre passar.',
    'A porta blindada do local está com a trava magnética travada em curto-circuito.',
    'Um bueiro transbordando com resíduos químicos venenosos forçando um contorno arriscado.',
    'Uma câmera corporativa inteligente com reconhecimento facial está cobrindo o portão de entrada.',
  ],
  npcs: [
    { name: 'Kira "Glitch" Chen', role: 'Netrunner Freelancer', demeanor: 'Nervosa, olhando constantemente sobre o ombro', motivation: 'Tentando despistar um rastreamento de ICE corporativo.' },
    { name: 'Sargento Diego Ramos', role: 'Detetive Cansado do DPNC', demeanor: 'Cínico, mascando chiclete sintético com terno amassado', motivation: 'Apenas querendo terminar o turno sem ter que preencher relatório de tiroteio.' },
    { name: 'Milo "Faísca" Santos', role: 'Mecânico de Rua / Techie', demeanor: 'Hiperativo, com ferramentas elétricas presas no cinto', motivation: 'Procurando peças raras de alternador em sucatas.' },
    { name: 'Vee', role: 'Fixer Novata de Heywood', demeanor: 'Ambiciosa, falando rápido ao telefone', motivation: 'Tentando fechar seu primeiro grande contrato de escolta.' },
  ],
  twists: [
    'O alvo ou contato esperado acabou de ser arrastado para dentro de uma van preta sem placas.',
    'O alarme de chuva ácida da defesa civil começa a soar ensurdecedor nos postes de rua.',
    'Uma mala abandonada na calçada começa a emitir um bipe eletrônico acelerado de contagem regressiva.',
    'Um membro da gangue reconhece um dos Edgerunners de um tiroteio no mês anterior.',
  ],
};

export interface RoleHustleTier {
  role: string;
  rank1to4: { formula: string; average: number; description: string };
  rank5to7: { formula: string; average: number; description: string };
  rank8to10: { formula: string; average: number; description: string };
}

export const ROLE_HUSTLES: RoleHustleTier[] = [
  {
    role: 'Solo (Mercenário de Combate)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Segurança de boate local, guarda-costas de Fixer novato, cobrança de pequenas dívidas.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Contratos corporativos de escolta tática, treinamento de milícias de bairro, resgates armados.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Trabalho de assassinato de elite, consultoria tática para a diretoria da Arasaka/Militech.' },
  },
  {
    role: 'Netrunner (Invasor de Rede)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Limpeza de vírus em cyberdecks caseiros, cópias piratas de braindance, invasão de câmeras de trânsito.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Quebra de fortalezas de dados corporativas secundárias, venda de dados confidenciais a Fixers.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Incursões profundas na Blackwall, roubo de protótipos de IAs militares, contra-espionagem global.' },
  },
  {
    role: 'Tech (Técnico / Engenheiro)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Reparo de armas de mooks, desbloqueio de celulares roubados, conserto de eletrodomésticos.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Customização de armas excelentes, blindagem de veículos nômades, fabricação de munição especial.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Invenção de cibernéticos revolucionários e exoesqueletos militares para o mercado negro.' },
  },
  {
    role: 'Medtech (Médico / Ripperdoc)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Costurar ferimentos de bala em becos, receitar antibióticos clandestinos, remoção rápida de projéteis.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Instalação de ciberbraços e olhos cibernéticos, estabilização cirúrgica de gangers baleados.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Cirurgias cerebrais de alta complexidade, síntese de farmacêuticos exclusivos, implantes de bioware militar.' },
  },
  {
    role: 'Fixer (Corretor de Mercado)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Intermediar venda de armas leves usadas, arranjar ingressos falsos para festas, favores de rua.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Organizar mercados noturnos (Night Markets), intermediar contratações de mercenários para corporações.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Monopolizar o comércio de armas pesadas de um distrito inteiro, influenciar eleições municipais.' },
  },
  {
    role: 'Nomad (Nômade)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Transporte de carga seca entre postos dos Badlands, batedor de estrada, reparos mecânicos de caravana.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Contrabando de tecnologia através de fronteiras blindadas, escolta pesada de comboios de água.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Comandar um clã nômade inteiro com esquadrões de AVs e comboios de guerra terrestres.' },
  },
  {
    role: 'Rockerboy (Músico Rebelde)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Shows em bares imundos de subsolo, venda de fitas de áudio piratas, apresentações de rua.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Atração principal em casas de show de médio porte, patrocínios de marcas de refrigerante.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Megashows no Estádio de Night City, liderar protestos que derrubam leis corporativas.' },
  },
  {
    role: 'Media (Jornalista Investigativo)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Artigos freelancer para tablóides de fofocas, fotos de acidentes de trânsito para screamsheets.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Reportagens investigativas exclusivas de corrupção corporativa, documentários para a Rede 54.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Âncora nacional da WNS com audiência de milhões e proteção jurídica integral.' },
  },
  {
    role: 'Lawman (Policial / Agente da Lei)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Turnos extras de patrulha a pé no frio, atendimento de ocorrências domésticas perigosas.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Comandar operações de batida policial em pontos de drogas, resolver casos arquivados de homicídio.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Capitão da Divisão de Crimes Corporativos ou Comandante de Esquadrão Tático da MaxTac.' },
  },
  {
    role: 'Exec (Executivo Corporativo)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Supervisão de relatórios contábeis, gerenciamento de estagiários de fábrica, horas extras de escritório.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Diretor de projetos corporativos confidenciais, aprovação de orçamentos de segurança armada.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Vice-presidente de divisão executiva com jatos corporativos e residência em North Oak.' },
  },
];

export interface LifeEventRoll {
  d10: number;
  title: string;
  category: 'Finanças' | 'Inimigos' | 'Romance' | 'Cibernéticos' | 'Sorte na Rua';
  description: string;
  mechanicalImpact: string;
}

export const RANDOM_LIFE_EVENTS: LifeEventRoll[] = [
  {
    d10: 1,
    title: 'Cobrança Agressiva de Dívida Antiga',
    category: 'Finanças',
    description: 'Um agiota ou banco de corpos lembrou de uma dívida de 500eb com juros abusivos e mandou cobradores quebrarem os vidros da sua casa.',
    mechanicalImpact: 'Pagar 500eb imediatamente ou sofrer emboscada armada no próximo trabalho.',
  },
  {
    d10: 2,
    title: 'Achado de Ouro no Lixo Tecnológico',
    category: 'Sorte na Rua',
    description: 'Você encontrou uma caixa abandonada de componentes eletrônicos descartados por um laboratório que vale um bom dinheiro.',
    mechanicalImpact: 'Recebe +300eb livres para a carteira.',
  },
  {
    d10: 3,
    title: 'Falha Rejeição Biológica de Ciberware',
    category: 'Cibernéticos',
    description: 'Um dos seus implantes começou a rejeitar tecidos orgânicos provocando dores lancinantes e febre alta.',
    mechanicalImpact: 'Gasta 100eb em medicamentos imunossupressores ou sofre penalidade de -1 em testes de Físico (BODY/MOVE) por 1 semana.',
  },
  {
    d10: 4,
    title: 'Inimigo Antigo Ressurge das Sombras',
    category: 'Inimigos',
    description: 'Aquele gangster ou capanga corporativo que você humilhou no passado agora é líder de esquadrão e jurou vingança.',
    mechanicalImpact: 'Gera um Inimigo de nível Tenente ativo na campanha que monitora os passos da equipe.',
  },
  {
    d10: 5,
    title: 'Caso de Amor Tóxico ou Intenso',
    category: 'Romance',
    description: 'Você se envolveu romanticamente com alguém charmoso, mas que carrega uma bagagem de problemas e dívidas com o submundo.',
    mechanicalImpact: 'Ganha um contato amoroso, mas rola na tabela de Complicações de Namoro a cada mês.',
  },
  {
    d10: 6,
    title: 'Aumento Repentino no Aluguel',
    category: 'Finanças',
    description: 'O proprietário da sua quitinete ou container foi comprado por um conglomerado imobiliário que dobrou a taxa de condomínio.',
    mechanicalImpact: 'O aluguel deste mês custa +200eb adicionais.',
  },
  {
    d10: 7,
    title: 'Contato Valioso no Submundo',
    category: 'Sorte na Rua',
    description: 'Você ajudou um técnico de telecomunicações bêbado a não ser assaltado, e ele virou seu amigo leal.',
    mechanicalImpact: 'Ganha um contato com Perícia Electronics/Security Tech 14 para consultas gratuitas.',
  },
  {
    d10: 8,
    title: 'Caçada por Identidade Falsa',
    category: 'Inimigos',
    description: 'O DPNC descobriu que seu crachá de cidadania é forjado e emitiu uma ordem de verificação de antecedentes.',
    mechanicalImpact: 'Deve evitar viaturas da polícia ou pagar 150eb a um Fixer para limpar o registro.',
  },
  {
    d10: 9,
    title: 'Aposta Sortuda no Pachinko',
    category: 'Finanças',
    description: 'Uma noite regada a cerveja em Japantown rendeu um jackpot inacreditável em uma máquina de caça-níqueis adulterada.',
    mechanicalImpact: 'Ganha +400eb imediatos.',
  },
  {
    d10: 10,
    title: 'Fama e Reconhecimento nas Ruas',
    category: 'Sorte na Rua',
    description: 'Um vídeo gravado por um transeunte mostrando sua atuação profissional viralizou no Data Pool de Night City.',
    mechanicalImpact: '+1 ponto permanente de Reputação pública.',
  },
];
