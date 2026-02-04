import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Zap, 
  ArrowUpRight, 
  RefreshCcw, 
  Info,
  DollarSign,
  Percent,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { formatCurrency, formatCrypto } from '../utils/format';
import TabButton from '../components/TabButton';
import Card from '../components/Card';
import InputField from '../components/InputField';



// --- sections ---
const MultipleStrategy = () => {
  const [initial, setInitial] = useState<string>("1000");
  const [oldPrice, setOldPrice] = useState<string>("50");
  const [currentPrice, setCurrentPrice] = useState<string>("40");

  const results = useMemo(() => {
    const I = parseFloat(initial);
    const P_old = parseFloat(oldPrice);
    const P_cur = parseFloat(currentPrice);

    if (isNaN(I) || isNaN(P_old) || isNaN(P_cur) || P_old <= 0 || P_cur <= 0) return [];

    const U1 = I / P_old;
    const items = [];

    for (let x = 1; x <= 10; x++) {
      const I2 = I * x;
      const U2 = I2 / P_cur;
      const totalCapital = I + I2;
      const totalUnits = U1 + U2;
      const avgPrice = totalCapital / totalUnits;

      items.push({
        multiple: x,
        secondInv: I2,
        avgPrice: avgPrice
      });
    }
    return items;
  }, [initial, oldPrice, currentPrice]);

  const getCommentary = () => {
    const P_old = parseFloat(oldPrice);
    const P_cur = parseFloat(currentPrice);
    if (P_cur < P_old) return { text: "Prices are lower than your entry. Averaging down will significantly reduce your break-even point.", color: "text-blue-400" };
    if (P_cur > P_old) return { text: "Prices are higher than your entry. Averaging up will increase your position size but also your average entry price.", color: "text-red-400" };
    return { text: "Current price matches your old entry. No change in average price if you add more.", color: "text-slate-400" };
  };

  const commentary = getCommentary();

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-transparent mb-6">Investment Parameters</h3>
          <div className="space-y-4">
            <InputField label="Initial Investment (₹)" value={initial} onChange={setInitial} icon={DollarSign} />
            <InputField label="Old Buy Price (₹)" value={oldPrice} onChange={setOldPrice} icon={TrendingUp} />
            <InputField label="Current Price (₹)" value={currentPrice} onChange={setCurrentPrice} icon={Zap} />
          </div>
        </Card>
        
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <div className="flex gap-3">
                <Info className="text-blue-400 shrink-0" size={20} />
                <p className={cn("text-sm leading-relaxed", commentary.color)}>
                  {commentary.text}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-4 font-semibold text-slate-400">Multiple</th>
                <th className="pb-4 font-semibold text-slate-400">Addl. Investment</th>
                <th className="pb-4 font-semibold text-slate-400 text-right">Avg. Buy Price (7 Dec)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {results.map((row) => (
                <tr key={row.multiple} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 font-medium text-slate-300">{row.multiple}x</td>
                  <td className="py-4 text-slate-300 font-mono">{formatCurrency(row.secondInv)}</td>
                  <td className="py-4 text-right font-mono text-blue-400 group-hover:text-blue-300">
                    {formatCrypto(row.avgPrice)}
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-slate-500 italic">
                    Enter valid numbers to see the strategy table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const TaxCalculator = () => {
  const [initial, setInitial] = useState<string>("10000");
  const [buyPrice, setBuyPrice] = useState<string>("100");
  const [currentPrice, setCurrentPrice] = useState<string>("150");
  const [targetProfit, setTargetProfit] = useState<string>("5000");

  const data = useMemo(() => {
    const I = parseFloat(initial);
    const P_buy = parseFloat(buyPrice);
    const P_cur = parseFloat(currentPrice);
    const T = parseFloat(targetProfit);

    if (isNaN(I) || isNaN(P_buy) || isNaN(P_cur) || isNaN(T) || P_buy <= 0) return null;

    const U = I / P_buy;
    const Fee_in = I * 0.005;
    const GST_in = Fee_in * 0.18;
    const Tax_in = Fee_in + GST_in;

    const V = U * P_cur;
    const Fee_out = V * 0.005;
    const GST_out = Fee_out * 0.18;
    const TDS = V * 0.01;
    const Tax_out = Fee_out + GST_out + TDS;

    const Total_Tax = Tax_in + Tax_out;
    const Profit_No_Tax = V - I;
    const Net_Profit = Profit_No_Tax - Total_Tax;

    const exitFactor = 1 - (0.005 * 1.18) - 0.01;
    const BreakEven = (I + Tax_in) / (U * exitFactor);
    const TargetSell = (T + I + Tax_in) / (U * exitFactor);

    return {
      units: U,
      taxIn: Tax_in,
      taxOut: Tax_out,
      totalTax: Total_Tax,
      grossProfit: Profit_No_Tax,
      netProfit: Net_Profit,
      breakEven: BreakEven,
      targetSell: TargetSell,
      currentValue: V
    };
  }, [initial, buyPrice, currentPrice, targetProfit]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-transparent mb-6">Tax & Profit Inputs</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Investment (₹)" value={initial} onChange={setInitial} icon={DollarSign} />
          <InputField label="Buy Price (₹)" value={buyPrice} onChange={setBuyPrice} icon={TrendingUp} />
          <InputField label="Current Price (₹)" value={currentPrice} onChange={setCurrentPrice} icon={Zap} />
          <InputField label="Target Profit (₹)" value={targetProfit} onChange={setTargetProfit} icon={ArrowUpRight} />
        </div>
        
        <div className="mt-8 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Constant Fees</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-slate-400 text-xs">Platform</p>
              <p className="text-slate-200 font-bold">0.5%</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">GST</p>
              <p className="text-slate-200 font-bold">18%</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">TDS</p>
              <p className="text-slate-200 font-bold">1%</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {data ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
                <p className="text-slate-500 text-sm mb-1">Net Profit</p>
                <h4 className={cn("text-2xl font-bold", data.netProfit >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {formatCurrency(data.netProfit)}
                </h4>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  Gross: {formatCurrency(data.grossProfit)}
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
                <p className="text-slate-500 text-sm mb-1">Total Taxes & Fees</p>
                <h4 className="text-2xl font-bold text-orange-400">
                  {formatCurrency(data.totalTax)}
                </h4>
                <div className="mt-2 text-xs text-slate-400">
                  In: {formatCurrency(data.taxIn)} | Out: {formatCurrency(data.taxOut)}
                </div>
              </Card>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-400">Break-Even Price</span>
                  <span className="text-blue-400 font-mono font-bold text-lg">{formatCrypto(data.breakEven)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-400">Target Sell Price</span>
                  <span className="text-emerald-400 font-mono font-bold text-lg">{formatCrypto(data.targetSell)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Units Owned</span>
                  <span className="text-slate-200 font-mono">{data.units.toFixed(4)} Units</span>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="h-full flex items-center justify-center text-slate-500 italic">
            Enter valid numbers to calculate results
          </Card>
        )}
      </div>
    </div>
  );
};

const FuturesCalculator = () => {
  const [initial, setInitial] = useState<string>("1000");
  const [price, setPrice] = useState<string>("50000");
  const [leverage, setLeverage] = useState<string>("10");
  const [position, setPosition] = useState<'long' | 'short'>('long');

  const targets = [2.5, 5, 10, 25, 50, 100];

  const results = useMemo(() => {
    const I = parseFloat(initial);
    const P = parseFloat(price);
    const L = parseFloat(leverage);

    if (isNaN(I) || isNaN(P) || isNaN(L) || P <= 0 || L <= 0) return null;

    const liqPrice = position === 'long' 
      ? P * (1 - 100/L/100) 
      : P * (1 + 100/L/100);

    const feeIn = I * 0.005 * 1.18;

    const items = targets.map(p => {
      const move = p / L;
      const targetPrice = position === 'long' 
        ? P * (1 + move/100) 
        : P * (1 - move/100);
      
      const profit = (I / 100) * p;
      const exitValue = I + profit;
      const feeOut = exitValue * 0.005 * 1.18;
      const tds = exitValue * 0.01;
      const netProfit = profit - (feeIn + feeOut + tds);

      return {
        percent: p,
        targetPrice,
        netProfit
      };
    });

    return { items, liqPrice };
  }, [initial, price, leverage, position]);

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-transparent mb-6">Futures Setup</h3>
          <div className="space-y-4">
            <div className="flex bg-slate-900 p-1 rounded-xl mb-4">
              <button 
                onClick={() => setPosition('long')}
                className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", position === 'long' ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300")}
              >
                Long
              </button>
              <button 
                onClick={() => setPosition('short')}
                className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", position === 'short' ? "bg-red-500/20 text-red-400" : "text-slate-500 hover:text-slate-300")}
              >
                Short
              </button>
            </div>
            <InputField label="Margin (₹)" value={initial} onChange={setInitial} icon={DollarSign} />
            <InputField label="Entry Price (₹)" value={price} onChange={setPrice} icon={TrendingUp} />
            <InputField label="Leverage (x)" value={leverage} onChange={setLeverage} icon={Percent} />
          </div>
        </Card>

        {results && (
          <Card className="bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Liquidation Price</p>
                <p className="text-xl font-mono font-bold text-red-500">{formatCrypto(results.liqPrice)}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-4 font-semibold text-slate-400">ROI %</th>
                <th className="pb-4 font-semibold text-slate-400">Target Price</th>
                <th className="pb-4 font-semibold text-slate-400 text-right">Net Profit (Post Tax)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {results?.items.map((row) => (
                <tr key={row.percent} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 font-bold text-slate-300">+{row.percent}%</td>
                  <td className="py-4 text-blue-400 font-mono">{formatCrypto(row.targetPrice)}</td>
                  <td className={cn("py-4 text-right font-mono font-bold", row.netProfit >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {formatCurrency(row.netProfit)}
                  </td>
                </tr>
              ))}
              {!results && (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-slate-500 italic">
                    Enter valid numbers to see the projections
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'strategy' | 'tax' | 'futures'>('strategy');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2 justify-center md:justify-start"
            >
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Calculator className="text-white" size={24} />
              </div>
              <span className="text-sm font-bold text-blue-400 tracking-widest uppercase">Professional Toolkit</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-500 via-blue-500 to-blue-600 bg-clip-text text-transparent"
            >
              Crypto Investment Toolkit
            </motion.h1>
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 self-center md:self-end">
            <TabButton 
              active={activeTab === 'strategy'} 
              onClick={() => setActiveTab('strategy')} 
              icon={RefreshCcw} 
              label="Strategy" 
            />
            <TabButton 
              active={activeTab === 'tax'} 
              onClick={() => setActiveTab('tax')} 
              icon={TrendingUp} 
              label="Tax & Profit" 
            />
            <TabButton 
              active={activeTab === 'futures'} 
              onClick={() => setActiveTab('futures')} 
              icon={Zap} 
              label="Futures" 
            />
          </div>
        </header>

        {/* Content */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'strategy' && <MultipleStrategy />}
              {activeTab === 'tax' && <TaxCalculator />}
              {activeTab === 'futures' && <FuturesCalculator />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Crypto Investment Toolkit. Built for precision and performance.</p>
          <p className="mt-2 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Real-time logic</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Secure & Private</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
