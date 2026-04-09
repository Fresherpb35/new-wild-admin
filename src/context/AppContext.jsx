import { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as bookingSvc from "../services/bookingService";
import * as blogSvc    from "../services/blogService";
import { getErrorMsg } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ── data state ── */
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({ 
    total: 0, 
    confirmed: 0, 
    pending: 0, 
    cancelled: 0, 
    revenue: 0 
  });
  const [blogs, setBlogs] = useState([]);

  /* ── loading flags ── */
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  /* ── toasts ── */
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const toastError = useCallback((err, fallback = "Operation failed") => {
    toast(getErrorMsg(err) || fallback, "error");
  }, [toast]);

  /* ════════════════════════════════════════
      BOOKINGS LOGIC
  ════════════════════════════════════════ */
  const fetchBookings = useCallback(async (params = {}) => {
    setLoadingBookings(true);
    try {
      const res = await bookingSvc.getBookings(params);
      const list = Array.isArray(res) ? res : (res?.bookings ?? res?.data ?? []);
      setBookings(list);
    } catch (err) {
      toastError(err, "Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  }, [toastError]);

  const fetchBookingStats = useCallback(async () => {
    try {
      const res = await bookingSvc.getBookingStats();
      if (res) setBookingStats(res);
    } catch (_) {
      /* Silently compute from local list if API fails */
      setBookingStats({
        total: bookings.length,
        confirmed: bookings.filter(b => b.status?.toLowerCase() === "confirmed").length,
        pending: bookings.filter(b => b.status?.toLowerCase() === "pending").length,
        cancelled: bookings.filter(b => b.status?.toLowerCase() === "cancelled").length,
        revenue: 0,
      });
    }
  }, [bookings]);

  const addBooking = useCallback(async (data) => {
    try {
      const res = await bookingSvc.createBooking(data);
      const newBooking = res?.booking ?? res?.data ?? res;
      setBookings(p => [newBooking, ...p]);
      toast(`Booking ${newBooking?.id ?? ""} added successfully`);
      fetchBookingStats();
      return true;
    } catch (err) {
      toastError(err, "Failed to add booking");
      return false;
    }
  }, [toast, toastError, fetchBookingStats]);

  const updateBooking = useCallback(async (id, data) => {
    try {
      const res = await bookingSvc.updateBooking(id, data);
      const updated = res?.booking ?? res?.data ?? res;
      setBookings(p => p.map(b => (b.id === id || b.id === updated?.id) ? { ...b, ...updated } : b));
      toast("Booking updated successfully");
      fetchBookingStats();
      return true;
    } catch (err) {
      toastError(err, "Failed to update booking");
      return false;
    }
  }, [toast, toastError, fetchBookingStats]);

  const deleteBooking = useCallback(async (id) => {
    try {
      await bookingSvc.deleteBooking(id);
      setBookings(p => p.filter(b => b.id !== id));
      toast("Booking deleted", "error");
      fetchBookingStats();
      return true;
    } catch (err) {
      toastError(err, "Failed to delete booking");
      return false;
    }
  }, [toast, toastError, fetchBookingStats]);

  const deleteBookings = useCallback(async (ids) => {
    try {
      await bookingSvc.deleteBulkBookings(ids);
      setBookings(p => p.filter(b => !ids.includes(b.id)));
      toast(`${ids.length} booking(s) deleted`, "error");
      fetchBookingStats();
      return true;
    } catch (err) {
      toastError(err, "Failed to delete bookings");
      return false;
    }
  }, [toast, toastError, fetchBookingStats]);

  /* ════════════════════════════════════════
      BLOGS LOGIC
  ════════════════════════════════════════ */
  const fetchBlogs = useCallback(async () => {
    setLoadingBlogs(true);
    try {
      const res = await blogSvc.getBlogs();
      const list = Array.isArray(res) ? res : (res?.blogs ?? res?.data ?? []);
      setBlogs(list);
    } catch (err) {
      toastError(err, "Failed to load blogs");
    } finally {
      setLoadingBlogs(false);
    }
  }, [toastError]);

  const addBlog = useCallback(async (data) => {
    try {
      const res = await blogSvc.createBlog(data);
      const newBlog = res?.blog ?? res?.data ?? res;
      setBlogs(p => [newBlog, ...p]);
      toast("Blog post added");
      return true;
    } catch (err) {
      toastError(err, "Failed to add blog");
      return false;
    }
  }, [toast, toastError]);

  const updateBlog = useCallback(async (id, data) => {
    try {
      const res = await blogSvc.updateBlog(id, data);
      const updated = res?.blog ?? res?.data ?? res;
      setBlogs(p => p.map(b => b.id === id ? { ...b, ...updated } : b));
      toast("Blog post updated");
      return true;
    } catch (err) {
      toastError(err, "Failed to update blog");
      return false;
    }
  }, [toast, toastError]);

  const deleteBlog = useCallback(async (id) => {
    try {
      await blogSvc.deleteBlog(id);
      setBlogs(p => p.filter(b => b.id !== id));
      toast("Blog post deleted", "error");
      return true;
    } catch (err) {
      toastError(err, "Failed to delete blog");
      return false;
    }
  }, [toast, toastError]);

  const toggleBlogPublish = useCallback(async (id) => {
    try {
      const res = await blogSvc.toggleBlogPublish(id);
      const updated = res?.blog ?? res?.data ?? res;
      setBlogs(p => p.map(b => b.id === id ? { ...b, ...updated } : b));
      toast("Blog status updated");
      return true;
    } catch (err) {
      toastError(err, "Failed to update blog status");
      return false;
    }
  }, [toast, toastError]);

  /* ── Initial data load ── */
  useEffect(() => {
    fetchBookings();
    fetchBookingStats();
    fetchBlogs();
    // ❌ Removed fetchGallery and fetchSiteInfo to prevent 404s
  }, [fetchBookings, fetchBookingStats, fetchBlogs]);

  return (
    <AppContext.Provider value={{
      /* bookings */
      bookings, loadingBookings, bookingStats,
      fetchBookings, fetchBookingStats,
      addBooking, updateBooking, deleteBooking, deleteBookings,
      /* blogs */
      blogs, loadingBlogs,
      fetchBlogs, addBlog, updateBlog, deleteBlog, toggleBlogPublish,
      /* toasts */
      toasts, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);