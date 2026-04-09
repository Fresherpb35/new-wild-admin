import { useState } from "react";

/* ── Jungle SVG background ── */
function JungleBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.07 }}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M-50,300 Q100,150 200,200 Q80,350 -50,300Z"  fill="#2d6e45" />
      <path d="M-80,450 Q80,280  180,320 Q60,500 -80,450Z"  fill="#4a6741" />
      <path d="M0,580   Q150,400 250,430 Q120,620 0,580Z"   fill="#2d6e45" />
      <path d="M1250,200 Q1100,100 1020,180 Q1130,320 1250,200Z" fill="#4a6741" />
      <path d="M1280,400 Q1080,280 1000,380 Q1120,520 1280,400Z" fill="#2d6e45" />
      <path d="M1230,600 Q1050,500  980,580 Q1100,700 1230,600Z" fill="#4a6741" />
      {/* Tiger stripe hint */}
      <ellipse cx="920" cy="570" rx="160" ry="100" fill="#c9a84c" opacity="0.08" />
      {[830, 880, 930, 975].map((x, i) => (
        <path
          key={i}
          d={`M${x},${520 + i * 5} Q${x + 40},${560 + i * 5} ${x + 20},${
            600 + i * 5
          } Q${x - 10},${570 + i * 5} ${x},${520 + i * 5}Z`}
          fill="#1a4029"
        />
      ))}
      <path d="M300,0 Q400,80 480,40 Q380,-20 300,0Z" fill="#c9a84c" opacity="0.35" />
      <path d="M700,0 Q780,60 850,20 Q760,-30 700,0Z" fill="#c9a84c" opacity="0.25" />
    </svg>
  );
}

/**
 * LoginPage receives onLogin, loading, error from App.jsx → useAuth.
 * onLogin(email, password) → returns true on success.
 */
export default function LoginPage({ onLogin, loading, error }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    await onLogin(email, password);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputStyle = {
    background: "rgba(255,253,247,0.06)",
    border: "1px solid rgba(201,168,76,0.2)",
    color: "#f5ede0",
    fontFamily: "inherit",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{
        background:
          "linear-gradient(135deg,#071510 0%,#0d2117 45%,#102b1e 75%,#071510 100%)",
      }}
    >
      <JungleBg />

      {/* glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(45,110,69,0.18) 0%,transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%)",
        }}
      />

      {/* ── Login card ── */}
      <div
        className="glass anim-fadeup relative z-10 w-full max-w-md rounded-2xl sm:rounded-3xl p-7 sm:p-10"
        style={{
          border: "1px solid rgba(201,168,76,0.22)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(201,168,76,0.12)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-7 sm:mb-9">
          <div
            className="w-14 sm:w-16 h-14 sm:h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl text-2xl sm:text-3xl"
            style={{
              background: "linear-gradient(135deg,#c9a84c,#e2c87a)",
              boxShadow: "0 8px 24px rgba(201,168,76,0.35)",
            }}
          >
            🐯
          </div>
          <h1
            className="font-display text-xl sm:text-2xl font-bold mb-1 leading-snug"
            style={{ color: "#f5ede0" }}
          >
            Wildlife Safari India
          </h1>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(201,168,76,0.65)" }}
          >
            Admin Control Panel
          </p>
        </div>

        {/* ── Fields ── */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "rgba(201,168,76,0.75)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="admin@wildliferose.com"
              className="w-full px-4 py-3 rounded-xl text-sm gold-ring transition-all duration-200"
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "rgba(201,168,76,0.75)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm gold-ring transition-all duration-200"
                style={inputStyle}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-opacity hover:opacity-70"
                style={{ color: "rgba(201,168,76,0.5)" }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mt-4 mb-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5"
            />
            <span className="text-xs" style={{ color: "rgba(245,237,224,0.45)" }}>
              Remember me
            </span>
          </label>
          <button
            type="button"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: "rgba(201,168,76,0.65)", fontFamily: "inherit" }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 px-4 py-2.5 rounded-xl text-xs text-center"
            style={{
              background: "rgba(180,40,40,0.2)",
              border: "1px solid rgba(255,100,100,0.25)",
              color: "#e08080",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide
                     transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: "linear-gradient(135deg,#c9a84c,#e2c87a)",
            color: "#0d2117",
            boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
            fontFamily: "inherit",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block"
                style={{ animation: "spin 0.7s linear infinite" }}
              />
              Signing in…
            </span>
          ) : (
            "Login to Dashboard"
          )}
        </button>

        {/* Footer */}
        <div
          className="mt-7 pt-5 text-center"
          style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(245,237,224,0.25)" }}
          >
            Wildlife Safari India · Ranthambore, Rajasthan
            <br />
            Protected area — authorised personnel only
          </p>
        </div>
      </div>

      {/* Spin keyframe (inline so no extra CSS file needed) */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
