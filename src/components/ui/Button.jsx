export default function Button({ children, onClick, variant="gold", disabled=false, className="", type="button", fullWidth=false }) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm tracking-wide ${fullWidth ? "w-full" : ""}`;
  const variants = {
    gold:        { style:{ background:"linear-gradient(135deg,#c9a84c,#e2c87a)",color:"#0d2117",boxShadow:"0 4px 20px rgba(201,168,76,0.35)",border:"none"}, cls:"px-6 py-3" },
    green:       { style:{ background:"linear-gradient(135deg,#2d6e45,#3d8a58)",color:"#e2c87a",boxShadow:"0 4px 20px rgba(45,110,69,0.35)",border:"1px solid rgba(201,168,76,0.3)"}, cls:"px-8 py-3.5" },
    "ghost-green":{ style:{ background:"rgba(76,175,125,0.12)",color:"#6dd6a0",border:"1px solid rgba(76,175,125,0.3)"}, cls:"px-4 py-2.5" },
    "ghost-red":  { style:{ background:"rgba(224,100,100,0.12)",color:"#e08080",border:"1px solid rgba(224,100,100,0.3)"}, cls:"px-4 py-2.5" },
    "ghost-gold": { style:{ background:"rgba(201,168,76,0.1)",color:"#e2c87a",border:"1px solid rgba(201,168,76,0.3)"}, cls:"px-4 py-2.5" },
    danger:       { style:{ background:"linear-gradient(135deg,#8b2020,#b03030)",color:"#ffd5d5",border:"1px solid rgba(255,100,100,0.25)",boxShadow:"0 4px 16px rgba(180,40,40,0.3)"}, cls:"px-6 py-2.5" },
  };
  const v = variants[variant] || variants.gold;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${v.cls} ${className}`} style={{ ...v.style, fontFamily:"inherit" }}>
      {children}
    </button>
  );
}
