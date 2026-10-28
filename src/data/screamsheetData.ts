export interface ScreamsheetArticle {
  network: string;
  category: 'Plantão Urgente' | 'Crime & Corrupção' | 'Tecnologia & Escândalo' | 'Anúncio de Mercenários (Gig)';
  headline: string;
  intro: string;
  body: string;
  conclusion: string;
  hiddenGigHook: {
    client: string;
    target: string;
    payout: string;
    objective: string;
    dangerLevel: string;
  };
  citation: string;
}

export const SCREAMSHEET_NETWORKS = [
  { name: 'Rede de Notícias 54 (Network News 54)', bias: 'Corporativa / Sensacionalista / Alta Audiência' },
  { name: 'Serviço Mundial de Notícias (World News Service - WNS)', bias: 'Global / Conservadora / Foco Financeiro' },
  { name: 'Night City Today', bias: 'Jornalismo de Rua / Escândalos Locais / Cidade Baixa' },
  { name: 'Vendetta Press', bias: 'Prensa Clandestina / Anti-Corporativa / Pirata' },
];

export const SCREAMSHEET_TEMPLATES = [
  {
    category: 'Plantão Urgente',
    headlines: [
      'EXPLOSÃO NO CENTRO CORPORATIVO: SABOTAGEM OU FALHA DE GERADOR?',
      'TIROTEIO NA LINHA DO MONOTRILHO DEIXA 14 FERIDOS E TRÂNSITO PARALISADO',
      'CARREGAMENTO DE KIBBLE SAQUEADO POR GANGUE EM RANCHO CORONADO',
      'ALERTA DA TRAUMA TEAM: FALSIFICAÇÃO EM MASSA DE CARTÕES PLATINUM',
    ],
    intros: [
      'As primeiras horas da manhã foram sacudidas por um violento estrondo que ecoou através de vários quarteirões.',
      'Uma testemunha ocular gravou em seu Agente o momento em que homens armados mascarados interceptaram o comboio de segurança.',
      'Segundo porta-vozes do Departamento de Polícia de Night City, a situação foi classificada como "anomalia sob contenção temporária".',
    ],
    bodies: [
      'Relatórios internos vazados indicam que o alvo da operação não era dinheiro físico, mas um protótipo de pesquisa confidencial transferido sem escolta reforçada.',
      'Testemunhas relataram ter visto drones táticos de fabricação estrangeira derrubando as câmeras de tráfego segundos antes do início dos disparos.',
      'Gangers com implantes ópticos carmesins foram vistos carregando caixotes metálicos com o logo da Militech antes de sumirem na fumaça do bueiro.',
    ],
    conclusions: [
      'Enquanto a diretoria corporativa nega qualquer vazamento crítico, ações de empresas subsidiárias despencaram 8% na Bolsa de Tóquio.',
      'O DPNC estabeleceu um cordão de isolamento em um raio de cinco quarteirões e promete varreduras rigorosas nas próximas 48 horas.',
      'Até o momento, nenhum grupo assumiu a responsabilidade pelo incidente, mas boatos nas BBS apontam para vingança pessoal entre Fixers rivais.',
    ],
    gigs: [
      {
        client: 'Executivo Anônimo da Petrochem',
        target: 'Recuperar o disco rígido roubado na confusão',
        payout: '1.500eb por Edgerunner',
        objective: 'Invadir o esconderijo da gangue nos esgotos e trazer o disco antes que os dados sejam descriptografados.',
        dangerLevel: 'Médio',
      },
      {
        client: 'Detetive Frustrado do DPNC',
        target: 'Eliminar o líder dos sabotadores discretamente',
        payout: '1.000eb + passe de imunidade local',
        objective: 'Fazer o líder da gangue desaparecer para que o caso seja arquivado sem respingar na corregedoria.',
        dangerLevel: 'Alto',
      },
    ],
  },
  {
    category: 'Tecnologia & Escândalo',
    headlines: [
      'RECALL DE IMPLANTES NEURAIS: 200 USUÁRIOS RELATAM ALUCINAÇÕES RECORRENTES',
      'INTELIGÊNCIA ARTIFICIAL ROGUE EM VENDING MACHINE AMEAÇA CLIENTES EM KABUKI',
      'VAZAMENTO DE DADOS: SEGREDOS DE BIODIVERSIDADE DA BIOTECHNICA NA DARKNET',
      'NOVA DROGA "SYNTH-DREAM" CAUSA PARALISIA TEMPORÁRIA EM BOATES DA MODA',
    ],
    intros: [
      'O que começou como uma atualização de firmware de rotina transformou-se em um pesadelo neurológico para dezenas de cidadãos.',
      'Rumores que circulam nos corredores de Japantown foram confirmados ontem à noite após a prisão de um técnico desonesto.',
      'Um arquivo criptografado de 40 Terabytes foi disponibilizado em rede P2P livre contendo memorandos estarrecedores.',
    ],
    bodies: [
      'Especialistas em cibernética alertam que os circuitos adulterados contêm um backdoor que permite a gravação passiva de memórias dos usuários.',
      'A substância apreendida causa aumento temporário nos reflexos ao custo de danos severos e permanentes à estabilidade psicológica.',
      'Segundo fontes do hospital municipal, os pacientes deram entrada repetindo frases em um dialeto militar extinto.',
    ],
    conclusions: [
      'A empresa responsável emitiu uma nota afirmando que se trata de uma campanha de difamação orquestrada por concorrentes sem escrúpulos.',
      'Vítimas lesadas estão se organizando em fóruns clandestinos prometendo retaliação armada contra a sede da clínica.',
      'O valor das ações de biotecnologia oscilou bruscamente enquanto a diretoria convocou reunião de emergência com seus Solos.',
    ],
    gigs: [
      {
        client: 'Médico Whistleblower (Denunciante)',
        target: 'Extrair a cobaia humana sobrevivente da clínica de testes',
        payout: '2.000eb por pessoa',
        objective: 'Tirar o paciente do terceiro andar do laboratório e levá-lo a um acampamento nômade nos Badlands.',
        dangerLevel: 'Extremo',
      },
    ],
  },
  {
    category: 'Anúncio de Mercenários (Gig)',
    headlines: [
      'CONTRATO DE RETIRADA DISCRETA: PROFISSIONAIS COM DISCRETION EXIGIDOS',
      'ESCOLTA PESADA PARA CARAVANA DOS BADLANDS: EDDIES GARANTIDOS',
      'RECUPERAÇÃO DE ATIVOS ROUBADOS NA ZONA DE COMBATE: PAGAMENTO NO ATO',
    ],
    intros: [
      'Um anúncio criptografado apareceu nos murais digitais do bar Afterlife com autorização expressa da gerência.',
      'Intermediário com credenciais corporativas comprovadas busca equipe autônoma para serviço de alta precisão.',
      'Aviso de utilidade para Edgerunners experientes: missão de alto risco com janela de oportunidade de 12 horas.',
    ],
    bodies: [
      'O trabalho envolve penetração em instalação secundária com segurança mista, extração de item físico e retorno sem baixas colaterais civis.',
      'A rota de viagem cruzará território disputado por três gangues diferentes que estão em trégua frágil.',
      'Equipamento especializado de arrombamento de portas de código ou habilidades avançadas de Netrunning serão diferenciais indispensáveis.',
    ],
    conclusions: [
      'Interessados devem comparecer ao ponto de encontro indicado portando uma rosa sintética preta na lapela para reconhecimento.',
      'Perguntas desnecessárias resultarão no cancelamento automático do convite e queima de pontes no submundo.',
      'Metade do pagamento adiantado mediante verificação de histórico em combate.',
    ],
    gigs: [
      {
        client: 'Rogue Amendiares / Contato no Afterlife',
        target: 'Infiltração e extração limpa',
        payout: '2.500eb por operador',
        objective: 'Completar o serviço sem acionar alarmes gerais nem matar guardas que não estejam armados.',
        dangerLevel: 'Alto',
      },
    ],
  },
];
