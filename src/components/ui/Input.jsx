/**
 * Themed text / email / password input with gold focus ring.
 */
export default function Input({
  label,
  type = "text",
  value,
  onChange,
  onKeyDown,
  placeholder,
  className = "",
}) {
  const inputStyle = {
    background: "rgba(255,253,247,0.06)",
    border: "1px solid rgba(201,168,76,0.2)",
    color: "#f5ede0",
    fontFamily: "inherit",
  };

  return (
    <div className={className}>
      {label && (
        <label
          className="block text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "rgba(201,168,76,0.75)" }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm gold-ring transition-all duration-200"
        style={inputStyle}
      />
    </div>
  );
}
