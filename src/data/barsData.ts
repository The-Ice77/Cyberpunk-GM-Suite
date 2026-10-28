export interface BarVenue {
  id: string;
  name: string;
  district: string;
  aesthetic: string;
  musicStyle: string;
  clientele: string;
  securityRating: 'Nenhuma (Faroeste)' | 'Baixa' | 'Média' | 'Pesada / Militar';
  signatureDrink: {
    name: string;
    cost: string;
    description: string;
    inGameEffect: string;
  };
  localRumors: string[];
  citation: string;
}

export const NIGHT_CITY_BARS: BarVenue[] = [
  {
    id: 'afterlife',
    name: 'The Afterlife (O Pós-Vida)',
    district: 'Watson (Little China - Antigo necrotério)',
    aesthetic: 'Iluminação âmbar fosca, mesas de aço polido onde outrora ficavam macas de autópsia, cabines de conferência à prova de som e telas com obituários de Solos.',
    musicStyle: 'Industrial frio, batidas graves compassadas e rock clássico dos anos 2020.',
    clientele: 'Solos lendários, Fixers de elite (Rogue), Netrunners veteranos e mercenários com nome na praça.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'Johnny Silverhand / David Martinez',
      cost: '100eb (Premium)',
      description: 'Dose dupla de tequila envelhecida com um toque de cerveja mexicana amarga, pimenta chilli na borda e gelo seco.',
      inGameEffect: '+1 em testes de Frieza (COOL / Facedown) pela próxima hora; sensação de audácia e adrenalina.',
    },
    localRumors: [
      'Dizem que Rogue está contratando uma equipe para resgatar dados de uma AV-4 que caiu na Baía Coronado semana passada.',
      'Um Solo famoso deixou uma encomenda paga no armário #14 antes de desaparecer na Hot Zone.',
      'A Arasaka colocou uma recompensa de 50.000eb na cabeça de quem vazar o plano de rota da diretora Hanako.',
    ],
    citation: 'CP:R p. 308 • CP2020 p. 232 • Mixing Drinks p. 4',
  },
  {
    id: 'totentanz',
    name: 'Totentanz (Dança da Morte)',
    district: 'Watson (Northside / NID)',
    aesthetic: 'Prédio decrépito de 5 andares; canos estourados jorrando vapor sobre a pista de mosh; piso manchado de sangue seco e fiação exposta; cadáveres às vezes deixados encostados na parede.',
    musicStyle: 'Neo-Trash Metal, Death Industrial ensurdecedor e sirenes distorcidas com mais de 120 decibéis.',
    clientele: 'Maelstrommers com visores sangrentos, boosters ensandecidos, ciberpsicopatas em busca de briga e góticos cibernéticos.',
    securityRating: 'Nenhuma (Faroeste)',
    signatureDrink: {
      name: 'Black Acid Boiler',
      cost: '20eb (Everyday)',
      description: 'CHOOH2 destilado com licor de absinto sintético e uma gota de solvente industrial.',
      inGameEffect: 'DV13 Resist Torture/Drugs. Se passar, ignora penalidades de ferimento por 10 minutos. Se falhar, fica enjoado.',
    },
    localRumors: [
      'Pelo menos duas pessoas são mortas no mosh pit toda sexta-feira e os seguranças apenas jogam os corpos na caçamba.',
      'Um Ripperdoc do Maelstrom no terceiro andar está implantando garras de titânio roubadas a preço de banana.',
    ],
    citation: 'CP:R p. 308 • Mixing Drinks p. 8',
  },
  {
    id: 'el-coyote-cojo',
    name: 'El Coyote Cojo',
    district: 'Heywood (The Glen / Vista Del Rey)',
    aesthetic: 'Bar acolhedor e rústico com luzes amarelas quentes, fotos de veteranos de guerra nas paredes, bandeiras tricolores e cheiro de carnitas frescas preparadas por Mama Welles.',
    musicStyle: 'Mariachi moderno com sintetizadores, Cumbia e clássicos acústicos latinos.',
    clientele: 'Moradores locais de Heywood, membros dos Valentinos respeitando a trégua e trabalhadores de fábrica.',
    securityRating: 'Média',
    signatureDrink: {
      name: 'Coyote Especial',
      cost: '20eb (Everyday)',
      description: 'Tequila dourada da casa com suco de lima fresca, sal grosso e licor de pimenta.',
      inGameEffect: 'Concede +1 em testes sociais com a comunidade de Heywood; acolhimento caloroso.',
    },
    localRumors: [
      'Padre Ibarra está procurando alguém para recuperar o carro de um jovem do bairro que foi roubado pela 6th Street.',
      'Mama Welles guarda uma espingarda de dois canos sob o balcão que já derrubou três assassinos corporativos nos anos 30.',
    ],
    citation: 'CP:R p. 309 • Gang Guide p. 22',
  },
  {
    id: 'lizzies-bar',
    name: "Lizzie's Bar",
    district: 'Watson (Kabuki)',
    aesthetic: 'Neon rosa e roxo pulsante, estátuas de stripper cromadas, tacos de beisebol com pregos decorando o teto e cabines confortáveis de braindance privativo.',
    musicStyle: 'Synthwave sensual, Electro-Pop pesado e batidas eletrônicas dançantes.',
    clientele: 'Trabalhadores sexuais, artistas da noite, Fixers independentes e curiosos da vida noturna.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'Pink Moxie Fizz',
      cost: '50eb (Costly)',
      description: 'Refrigerante triti-fizz gaseificado com licor de romã e vodka com infusão de cafeína sintética.',
      inGameEffect: 'Restaura a concentração mental; cancela penalidade de sono atrasado por 4 horas.',
    },
    localRumors: [
      'As Moxes acabaram de instalar uma nova câmera de gravação de braindance de alta fidelidade que capturou um assassinato de um Executivo da Arasaka.',
      'Dois capangas dos Tyger Claws tentaram extorquir uma das dançarinas ontem e saíram de lá em sacos pretos.',
    ],
    citation: 'CP:R p. 308 • Mixing Drinks p. 11',
  },
  {
    id: 'the-short-circuit',
    name: 'The Short Circuit (Curto-Circuito)',
    district: 'Watson (Kabuki Market)',
    aesthetic: 'Telas verdes de fósforo antigas piscando código UNIX, cheiro de solda e estanho no ar, bancadas de trabalho compartilhadas ao lado das torneiras de cerveja.',
    musicStyle: 'Chiptune, sintetizadores analógicos 8-bit e ambient eletrônico meditativo.',
    clientele: 'Netrunners freelancers, Técnicos de hardware, contrabandistas de chips e nerds do Data Pool.',
    securityRating: 'Média',
    signatureDrink: {
      name: 'Overclock Blue',
      cost: '50eb (Costly)',
      description: 'Coquetel azul elétrico que brilha no escuro, misturado com nootrópicos e taurina pura.',
      inGameEffect: '+1 no próximo teste de Interface ou Cybertech realizado dentro de 30 minutos.',
    },
    localRumors: [
      'Um arquivo com os esquemas de defesa da subestação de energia de Watson está à venda por 800eb em um chip de memória colado embaixo da mesa 4.',
    ],
    citation: 'Mixing Drinks DLC p. 14',
  },
  {
    id: 'empathy',
    name: 'Club Empathy',
    district: 'City Center (Corporate Plaza)',
    aesthetic: 'Minimalismo escandinavo ultramoderno, mármore branco sintético, aquários gigantes com peixes mecânicos e névoa aromática que reduz a ansiedade dos clientes.',
    musicStyle: 'Lounge eletrônico sofisticado, jazz neo-clássico com saxofone holográfico.',
    clientele: 'Diretores de corporações, lobistas políticos, diplomatas e modelos com biosculpting perfeito.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'Synthetic Velvet Gold',
      cost: '500eb (Expensive)',
      description: 'Champanhe francês recriado molécula por molécula, com flocos de ouro comestível 24k e extrato de frutas reais.',
      inGameEffect: 'Concede +2 de bônus em testes de Etiqueta e Persuasão em círculos de alta classe.',
    },
    localRumors: [
      'Um diretor da Militech está tendo um caso com a esposa do chefe de segurança da Arasaka e se encontram toda terça-feira na cabine VIP 1.',
    ],
    citation: 'CP:R p. 290 • CP2020 p. 235',
  },
];
