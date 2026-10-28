import React, { useState } from 'react';
import {
  Utensils,
  Wine,
  Coins,
  Dices,
  Bot,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Package,
  Sparkles,
  Flame,
  Coffee,
  ShoppingBag,
  RefreshCw,
  X,
  Tag,
} from 'lucide-react';
import {
  StreetFoodItem,
  StreetDrinkItem,
  VenditGoodieItem,
  STREET_FOOD_TABLE,
  STREET_DRINKS_TABLE,
  VENDIT_MACHINE_TABLE,
  rollStreetFood,
  rollStreetDrink,
  rollVenditGoodie,
} from '../../data/chanceOfLifetimeData';
import { getEffectiveApiKey, callGeminiJSON } from '../../services/aiService';

export const StreetFoodDrinksSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'food' | 'drinks' | 'vendit'>('food');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Category Filters
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<string>('all');
  const [drinkCategoryFilter, setDrinkCategoryFilter] = useState<string>('all');
  const [venditCategoryFilter, setVenditCategoryFilter] = useState<string>('all');

  // Selected & Rolled Results (Hero Display)
  const [selectedFood, setSelectedFood] = useState<StreetFoodItem>(STREET_FOOD_TABLE[0]);
  const [selectedDrink, setSelectedDrink] = useState<StreetDrinkItem>(STREET_DRINKS_TABLE[0]);
  const [selectedVendit, setSelectedVendit] = useState<VenditGoodieItem>(VENDIT_MACHINE_TABLE[0]);
  const [rolledResult, setRolledResult] = useState<{
    type: 'food' | 'drinks' | 'vendit';
    item: any;
    rollD20: number;
  } | null>(null);

  // AI Generator State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);
  const [aiCulture, setAiCulture] = useState<string>('Japonesa / Asiática');
  const [aiItemType, setAiItemType] = useState<'food' | 'drink'>('food');
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Category Matchers
  const matchesFoodCategory = (food: StreetFoodItem, cat: string) => {
    if (cat === 'all') return true;
    const cult = (food.originCulture + ' ' + food.name + ' ' + food.description).toLowerCase();
    if (cat === 'asiatica') {
      return (
        cult.includes('japones') ||
        cult.includes('chines') ||
        cult.includes('corean') ||
        cult.includes('kabuki') ||
        cult.includes('asiátic') ||
        cult.includes('asiatic') ||
        cult.includes('malaia') ||
        cult.includes('vietnam') ||
        cult.includes('singapur') ||
        cult.includes('tailand')
      );
    }
    if (cat === 'latina') {
      return cult.includes('mexican') || cult.includes('latin') || cult.includes('heywood') || cult.includes('sul-american');
    }
    if (cat === 'brasileira') {
      return cult.includes('brasil') || cult.includes('tropical') || cult.includes('nigerian');
    }
    if (cat === 'americana') {
      return cult.includes('american') || cult.includes('continental') || cult.includes('feira') || cult.includes('kibble');
    }
    if (cat === 'rua') {
      return cult.includes('rua') || cult.includes('combate');
    }
    if (cat === 'outras') {
      return (
        cult.includes('egípc') ||
        cult.includes('egipc') ||
        cult.includes('médio') ||
        cult.includes('medio') ||
        cult.includes('nórdic') ||
        cult.includes('nordic') ||
        cult.includes('escandinav') ||
        cult.includes('indian') ||
        cult.includes('ingl')
      );
    }
    return true;
  };

  const matchesDrinkCategory = (drink: StreetDrinkItem, cat: string) => {
    if (cat === 'all') return true;
    const str = (drink.drinkType + ' ' + drink.name + ' ' + drink.description + ' ' + drink.originCulture).toLowerCase();
    if (cat === 'cocktails') {
      return str.includes('coquetel') || str.includes('drink') || str.includes('mistura') || str.includes('balcão') || str.includes('balcao') || str.includes('gim') || str.includes('martini') || str.includes('whisky');
    }
    if (cat === 'shots') {
      return str.includes('shot') || str.includes('destilado') || str.includes('vodka') || str.includes('licor') || str.includes('forte') || str.includes('chooh') || str.includes('cachaça') || str.includes('rum') || str.includes('pinga');
    }
    if (cat === 'quentes') {
      return str.includes('chá') || str.includes('cha') || str.includes('caldo') || str.includes('quente') || str.includes('sopa') || str.includes('café') || str.includes('cafe');
    }
    if (cat === 'refrescos') {
      return str.includes('refresco') || str.includes('cerveja') || str.includes('refrigerante') || str.includes('gelad') || str.includes('energético') || str.includes('energetico') || str.includes('suco') || str.includes('smoothie') || str.includes('água') || str.includes('agua') || str.includes('cidra');
    }
    return true;
  };

  const matchesVenditCategory = (vendit: VenditGoodieItem, cat: string) => {
    if (cat === 'all') return true;
    const c = (vendit.category + ' ' + vendit.name + ' ' + vendit.description).toLowerCase();
    if (cat === 'higiene') return c.includes('higiene') || c.includes('médico') || c.includes('medico') || c.includes('curativo') || c.includes('saúde') || c.includes('bucal');
    if (cat === 'sobrevivencia') return c.includes('sobrevivência') || c.includes('sobrevivencia') || c.includes('ferramenta') || c.includes('química') || c.includes('dormir') || c.includes('água') || c.includes('filtro');
    if (cat === 'tatico') return c.includes('tático') || c.includes('tatico') || c.includes('acessório') || c.includes('acessorio') || c.includes('armadilha') || c.includes('combate');
    if (cat === 'eletronicos') return c.includes('eletrônico') || c.includes('eletronico') || c.includes('brinquedo') || c.includes('sonoro') || c.includes('chip') || c.includes('bateria');
    if (cat === 'outros') return c.includes('vestuário') || c.includes('vestuario') || c.includes('propaganda') || c.includes('artesanato') || c.includes('botânica') || c.includes('botanica') || c.includes('pet') || c.includes('entretenimento');
    return true;
  };

  // Filtered Lists
  const filteredFoods = STREET_FOOD_TABLE.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.originCulture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && matchesFoodCategory(f, foodCategoryFilter);
  });

  const filteredDrinks = STREET_DRINKS_TABLE.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.originCulture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && matchesDrinkCategory(d, drinkCategoryFilter);
  });

  const filteredVendits = VENDIT_MACHINE_TABLE.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && matchesVenditCategory(v, venditCategoryFilter);
  });

  // Sorteios (Category-Aware + Full D20 Official)
  const handleRollFood = () => {
    let rolled: StreetFoodItem;
    if (foodCategoryFilter === 'all' || filteredFoods.length === 0) {
      rolled = rollStreetFood();
    } else {
      rolled = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
    }
    setSelectedFood(rolled);
    setRolledResult({
      type: 'food',
      item: rolled,
      rollD20: rolled.roll,
    });
  };

  const handleRollDrink = () => {
    let rolled: StreetDrinkItem;
    if (drinkCategoryFilter === 'all' || filteredDrinks.length === 0) {
      rolled = rollStreetDrink();
    } else {
      rolled = filteredDrinks[Math.floor(Math.random() * filteredDrinks.length)];
    }
    setSelectedDrink(rolled);
    setRolledResult({
      type: 'drinks',
      item: rolled,
      rollD20: rolled.roll,
    });
  };

  const handleRollVendit = () => {
    let rolled: VenditGoodieItem;
    if (venditCategoryFilter === 'all' || filteredVendits.length === 0) {
      rolled = rollVenditGoodie();
    } else {
      rolled = filteredVendits[Math.floor(Math.random() * filteredVendits.length)];
    }
    setSelectedVendit(rolled);
    setRolledResult({
      type: 'vendit',
      item: rolled,
      rollD20: rolled.roll,
    });
  };

  const handleOrder = (name: string, priceEb: number) => {
    setOrderToast(`Item adquirido na rua: ${name} por ${priceEb}eb. Adicionado aos consumíveis!`);
    setTimeout(() => setOrderToast(null), 3500);
  };

  // AI Generator Handler
  const handleGenerateAI = async () => {
    setIsAiLoading(true);
    const activeKey = getEffectiveApiKey();

    const prompt = `Você é o Co-Mestre de Cyberpunk RED especialista no suplemento "Chance of a Lifetime" (Street Food & Street Drinks of Night City).
Crie um item de comida ou bebida de rua inédito e saboroso com base em:
Tipo: ${aiItemType === 'food' ? 'Comida de Rua' : 'Bebida de Rua'} | Cultura / Inspiração: ${aiCulture} | Instruções: ${aiPrompt || 'Alimento popular barato dos becos de Night City'}.

Retorne EXCLUSIVAMENTE um objeto JSON válido:
${
  aiItemType === 'food'
    ? `{
  "roll": 99,
  "name": "Nome saboroso do prato de rua",
  "costEb": 4,
  "originCulture": "${aiCulture}",
  "servingStyle": "Forma como é servido na calçada (espeto, folha de bananeira sintética, copo térmico)",
  "description": "Descrição rica dos ingredientes sintéticos, fritura ou cozimento no vapor",
  "flavorNotes": "Notas de sabor, aromas e crocância"
}`
    : `{
  "roll": 99,
  "name": "Nome evocativo da bebida ou drink de rua",
  "costEb": 6,
  "originCulture": "${aiCulture}",
  "drinkType": "Destilado, refresco gelado, caldo ou chá quente",
  "description": "Descrição detalhada do preparo, ingredientes e temperatura",
  "effectsOrHangover": "Efeito no jogo ou ressaca da manhã seguinte"
}`
}`;

    const parsed = await callGeminiJSON<any>(prompt);
    if (parsed) {
      if (aiItemType === 'food') {
        setSelectedFood(parsed);
        setActiveSubTab('food');
        setRolledResult({ type: 'food', item: parsed, rollD20: 99 });
      } else {
        setSelectedDrink(parsed);
        setActiveSubTab('drinks');
        setRolledResult({ type: 'drinks', item: parsed, rollD20: 99 });
      }
      setIsAiLoading(false);
      return;
    }

    // Fallback
    if (aiItemType === 'food') {
      const fbFood: StreetFoodItem = {
        roll: 99,
        name: 'Gyoza Crocante de Algas e Carne Clonada de Kabuki',
        costEb: 4,
        originCulture: aiCulture,
        servingStyle: 'Bandeja com 5 unidades tostadas na chapa de ferro com molho shoyu e óleo de gergelim',
        description: 'Pastéis japoneses com base tostada e crocante, cozidos no vapor de caldo aromático e recheados com carne moída de porco clone.',
        flavorNotes: 'Interior fumegante e suculento com fundo picante de gengibre e alho.',
      };
      setSelectedFood(fbFood);
      setActiveSubTab('food');
      setRolledResult({ type: 'food', item: fbFood, rollD20: 99 });
    } else {
      const fbDrink: StreetDrinkItem = {
        roll: 99,
        name: 'Shot do Samurai Negro (Vodka com Xarope de Gengibre e Pimenta)',
        costEb: 8,
        originCulture: aiCulture,
        drinkType: 'Coquetel Forte de Balcão de Rua',
        description: 'Dose em copinho de bambu contendo vodka destilada em radiador com redução doce de gengibre selvagem e pimenta dedo-de-moça.',
        effectsOrHangover: '+1 em Iniciativa nos primeiros 10 minutos após o shot; queimação profunda na garganta.',
      };
      setSelectedDrink(fbDrink);
      setActiveSubTab('drinks');
      setRolledResult({ type: 'drinks', item: fbDrink, rollD20: 99 });
    }
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {orderToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-zinc-900 border border-emerald-500/60 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-medium">{orderToast}</span>
        </div>
      )}

      {/* Header and Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-500" />
            <span>Comida de Rua, Bebidas & Máquinas Vendit (Chance of a Lifetime)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tabelas oficiais com valores exatos em eurodólares (€/eb), sabores, preparos de rua e efeitos mecânicos para mercenários.
          </p>
        </div>

        {/* Subtabs Selector */}
        <div className="flex items-center gap-1 bg-[#14141a] border border-[#27272a] rounded-xl p-1 text-xs font-medium overflow-x-auto no-scrollbar max-w-full whitespace-nowrap shrink-0">
          <button
            onClick={() => setActiveSubTab('food')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'food'
                ? 'bg-orange-600 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Comidas de Rua (20)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('drinks')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'drinks'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            <span>Bebidas de Rua (20)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('vendit')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'vendit'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Máquinas Vendit 24h (20)</span>
          </button>
        </div>
      </div>

      {/* Main Action Toolbar */}
      <div className="space-y-3">
        {/* Roll Button depending on tab */}
        {activeSubTab === 'food' && (
          <button
            onClick={handleRollFood}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
          >
            <Dices className="w-4 h-4" />
            <span>Sortear Comida de Rua (D20 Oficial)</span>
          </button>
        )}

        {activeSubTab === 'drinks' && (
          <button
            onClick={handleRollDrink}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
          >
            <Dices className="w-4 h-4" />
            <span>Sortear Bebida de Rua (D20 Oficial)</span>
          </button>
        )}

        {activeSubTab === 'vendit' && (
          <button
            onClick={handleRollVendit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
          >
            <Dices className="w-4 h-4" />
            <span>Sortear Item de Máquina Vendit 24h (D20 Oficial)</span>
          </button>
        )}

        {/* AI Generator Option */}
        <div className="rounded-xl border border-orange-900/40 bg-orange-950/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-zinc-200">Opção Extra: Gerar Pedido Clandestino com IA (Gemini)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiOptions(!showAiOptions)}
              className="text-[11px] font-mono text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
            >
              <span>{showAiOptions ? 'Ocultar Opções' : 'Configurar com IA'}</span>
              {showAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showAiOptions && (
            <div className="space-y-3 pt-2 border-t border-orange-950/50 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Tipo de Pedido:</label>
                  <select
                    value={aiItemType}
                    onChange={e => setAiItemType(e.target.value as any)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="food">Comida de Rua (Snack / Prato Rápido)</option>
                    <option value="drink">Bebida de Rua (Coquetel / Chá / Destilado)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Cultura / Origem Culinária:</label>
                  <select
                    value={aiCulture}
                    onChange={e => setAiCulture(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Japonesa / Asiática (Kabuki)">Japonesa / Asiática (Kabuki)</option>
                    <option value="Mexicana / Latina (Heywood)">Mexicana / Latina (Heywood)</option>
                    <option value="Brasileira / Tropical">Brasileira / Tropical</option>
                    <option value="Americana de Rua (Kibble)">Americana de Rua (Kibble frito)</option>
                    <option value="Nômade dos Badlands">Nômade dos Badlands (Churrasco no tambor)</option>
                    <option value="Oriente Médio (Vista del Rey)">Oriente Médio (Vista del Rey)</option>
                    <option value="Escandinava / Nórdica">Escandinava / Nórdica (Glögg / Peixe seco)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Instruções Adicionais (Opcional):</label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Ex: Prato extremamente apimentado servido em lata de óleo, sopa reanimadora de ressaca..."
                  className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateAI}
            disabled={isAiLoading}
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <Bot className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'IA Cozinhando / Destilando Pedido...' : 'Gerar Pedido com IA'}</span>
          </button>
        </div>
      </div>

      {/* RESULTADO DO SORTEIO (HERO BANNER) */}
      {rolledResult && rolledResult.type === activeSubTab && (
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#1c130d] via-[#14121a] to-[#0c0c12] border-2 border-orange-500/80 shadow-[0_0_35px_rgba(249,115,22,0.25)] space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-orange-950/60">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-black font-mono font-black text-xs flex items-center gap-1 shadow">
                <Dices className="w-3.5 h-3.5" />
                <span>D20 #{rolledResult.rollD20}</span>
              </span>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                Resultado Oficial do Sorteio
              </span>
            </div>
            <button
              onClick={() => setRolledResult(null)}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800/60 transition"
              title="Fechar resultado"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span>{rolledResult.item.name}</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-0.5">
                {rolledResult.type === 'food' && (
                  <>
                    <span className="font-mono text-orange-300">Origem: {rolledResult.item.originCulture}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-400">{rolledResult.item.servingStyle}</span>
                  </>
                )}
                {rolledResult.type === 'drinks' && (
                  <>
                    <span className="font-mono text-amber-300">{rolledResult.item.drinkType}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-400">Origem: {rolledResult.item.originCulture}</span>
                  </>
                )}
                {rolledResult.type === 'vendit' && (
                  <>
                    <span className="font-mono text-cyan-300">Categoria: {rolledResult.item.category}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-400">Máquina Automática 24h</span>
                  </>
                )}
              </div>
            </div>

            <span className="text-base font-mono font-black text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/50 shadow self-start sm:self-center shrink-0">
              {rolledResult.item.costEb} eb
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {rolledResult.item.description}
          </p>

          {/* Flavor / Effect / Mechanical Utility Box */}
          {rolledResult.type === 'food' && (rolledResult.item as StreetFoodItem).flavorNotes && (
            <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-800/40 text-xs text-orange-200">
              <strong className="text-orange-400 font-mono">Paladar & Sensação:</strong>{' '}
              {(rolledResult.item as StreetFoodItem).flavorNotes}
            </div>
          )}

          {rolledResult.type === 'drinks' && (rolledResult.item as StreetDrinkItem).effectsOrHangover && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 font-mono">
              <strong className="text-amber-400">Efeito em Jogo / Ressaca:</strong>{' '}
              {(rolledResult.item as StreetDrinkItem).effectsOrHangover}
            </div>
          )}

          {rolledResult.type === 'vendit' && (rolledResult.item as VenditGoodieItem).gameEffect && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 font-mono">
              <strong className="text-cyan-400">⚙️ Utilidade Mecânica:</strong>{' '}
              {(rolledResult.item as VenditGoodieItem).gameEffect}
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-zinc-500">
              Disponível para consumo imediato nas ruas de Night City.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeSubTab === 'food') handleRollFood();
                  if (activeSubTab === 'drinks') handleRollDrink();
                  if (activeSubTab === 'vendit') handleRollVendit();
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sortear Novamente</span>
              </button>
              <button
                onClick={() => handleOrder(rolledResult.item.name, rolledResult.item.costEb)}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs transition flex items-center gap-1.5 shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Comprar / Consumir ({rolledResult.item.costEb}eb)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER CHIPS ROW */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-orange-400" />
          <span>Filtrar por Categoria / Cultura:</span>
        </span>

        {activeSubTab === 'food' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs whitespace-nowrap">
            {[
              { id: 'all', label: `Todas as Comidas (${STREET_FOOD_TABLE.length})` },
              { id: 'asiatica', label: '🍜 Asiática (Kabuki)' },
              { id: 'latina', label: '🌮 Latina (Heywood)' },
              { id: 'brasileira', label: '🌴 Brasileira / Tropical' },
              { id: 'americana', label: '🍔 Americana / Kibble' },
              { id: 'rua', label: '🔥 Rua & Combate' },
              { id: 'outras', label: '🌐 Outras Culturas' },
            ].map(cat => {
              const isSelected = foodCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFoodCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-500 font-bold shadow'
                      : 'bg-[#121217] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeSubTab === 'drinks' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs whitespace-nowrap">
            {[
              { id: 'all', label: `Todas as Bebidas (${STREET_DRINKS_TABLE.length})` },
              { id: 'cocktails', label: '🍸 Coquetéis de Balcão' },
              { id: 'shots', label: '🥃 Destilados & Shots' },
              { id: 'quentes', label: '🍵 Chás & Caldos Quentes' },
              { id: 'refrescos', label: '🥤 Refrescos & Cervejas' },
            ].map(cat => {
              const isSelected = drinkCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setDrinkCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-500 font-bold shadow'
                      : 'bg-[#121217] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeSubTab === 'vendit' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs whitespace-nowrap">
            {[
              { id: 'all', label: `Todos os Itens (${VENDIT_MACHINE_TABLE.length})` },
              { id: 'higiene', label: '🩹 Higiene & Remédios' },
              { id: 'sobrevivencia', label: '🎒 Sobrevivência & Ferramentas' },
              { id: 'tatico', label: '🛡️ Tático & Equipamento' },
              { id: 'eletronicos', label: '💾 Eletrônicos & Cabos' },
              { id: 'outros', label: '📦 Utilidades & Diversos' },
            ].map(cat => {
              const isSelected = venditCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setVenditCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-cyan-600 text-white border-cyan-500 font-bold shadow'
                      : 'bg-[#121217] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={`Buscar em ${activeSubTab === 'food' ? `comidas (${filteredFoods.length} encontradas)` : activeSubTab === 'drinks' ? `bebidas (${filteredDrinks.length} encontradas)` : `máquinas vendit (${filteredVendits.length} itens)`}...`}
          className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Grid of Items */}
      {activeSubTab === 'food' && (
        <>
          {filteredFoods.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#121217] border border-zinc-800 text-center space-y-2">
              <Utensils className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">Nenhum prato encontrado com o filtro e busca selecionados.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFoodCategoryFilter('all');
                }}
                className="text-xs text-orange-400 hover:underline font-mono"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map(food => {
                const isSelectedHero = rolledResult && rolledResult.type === 'food' && rolledResult.item.roll === food.roll;
                return (
                  <div
                    key={food.roll}
                    className={`p-4 rounded-2xl bg-[#121217] border transition flex flex-col justify-between space-y-3 ${
                      isSelectedHero
                        ? 'border-orange-500 ring-2 ring-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.35)] bg-orange-950/20'
                        : 'border-[#27272a] hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-orange-400 font-bold">D20 #{food.roll}</span>
                          {isSelectedHero && (
                            <span className="text-[9px] font-mono font-bold bg-orange-500 text-black px-1.5 py-0.2 rounded animate-pulse">
                              SORTEADO
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {food.costEb}eb
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-zinc-100">{food.name}</h4>
                      <div className="text-[10px] font-mono text-zinc-400">
                        Origem: <strong className="text-zinc-200">{food.originCulture}</strong>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{food.description}</p>

                      <div className="p-2.5 rounded-lg bg-orange-950/20 border border-orange-900/30 text-[11px] text-orange-200 italic">
                        <strong>Paladar:</strong> {food.flavorNotes}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">{food.servingStyle}</span>
                      <button
                        onClick={() => handleOrder(food.name, food.costEb)}
                        className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs transition flex items-center gap-1 shadow"
                      >
                        <Utensils className="w-3 h-3" />
                        <span>Comprar ({food.costEb}eb)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeSubTab === 'drinks' && (
        <>
          {filteredDrinks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#121217] border border-zinc-800 text-center space-y-2">
              <Wine className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">Nenhuma bebida encontrada com o filtro e busca selecionados.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDrinkCategoryFilter('all');
                }}
                className="text-xs text-amber-400 hover:underline font-mono"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDrinks.map(drink => {
                const isSelectedHero = rolledResult && rolledResult.type === 'drinks' && rolledResult.item.roll === drink.roll;
                return (
                  <div
                    key={drink.roll}
                    className={`p-4 rounded-2xl bg-[#121217] border transition flex flex-col justify-between space-y-3 ${
                      isSelectedHero
                        ? 'border-amber-500 ring-2 ring-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.35)] bg-amber-950/20'
                        : 'border-[#27272a] hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold">D20 #{drink.roll}</span>
                          {isSelectedHero && (
                            <span className="text-[9px] font-mono font-bold bg-amber-500 text-black px-1.5 py-0.2 rounded animate-pulse">
                              SORTEADO
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {drink.costEb}eb
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-zinc-100">{drink.name}</h4>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {drink.drinkType} &bull; <strong className="text-zinc-200">{drink.originCulture}</strong>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{drink.description}</p>

                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-[11px] font-mono text-amber-200">
                        <strong>Efeito / Ressaca:</strong> {drink.effectsOrHangover}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">Servido na calçada</span>
                      <button
                        onClick={() => handleOrder(drink.name, drink.costEb)}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs transition flex items-center gap-1 shadow"
                      >
                        <Wine className="w-3 h-3" />
                        <span>Pedir ({drink.costEb}eb)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeSubTab === 'vendit' && (
        <>
          {filteredVendits.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#121217] border border-zinc-800 text-center space-y-2">
              <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">Nenhum item de conveniência encontrado com o filtro e busca selecionados.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setVenditCategoryFilter('all');
                }}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendits.map(item => {
                const isSelectedHero = rolledResult && rolledResult.type === 'vendit' && rolledResult.item.roll === item.roll;
                return (
                  <div
                    key={item.roll}
                    className={`p-4 rounded-2xl bg-[#121217] border transition flex flex-col justify-between space-y-3 ${
                      isSelectedHero
                        ? 'border-cyan-500 ring-2 ring-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.35)] bg-cyan-950/20'
                        : 'border-[#27272a] hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">D20 #{item.roll}</span>
                          {isSelectedHero && (
                            <span className="text-[9px] font-mono font-bold bg-cyan-500 text-black px-1.5 py-0.2 rounded animate-pulse">
                              SORTEADO
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {item.costEb}eb
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-zinc-100">{item.name}</h4>
                      <div className="text-[10px] font-mono text-cyan-300">
                        Categoria: {item.category}
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{item.description}</p>

                      {item.gameEffect && (
                        <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-900/30 text-[11px] font-mono text-cyan-200">
                          ⚙️ <strong>Utilidade Mecânica:</strong> {item.gameEffect}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">Máquina 24 horas</span>
                      <button
                        onClick={() => handleOrder(item.name, item.costEb)}
                        className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs transition flex items-center gap-1 shadow"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Comprar ({item.costEb}eb)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
