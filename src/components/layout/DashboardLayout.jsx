import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "../../pages/DashboardHome";
import BookingManagement from "../../pages/BookingManagement";
import ContentManagement from "../../pages/ContentManagement";
import ToastContainer from "../ui/Toast";

export default function DashboardLayout({ activePage, setActivePage, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "bookings": return <BookingManagement />;
      case "content":  return <ContentManagement />;
      default:         return <DashboardHome setActive={setActivePage} />;
    }
  };

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    bookings:  "Booking Management",
    content:   "Content Management",
  };

  return (
    <div className="flex min-h-screen" style={{ background:"linear-gradient(180deg,#0d2117 0%,#0a1d13 100%)" }}>

      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width:230, minHeight:"100vh", position:"sticky", top:0 }}>
        <Sidebar active={activePage} setActive={setActivePage} onLogout={onLogout} />
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col" style={{ width:240 }}>
            <Sidebar active={activePage} setActive={setActivePage} onLogout={onLogout} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background:"rgba(5,18,10,0.9)", borderBottom:"1px solid rgba(201,168,76,0.1)", backdropFilter:"blur(10px)" }}>
          <button onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background:"rgba(201,168,76,0.12)", color:"#e2c87a", border:"1px solid rgba(201,168,76,0.2)" }}>
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="font-display text-sm font-semibold" style={{ color:"#f5ede0" }}>
              {PAGE_TITLES[activePage]}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background:"linear-gradient(135deg,#2d6e45,#4a6741)", color:"#e2c87a" }}>AD</div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
