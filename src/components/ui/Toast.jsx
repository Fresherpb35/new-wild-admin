import { useApp } from "../../context/AppContext";

export default function ToastContainer() {
  const ctx = useApp();
  const toasts = ctx?.toasts ?? [];

  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={
            t.type === "error"
              ? { background:"rgba(160,30,30,0.95)", color:"#ffd5d5", border:"1px solid rgba(255,100,100,0.3)" }
              : t.type === "warning"
              ? { background:"rgba(140,95,10,0.95)", color:"#fff3cc", border:"1px solid rgba(255,200,80,0.3)" }
              : { background:"rgba(25,75,45,0.97)", color:"#b6f0cc", border:"1px solid rgba(76,175,125,0.35)" }
          }
        >
          {t.type === "error" ? "✕  " : t.type === "warning" ? "⚠  " : "✓  "}
          {t.message}
        </div>
      ))}
    </div>
  );
}
