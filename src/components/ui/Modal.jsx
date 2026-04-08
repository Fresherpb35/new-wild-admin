import { useEffect } from "react";

export default function Modal({ title, onClose, children, size = "md" }) {
  /* close on Escape */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`w-full ${widths[size]} rounded-2xl p-6 anim-fadeup`}
        style={{
          background: "#0f2a1a",
          border: "1px solid rgba(201,168,76,0.22)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold" style={{ color: "#f5ede0" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm
                       transition-all duration-150 hover:opacity-70"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "rgba(245,237,224,0.6)",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
