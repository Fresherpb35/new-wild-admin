// src/services/bookingService.js
import api from "./api";

// ✅ ALWAYS return clean data

export const getBookings = async () => {
  const res = await api.get("/bookings");

  // handle all possible backend formats
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.bookings)) return res.data.bookings;
  if (Array.isArray(res.data?.data)) return res.data.data;

  return []; // fallback
};

export const createBooking = async (data) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

export const updateBooking = async (id, data) => {
  const res = await api.put(`/bookings/${id}`, data);
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};

export const deleteBulkBookings = async (ids) => {
  const res = await api.post("/bookings/bulk-delete", { ids });
  return res.data;
};

export const getBookingStats = async () => {
  const res = await api.get("/bookings/stats");
  return res.data;
};