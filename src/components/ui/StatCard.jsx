/**
 * Metric card used on the Dashboard page.
 */
export default function StatCard({ icon, label, value, change, up }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: "rgba(255,253,247,0.04)",
        border: "1px solid rgba(201,168,76,0.12)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            up
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-red-400 bg-red-500/10"
          }`}
        >
          {change}
        </span>
      </div>
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{ color: "rgba(201,168,76,0.55)" }}
      >
        {label}
      </p>
      <p className="text-2xl font-semibold" style={{ color: "#f5ede0" }}>
        {value}
      </p>
    </div>
  );
}
