import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  deleteBulkBookings,
  getBookingStats,
} from "../services/bookingService";

// Utility: simple debounce
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);

  const debouncedSearch = useDebounce(search, 300);

  // Fetch bookings once
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBookings();
      let data = [];
      if (Array.isArray(res?.data)) data = res.data;
      else if (Array.isArray(res)) data = res;
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError(err.message || "Failed to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Derived stats from local state
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status?.toUpperCase() === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status?.toUpperCase() === "PENDING").length;
    const cancelled = bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED").length;
    return { total, confirmed, pending, cancelled };
  }, [bookings]);

  // Filtered bookings (debounced search)
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
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
  }, [bookings, debouncedSearch, filter]);

  // Selection handlers
  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === filtered.length && filtered.length > 0 ? [] : filtered.map((b) => b.id)
    );

  // CRUD operations
  const addBooking = async (data) => {
    const res = await createBooking(data);
    const newBooking = res?.data || res;
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const editBooking = async (id, data) => {
    if (!id) throw new Error("ID is required to edit booking");
    const res = await updateBooking(id, data);
    const updated = res?.data || res;
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    return updated;
  };

  const removeBooking = async (id) => {
    if (!id) throw new Error("ID is required to delete booking");
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
  };

  const removeSelected = async () => {
    if (!selected.length) return;
    await deleteBulkBookings(selected);
    setBookings((prev) => prev.filter((b) => !selected.includes(b.id)));
    setSelected([]);
  };

  return {
    bookings,
    filtered,
    stats,
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