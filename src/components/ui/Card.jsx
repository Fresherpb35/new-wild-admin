/**
 * Jungle-themed card container with optional hover scale effect.
 */
export default function Card({ children, className = "", hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all duration-200
        ${hover ? "hover:scale-[1.02] cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}`}
      style={{
        background: "rgba(255,253,247,0.04)",
        border: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      {children}
    </div>
  );
}
