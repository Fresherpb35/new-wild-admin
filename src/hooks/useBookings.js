import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  deleteBulkBookings,
  getBookingStats,
} from "../services/bookingService";

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);

  const fetchBookings = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const res = await getBookings();

    console.log("BOOKINGS API RESPONSE:", res); // 🔍 DEBUG

    // ✅ FIXED EXTRACTION
    let data = [];

    if (Array.isArray(res)) {
      data = res;
    } else if (Array.isArray(res?.data)) {
      data = res.data;
    } else if (Array.isArray(res?.bookings)) {
      data = res.bookings;
    } else if (Array.isArray(res?.data?.bookings)) {
      data = res.data.bookings;
    }

    setBookings(data);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    setError(err.message || "Failed to load bookings.");
    setBookings([]);
  } finally {
    setLoading(false);
  }
}, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getBookingStats();
      const s = result?.data ?? result ?? {};
      setStats({
        total: s.total || 0,
        confirmed: s.confirmed || 0,
        pending: s.pending || 0,
        cancelled: s.cancelled || 0,
      });
    } catch (err) {
      console.warn("Stats fetch failed → using local stats");
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [fetchBookings, fetchStats]);

  // Filtered bookings
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return bookings.filter((b) => {
      const matchFilter = filter === "All" || b.status?.toUpperCase() === filter.toUpperCase();
      if (!matchFilter) return false;
      if (!q) return true;

      return (
        (b.name || "").toLowerCase().includes(q) ||
        (b.email || "").toLowerCase().includes(q) ||
        (b.phone || "").includes(q) ||
        (b.id || "").toString().toLowerCase().includes(q) ||
        (b.safariType || "").toLowerCase().includes(q) ||
        (b.safariZone || "").toLowerCase().includes(q)
      );
    });
  }, [bookings, search, filter]);

  // Local stats fallback
  const localStats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status?.toUpperCase() === "CONFIRMED").length,
    pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING").length,
    cancelled: bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED").length,
  }), [bookings]);

  const mergedStats = stats.total > 0 ? stats : localStats;

  // Selection
  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.length === filtered.length && filtered.length > 0 ? [] : filtered.map((b) => b.id)
    );
  };

  // CRUD
  const addBooking = async (data) => {
    const res = await createBooking(data);
    await fetchBookings();
    await fetchStats();
    return res;
  };

  const editBooking = async (id, data) => {
    if (!id) throw new Error("ID is required to edit booking");
    const res = await updateBooking(id, data);
    await fetchBookings();
    await fetchStats();
    return res;
  };

  const removeBooking = async (id) => {
    if (!id) throw new Error("ID is required to delete booking");
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    await fetchStats();
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;
    await deleteBulkBookings(selected);
    setBookings((prev) => prev.filter((b) => !selected.includes(b.id)));
    setSelected([]);
    await fetchStats();
  };

  return {
    bookings,
    filtered,
    stats: mergedStats,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    selected,
    toggleSelect,
    toggleAll,
    addBooking,
    editBooking,
    removeBooking,
    removeSelected,
    refetch: fetchBookings,
  };
}