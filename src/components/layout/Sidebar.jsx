const NAV_ITEMS = [
  { id: "dashboard", icon: "▦",  label: "Dashboard" },
  { id: "bookings",  icon: "📋", label: "Bookings"  },
  { id: "content",   icon: "✏️", label: "Content"   },
];

export default function Sidebar({ active, setActive, onLogout, onClose }) {
  const handleNav = (id) => { setActive(id); onClose?.(); };

  return (
    <aside className="flex flex-col h-full w-full"
      style={{ background:"rgba(5,18,10,0.98)", borderRight:"1px solid rgba(201,168,76,0.1)" }}>

      {/* Brand */}
      <div className="px-5 py-5 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom:"1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl text-lg flex-shrink-0"
            style={{ background:"linear-gradient(135deg,#c9a84c,#e2c87a)" }}>🌿</div>
          <div>
            <p className="font-display text-sm font-semibold leading-tight" style={{ color:"#f5ede0" }}>Wildlife Rose</p>
            <p className="text-xs tracking-widest uppercase" style={{ color:"rgba(201,168,76,0.55)" }}>Safari Resort</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background:"rgba(255,255,255,0.07)", color:"rgba(245,237,224,0.6)" }}>✕</button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-xs tracking-widest uppercase" style={{ color:"rgba(201,168,76,0.35)" }}>Main Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => handleNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left"
              style={isActive
                ? { background:"rgba(201,168,76,0.14)", color:"#e2c87a", borderLeft:"2px solid #c9a84c", paddingLeft:10 }
                : { color:"rgba(245,237,224,0.5)", borderLeft:"2px solid transparent" }}>
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 flex-shrink-0" style={{ borderTop:"1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
          style={{ background:"rgba(201,168,76,0.06)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background:"linear-gradient(135deg,#2d6e45,#4a6741)", color:"#e2c87a" }}>AD</div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color:"rgba(245,237,224,0.85)" }}>Admin User</p>
            <p className="text-xs truncate" style={{ color:"rgba(201,168,76,0.5)" }}>Super Admin</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 hover:bg-red-500/10"
          style={{ color:"rgba(224,100,100,0.75)", fontFamily:"inherit" }}>
          <span>⇤</span> Logout
        </button>
      </div>
    </aside>
  );
}
