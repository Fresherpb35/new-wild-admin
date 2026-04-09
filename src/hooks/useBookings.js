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

  // 1. Parallel Fetching for better speed
  const fetchAllData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");

    try {
      // Parallel execution: Dono calls ek saath jayengi
      const [res, statsRes] = await Promise.allSettled([
        getBookings(),
        getBookingStats()
      ]);

      // Handle Bookings Response
      if (res.status === "fulfilled") {
        let data = [];
        const val = res.value;
        if (Array.isArray(val)) data = val;
        else if (Array.isArray(val?.data)) data = val.data;
        else if (Array.isArray(val?.bookings)) data = val.bookings;
        else if (Array.isArray(val?.data?.bookings)) data = val.data.bookings;
        setBookings(data);
      } else {
        throw new Error("Failed to load bookings");
      }

      // Handle Stats Response
      if (statsRes.status === "fulfilled") {
        const s = statsRes.value?.data ?? statsRes.value ?? {};
        setStats({
          total: s.total || 0,
          confirmed: s.confirmed || 0,
          pending: s.pending || 0,
          cancelled: s.cancelled || 0,
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 2. Client-side filtering logic
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return bookings.filter((b) => {
      const bStatus = (b.status || "").toUpperCase();
      const matchFilter = filter === "All" || bStatus === filter.toUpperCase();
      if (!matchFilter) return false;
      if (!q) return true;

      return (
        (b.name || "").toLowerCase().includes(q) ||
        (b.email || "").toLowerCase().includes(q) ||
        (b.phone || "").includes(q) ||
        (b.id || b._id || "").toString().toLowerCase().includes(q) ||
        (b.safariType || "").toLowerCase().includes(q) ||
        (b.safariZone || "").toLowerCase().includes(q)
      );
    });
  }, [bookings, search, filter]);

  // 3. Optimized Local Stats (Always fallback to local if API stats fail)
  const mergedStats = useMemo(() => {
    if (stats.total > 0) return stats;
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status?.toUpperCase() === "CONFIRMED").length,
      pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING").length,
      cancelled: bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED").length,
    };
  }, [bookings, stats]);

  // Selection Logic
  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.length === filtered.length && filtered.length > 0 ? [] : filtered.map((b) => b.id || b._id)
    );
  };

  // 4. CRUD with Optimistic Updates (Turant UI change)
  const addBooking = async (data) => {
    const res = await createBooking(data);
    await fetchAllData(false); // Background refresh
    return res;
  };

  const editBooking = async (id, data) => {
    // Local update first (Optimistic)
    setBookings(prev => prev.map(b => (b.id === id || b._id === id ? { ...b, ...data } : b)));
    
    const res = await updateBooking(id, data);
    await fetchAllData(false); // Background refresh to sync with server
    return res;
  };

  const removeBooking = async (id) => {
    // UI se turant delete karein
    setBookings(prev => prev.filter(b => b.id !== id && b._id !== id));
    
    try {
      await deleteBooking(id);
      await fetchAllData(false); // Refresh stats in background
    } catch (err) {
      fetchAllData(); // Error aane par data wapas layein
      throw err;
    }
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;
    const oldBookings = [...bookings];
    
    // UI se turant hatayein
    setBookings(prev => prev.filter(b => !selected.includes(b.id || b._id)));
    
    try {
      await deleteBulkBookings(selected);
      setSelected([]);
      await fetchAllData(false);
    } catch (err) {
      setBookings(oldBookings); // Rollback on error
      throw err;
    }
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
    refetch: fetchAllData,
  };
}