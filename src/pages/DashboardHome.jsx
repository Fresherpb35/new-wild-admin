import { useMemo } from "react";
import { useBookings } from "../hooks/useBookings";
import Badge from "../components/ui/Badge";

function StatCard({ icon, label, value, change, up, loading }) {
  return (
    <div
      className="rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02]"
      style={{ background: "rgba(255,253,247,0.04)", border: "1px solid rgba(201,168,76,0.12)" }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-lg sm:text-xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
          }`}
        >
          {change}
        </span>
      </div>
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.55)" }}>
        {label}
      </p>
      {loading ? (
        <div className="h-7 w-16 rounded-md animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
      ) : (
        <p className="text-xl sm:text-2xl font-semibold" style={{ color: "#f5ede0" }}>
          {value}
        </p>
      )}
    </div>
  );
}

function Skeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 px-4 py-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-lg animate-pulse"
          style={{ background: "rgba(255,255,255,0.05)", animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

export default function DashboardHome({ setActive }) {
  const { bookings, stats, loading, error } = useBookings();

  const recent = useMemo(() => bookings.slice(0, 5), [bookings]);

  const STATS = [
    { icon: "📋", label: "Total Bookings", value: stats.total, change: "+12%", up: true },
    { icon: "✅", label: "Confirmed", value: stats.confirmed, change: "+8%", up: true },
    { icon: "⏳", label: "Pending", value: stats.pending, change: "-3%", up: false },
    { icon: "🦒", label: "Safari Bookings", value: bookings.length, change: "+15%", up: true },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 anim-fadeup">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#f5ede0" }}>
          Welcome back, Admin 👋
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>
          Wildlife Safari India ·{" "}
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(180,40,40,0.18)",
            border: "1px solid rgba(255,100,100,0.2)",
            color: "#e08080",
          }}
        >
          ⚠️ {error} — showing cached data.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            id: "bookings",
            icon: "📋",
            title: "Booking Management",
            desc: `${stats.total} total · ${stats.pending} pending`,
            bg: "rgba(45,110,69,0.12)",
            border: "rgba(45,110,69,0.25)",
          },
          {
            id: "content",
            icon: "✏️",
            title: "Content Management",
            desc: "Blogs, hotels",
            bg: "rgba(201,168,76,0.08)",
            border: "rgba(201,168,76,0.2)",
          },
        ].map((link) => (
          <button
            key={link.id}
            onClick={() => setActive(link.id)}
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{ background: link.bg, border: `1px solid ${link.border}` }}
          >
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{link.icon}</div>
            <p className="font-display text-base sm:text-lg font-semibold mb-1" style={{ color: "#f5ede0" }}>
              {link.title}
            </p>
            <p className="text-xs mb-3" style={{ color: "rgba(245,237,224,0.45)" }}>
              {link.desc}
            </p>
            <p className="text-xs font-medium" style={{ color: "#c9a84c" }}>
              Open →
            </p>
          </button>
        ))}
      </div>

      {/* Recent Safari Bookings */}
      <div
        className="rounded-xl sm:rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(201,168,76,0.1)" }}
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
          style={{ background: "rgba(201,168,76,0.07)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}
        >
          <p className="font-display text-sm sm:text-base font-semibold" style={{ color: "#f5ede0" }}>
            Recent Safari Bookings
          </p>
          <button
            onClick={() => setActive("bookings")}
            className="text-xs font-medium hover:opacity-70"
            style={{ color: "#c9a84c" }}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <Skeleton rows={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 680 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                  {["Booking ID", "Guest Name", "Safari Date", "Type", "Zone", "Time", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 sm:px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "rgba(201,168,76,0.6)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm" style={{ color: "rgba(245,237,224,0.3)" }}>
                      No safari bookings yet.
                    </td>
                  </tr>
                ) : (
                  recent.map((b, i) => (
                    <tr
                      key={i}
                      className="transition-colors duration-150 hover:bg-[rgba(201,168,76,0.04)]"
                      style={{ borderBottom: "1px solid rgba(201,168,76,0.05)" }}
                    >
                      <td className="px-4 sm:px-5 py-3 text-xs font-mono" style={{ color: "rgba(201,168,76,0.7)" }}>
                        {b.id?.slice(0, 8)}...
                      </td>
                      <td className="px-4 sm:px-5 py-3 text-sm font-medium whitespace-nowrap" style={{ color: "#f5ede0" }}>
                        {b.name}
                      </td>
                      <td className="px-4 sm:px-5 py-3 text-sm whitespace-nowrap" style={{ color: "rgba(245,237,224,0.7)" }}>
                        {b.safariDate ? new Date(b.safariDate).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="px-4 sm:px-5 py-3 font-medium" style={{ color: "#e2c87a" }}>
                        {b.safariType || "-"}
                      </td>
                      <td className="px-4 sm:px-5 py-3" style={{ color: "rgba(245,237,224,0.7)" }}>
                        {b.safariZone || "-"}
                      </td>
                      <td className="px-4 sm:px-5 py-3" style={{ color: "rgba(245,237,224,0.7)" }}>
                        {b.safariTime || "-"}
                      </td>
                      <td className="px-4 sm:px-5 py-3">
                        <Badge status={b.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}