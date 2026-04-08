/**
 * Labelled input / textarea / select used inside modals and CMS forms.
 */
export function FormField({ label, error, children }) {
  return (
    <div>
      {label && (
        <label
          className="block text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "rgba(201,168,76,0.7)" }}
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs mt-1" style={{ color: "#e08080" }}>{error}</p>
      )}
    </div>
  );
}

const shared =
  "w-full px-3.5 py-2.5 rounded-xl text-sm gold-ring transition-all duration-200";
const sharedStyle = {
  background: "rgba(255,253,247,0.06)",
  border: "1px solid rgba(201,168,76,0.18)",
  color: "#f5ede0",
  fontFamily: "inherit",
};

export function FInput({ value, onChange, placeholder, type = "text", ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={shared}
      style={sharedStyle}
      {...rest}
    />
  );
}

export function FTextarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${shared} resize-none`}
      style={{ ...sharedStyle, lineHeight: 1.65 }}
    />
  );
}

export function FSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={shared}
      style={sharedStyle}
    >
      {children}
    </select>
  );
}
