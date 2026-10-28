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
import { getEffectiveApiKey } from '../../services/aiService';

export const StreetFoodDrinksSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'food' | 'drinks' | 'vendit'>('food');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Selected Items for Details / Rolling
  const [selectedFood, setSelectedFood] = useState<StreetFoodItem>(STREET_FOOD_TABLE[0]);
  const [selectedDrink, setSelectedDrink] = useState<StreetDrinkItem>(STREET_DRINKS_TABLE[0]);
  const [selectedVendit, setSelectedVendit] = useState<VenditGoodieItem>(VENDIT_MACHINE_TABLE[0]);

  // AI Generator State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);
  const [aiCulture, setAiCulture] = useState<string>('Japonesa / Asiática');
  const [aiItemType, setAiItemType] = useState<'food' | 'drink'>('food');
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Sorteios
  const handleRollFood = () => {
    const rolled = rollStreetFood();
    setSelectedFood(rolled);
  };

  const handleRollDrink = () => {
    const rolled = rollStreetDrink();
    setSelectedDrink(rolled);
  };

  const handleRollVendit = () => {
    const rolled = rollVenditGoodie();
    setSelectedVendit(rolled);
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

    if (activeKey) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            if (aiItemType === 'food') {
              setSelectedFood(parsed);
              setActiveSubTab('food');
            } else {
              setSelectedDrink(parsed);
              setActiveSubTab('drinks');
            }
            setIsAiLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('AI Street Food fallback:', e);
      }
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
    }
    setIsAiLoading(false);
  };

  // Filtered Lists
  const filteredFoods = STREET_FOOD_TABLE.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.originCulture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrinks = STREET_DRINKS_TABLE.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.originCulture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVendits = VENDIT_MACHINE_TABLE.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center bg-[#14141a] border border-[#27272a] rounded-xl p-1 text-xs font-medium shrink-0">
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

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={`Buscar em ${activeSubTab === 'food' ? 'comidas' : activeSubTab === 'drinks' ? 'bebidas' : 'itens de conveniência'}...`}
          className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Grid of Items */}
      {activeSubTab === 'food' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map(food => (
            <div
              key={food.roll}
              className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] hover:border-zinc-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-orange-400 font-bold">D20 #{food.roll}</span>
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
          ))}
        </div>
      )}

      {activeSubTab === 'drinks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrinks.map(drink => (
            <div
              key={drink.roll}
              className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] hover:border-zinc-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 font-bold">D20 #{drink.roll}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {drink.costEb}eb
                  </span>
                </div>

                <h4 className="text-sm font-bold text-zinc-100">{drink.name}</h4>
                <div className="text-[10px] font-mono text-zinc-400">
                  {drink.drinkType} • <strong className="text-zinc-200">{drink.originCulture}</strong>
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
          ))}
        </div>
      )}

      {activeSubTab === 'vendit' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendits.map(item => (
            <div
              key={item.roll}
              className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] hover:border-zinc-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">D20 #{item.roll}</span>
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
          ))}
        </div>
      )}
    </div>
  );
};
