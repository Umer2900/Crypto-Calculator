const InputField = ({ 
  label, 
  value, 
  onChange, 
  type = "number", 
  placeholder = "0.00", 
  icon: Icon,
  step = "any"
}: { 
  label: string, 
  value: string | number, 
  onChange: (val: string) => void, 
  type?: string, 
  placeholder?: string,
  icon?: any,
  step?: string
}) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
      {Icon && <Icon size={14} className="text-blue-400" />}
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default InputField;