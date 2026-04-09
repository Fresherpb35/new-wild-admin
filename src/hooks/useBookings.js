import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  deleteBulkBookings,
} from "../services/bookingService";

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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBookings();
      let data = Array.isArray(res) ? res : (res?.data || res?.bookings || []);
      setBookings(data);
    } catch (err) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status?.toUpperCase() === "CONFIRMED").length,
      pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING").length,
      cancelled: bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED").length,
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return bookings.filter((b) => {
      const status = b.status?.toUpperCase() || "";
      const matchFilter = filter === "All" || status === filter.toUpperCase();
      if (!matchFilter) return false;
      if (!q) return true;

      const name = (b.name || b.guestName || "").toLowerCase();
      const email = (b.email || b.guestEmail || "").toLowerCase();
      const bid = (b.id || b._id || "").toString().toLowerCase();

      return name.includes(q) || email.includes(q) || bid.includes(q);
    });
  }, [bookings, debouncedSearch, filter]);

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === filtered.length && filtered.length > 0 
        ? [] 
        : filtered.map((b) => b.id || b._id)
    );

  const addBooking = async (data) => {
    const res = await createBooking(data);
    const newBooking = res?.data || res?.booking || res;
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const editBooking = async (id, data) => {
    const res = await updateBooking(id, data);
    const updated = res?.data || res?.booking || res;
    setBookings((prev) => 
      prev.map((b) => ( (b.id || b._id) === id ? { ...b, ...updated } : b ))
    );
    return updated;
  };

  const removeBooking = async (id) => {
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => (b.id || b._id) !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
  };

  const removeSelected = async () => {
    if (!selected.length) return;
    await deleteBulkBookings(selected);
    setBookings((prev) => prev.filter((b) => !selected.includes(b.id || b._id)));
    setSelected([]);
  };

  return {
    bookings, filtered, stats, loading, error, search, setSearch,
    filter, setFilter, selected, toggleSelect, toggleAll,
    addBooking, editBooking, removeBooking, removeSelected, refetch: fetchBookings,
  };
}