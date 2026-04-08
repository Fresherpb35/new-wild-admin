import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";

/* ── Full-screen loading spinner shown while restoring JWT session ── */
function SessionLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background:"linear-gradient(135deg,#071510 0%,#0d2117 45%,#102b1e 75%,#071510 100%)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl text-3xl"
          style={{ background:"linear-gradient(135deg,#c9a84c,#e2c87a)", boxShadow:"0 8px 24px rgba(201,168,76,0.35)" }}>
          🐯
        </div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i=>(
            <div key={i} className="w-2 h-2 rounded-full"
              style={{ background:"#c9a84c", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>
          ))}
        </div>
        <p className="text-xs tracking-widest uppercase" style={{ color:"rgba(201,168,76,0.55)" }}>
          Restoring session…
        </p>
      </div>
    </div>
  );
}

/* ── Inner app — consumes useAuth ── */
function InnerApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const { isLoggedIn, checking, login, logout, loading, error } = useAuth();

  if (checking) return <SessionLoader />;

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={login}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <AppProvider>
      <DashboardLayout
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={logout}
      />
    </AppProvider>
  );
}

export default function App() {
  return <InnerApp />;
}
