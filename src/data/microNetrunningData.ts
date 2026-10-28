export interface MicroNetSystem {
  id: string;
  name: string;
  category: 'Terminal Urbano' | 'Dispositivo Móvel' | 'Segurança Local' | 'Veicular' | 'Médico & Infraestrutura';
  floorsCount: number;
  entryDV: number;
  description: string;
  floors: {
    level: number;
    name: string;
    type: 'password' | 'control' | 'file';
    dv: number;
    hackEffect: string;
  }[];
}

export const MICRO_NET_SYSTEMS: MicroNetSystem[] = [
  {
    id: 'vend-a-gun',
    name: 'Máquina Vend-A-Gun / Vending Machine Automática',
    category: 'Terminal Urbano',
    floorsCount: 2,
    entryDV: 6,
    description: 'Máquina automática de autoatendimento instalada em esquinas perigosas que vende pistolas descartáveis e refrigerante Triti-Fizz.',
    floors: [
      { level: 1, name: 'Senha do Painel de Manutenção', type: 'password', dv: 6, hackEffect: 'Destrava a interface de serviço e desativa o alarme sonoro.' },
      { level: 2, name: 'Nó de Controle da Gaveta de Dispensação', type: 'control', dv: 8, hackEffect: 'Ejeta todas as 1d6 pistolas baratas e o cofre de moedas (1d6x20eb) na calçada!' },
    ],
  },
  {
    id: 'patrol-drone',
    name: 'Drone de Patrulha Aéreo Leve (Militech Recon Fly)',
    category: 'Dispositivo Móvel',
    floorsCount: 2,
    entryDV: 8,
    description: 'Quadcóptero silencioso que patrulha becos gravando rostos e emitindo avisos de toque de recolher.',
    floors: [
      { level: 1, name: 'Link Criptografado de Controle de Voo', type: 'password', dv: 8, hackEffect: 'Interrompe a transmissão de vídeo para a central de vigilância.' },
      { level: 2, name: 'Nó de Controle dos Motores & Sensores', type: 'control', dv: 9, hackEffect: 'Força o pouso forçado imediato ou faz o drone colidir contra uma parede!' },
    ],
  },
  {
    id: 'maglock-door',
    name: 'Porta Blindada com Trava Magnética (Armazém Corporativo)',
    category: 'Segurança Local',
    floorsCount: 2,
    entryDV: 8,
    description: 'Chapa de aço pressurizada com leitor biométrico e trava de 5.000 Newtons.',
    floors: [
      { level: 1, name: 'Portão de Autenticação Biométrica', type: 'password', dv: 8, hackEffect: 'Engana o leitor fingindo um crachá de funcionário autorizado.' },
      { level: 2, name: 'Nó de Controle da Eletroímã de Pressão', type: 'control', dv: 8, hackEffect: 'Abre a porta silenciosamente ou tranca ela para impedir a perseguição de guardas.' },
    ],
  },
  {
    id: 'connected-vehicle',
    name: 'Sedã Executivo Conectado (Archer Hella Conectado)',
    category: 'Veicular',
    floorsCount: 3,
    entryDV: 8,
    description: 'Veículo com computador de bordo Autonav, travas remotas e piloto automático de emergência.',
    floors: [
      { level: 1, name: 'Firewall do Rádio CitiNet', type: 'password', dv: 8, hackEffect: 'Invade o canal de áudio e dados do rádio do carro.' },
      { level: 2, name: 'Nó de Controle de Travas & Airbags', type: 'control', dv: 9, hackEffect: 'Tranca as portas com os ocupantes dentro ou dispara o airbag na cara do motorista (-2 em ações).' },
      { level: 3, name: 'Nó do Módulo de Injeção de Freios', type: 'control', dv: 10, hackEffect: 'Corta o motor de CHOOH2 ou aciona os freios bruscamente em alta velocidade (teste DV15 Condução ou capota).' },
    ],
  },
  {
    id: 'mook-agent-phone',
    name: 'Smartphone / Agente de Capanga de Gangue',
    category: 'Dispositivo Móvel',
    floorsCount: 2,
    entryDV: 7,
    description: 'Celular holográfico com conversas de bate-papo, fotos comprometedoras e carteira digital.',
    floors: [
      { level: 1, name: 'Código PIN de 6 Dígitos', type: 'password', dv: 7, hackEffect: 'Desbloqueia a tela inicial sem alertar o dono.' },
      { level: 2, name: 'Arquivo: Mensagens Criptografadas do Fixer', type: 'file', dv: 8, hackEffect: 'Descobre o endereço do ponto de encontro secreto e a senha do galpão da gangue!' },
    ],
  },
  {
    id: 'hospital-bed',
    name: 'Unidade de Monitoramento Médico & Cama Cirúrgica',
    category: 'Médico & Infraestrutura',
    floorsCount: 2,
    entryDV: 8,
    description: 'Monitor hospitalar ligado a bolsas de anestésico e suporte de vida em uma clínica particular.',
    floors: [
      { level: 1, name: 'Senha do Terminal de Enfermagem', type: 'password', dv: 8, hackEffect: 'Suprime alertas visuais e sonoros de batimentos cardíacos.' },
      { level: 2, name: 'Nó de Controle da Bomba de Infusão', type: 'control', dv: 9, hackEffect: 'Administra sedativo pesado no paciente (desmaia por 1 hora) ou ejeta medicação de adrenalina.' },
    ],
  },
];
