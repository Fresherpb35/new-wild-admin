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

// src/services/bookingService.js

export const updateBooking = async (id, data) => {
  // 1. Destructure karke unwanted fields ko alag karein
  // Hum 'id', 'createdAt', 'updatedAt' ko 'rest' se nikaal rahe hain
  const { id: _unusedId, createdAt, updatedAt, ...cleanData } = data;

  console.log("Sending Clean Data to Backend:", cleanData);

  try {
    const res = await api.put(`/bookings/${id}`, cleanData, {
      timeout: 60000 // 1 minute timeout for Render
    });
    return res.data;
  } catch (error) {
    console.error("Update failed:", error.response?.data || error.message);
    throw error;
  }
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