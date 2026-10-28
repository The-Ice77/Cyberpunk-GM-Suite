# Cyberpunk GM Suite (Cyberpunk RED 2045 & Cyberpunk 2020)

Uma suíte web completa para Mestres de RPG de Mesa ambientados nos sistemas **Cyberpunk RED (2045)** e **Cyberpunk 2020**.

Interface limpa, moderna, minimalista e desconectada (inspirada em Vercel / Linear / Shadcn UI Dark Mode) preparada para deploy direto na **Vercel**.

---

## ⚡ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou yarn

### Executando Localmente
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar para Produção (Type check + Vite build)
npm run build
```

---

## 🎲 Arquitetura dos Módulos Independentes

### 1. Seletor Global de Sistema `[ RED (2045) | 2020 Clássico ]`
Alterna no topo da tela e recalcula automaticamente:
- **No RED:** 10 Atributos (`INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP`), cálculo de HP (`10 + 5 * ceil((BODY + WILL)/2)`), SP unificado (Cabeça e Corpo com ablação -1), Combat Number para capangas e arquitetura NET por andares de elevador.
- **No 2020:** 9 Atributos clássicos (`INT, REF, TEC, COOL, ATR, LUCK, MA, BODY, EMP`), Modificador de Tipo Corporal (`BTM` de -0 a -5), SP distribuído pelas 6 partes do corpo (`Cabeça, Tronco, Braço D/E, Perna D/E`) e Fortalezas de Dados com a Série Demônio (*Imp, Afreet, Succubus, Balron, Cão Infernal*).

---

### 2. Módulos & Categorias (Páginas Desconectadas)
- **Hub Inicial (`/`):** Dashboard limpo com visão geral de métricas, status do sistema ativo e bloco de notas persistente.
- **Categoria 1: Pessoas & Facções (`/people`):**
  - Gerador de Escalão: Capanga/Mook, Tenente, Mini-Chefe, Chefe/Ciberpsicopata.
  - Facções dos livros: Gangues (Maelstrom, Tyger Claws, Bozos, Piranhas, Inquisidores, 6th Street, Valentinos, Voodoo Boys, Red Chrome Legion, Posergangues), Trauma Team™ (Médico Chefe, Solo Pesado, Piloto AV-4), Mega-Corporações (Arasaka, Militech, Biotechnica, Kang Tao), Polícia (DPNC, Detetives, MaxTac) e Nômades/Civis.
  - Construtor Manual do Zero e Biblioteca com persistência em `localStorage`.
- **Categoria 2: Mundo & Night City (`/world`):**
  - Mapa Distrital Interativo (Corporate Center, Watson, Heywood, Westbrook, Santo Domingo, Pacifica, Combat Zones, Badlands) com nível de ameaça, tempo de resposta do DPNC e Trauma Team.
  - Clima Oficial (*Night City Weather DLC*): Tabelas sazonais 2d6, Chuva Ácida (-1 SP ablação/min), Tempestade de Cinzas (Poison e corpo estranho nos pulmões), Vendaval Radioativo e Apagões elétricos.
  - Encontros Aleatórios d100 (Diurnos e Noturnos) com sub-rolagens de complicações.
  - Bares Lendários (Afterlife, Totentanz, El Coyote Cojo, Lizzie's Bar, Club Empathy), Digital Dating (*Datepath*) e Manchetes *Screamsheets* com ganchos ocultos.
- **Categoria 3: Diretor de Campanha (`/campaign`):**
  - Arquiteto Beat Chart oficial: *Hook $\rightarrow$ Development $\rightarrow$ Cliffhanger $\rightarrow$ Twist $\rightarrow$ Climax $\rightarrow$ Resolution*.
  - Gerador de Improviso Rápido de Cenas (Visão, Sons, Cheiros, Obstáculo Imediato, NPC e Reviravolta).
  - Simulador de Timeskip & Downtime com tabelas oficiais de *Hustles* por Role/Rank, aluguel, custo de vida e eventos de vida aleatórios.
- **Categoria 4: Arsenal, Cromo, Veículos & Loot (`/arsenal`):**
  - Gerador de Saque por Abate (Eddies, munição, itens de bolso d100 do Data Pack e tabela de colheita de órgãos e cibernéticos do Banco de Corpos/Ripperdoc).
  - Catálogo de Armas e Implantes com filtros por sistema, categoria e preço.
  - Garagem Nômade com cálculo dinâmico de SDP e upgrades (blindagem, nitro, torre de metralhadora, pneus maciços).
- **Categoria 5: Netrunning (`/netrunning`):**
  - No RED: Elevador NET por andares com senhas (DVs), arquivos confidenciais, nós de controle de segurança e Black ICE (Hellhound, Giant, Liche, Kraken, Asp).
  - No 2020: Fortalezas de Dados com Muros de Dados, Portões de Código, CPUs, temas de Realidade Virtual e programas da Série Demônio.
- **Categoria 6: Códice de Regras & Citações (`/codex`):**
  - Busca instantânea em tempo real com fórmulas, tabelas oficiais e citações diretas de páginas dos manuais.

---

### 3. Utilitários Flutuantes (Drawers Retráteis)
- **Rolador de Dados Inteligente:**
  - `1d10` com Regra Explosiva oficial (10 explode e soma; 1 explode negativamente e subtrai).
  - `Xd6` para dano de armas com detecção automática de Ferimento Crítico (dois ou mais 6 no RED disparam o alerta de +5 dano direto aos PVs).
  - Histórico de rolagens limpo.
- **Rastreador de Combate & Ablação:**
  - Fila de Iniciativa com turno ativo e contador de rodadas.
  - Controle de HP com alerta de Gravemente Ferido (-2 em ações ao atingir &le; 50% HP) e Mortalmente Ferido (Salvaguarda da Morte).
  - Botão de 1-Clique de Ablação de SP (-1 SP) na Cabeça/Corpo (RED) ou nas 6 partes corporais (2020).
