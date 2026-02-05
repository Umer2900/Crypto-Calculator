import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden group",
      active ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    )}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-linear-to-r from-red-500 to-blue-600"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <Icon size={18} className={cn("relative z-10", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    <span className="relative z-10 font-semibold">{label}</span>
  </button>
);

export default TabButton;