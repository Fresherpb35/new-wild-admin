import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/* ── Token Helpers ── */
export const getToken = () => localStorage.getItem("wrs_token");
export const setToken = (tok) => localStorage.setItem("wrs_token", tok);
export const clearToken = () => {
  localStorage.removeItem("wrs_token");
  localStorage.removeItem("wrs_user");
};

/* ── Single Request Interceptor ── */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Important for file uploads (like blog image)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response Interceptor (Global 401 Handling) ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - Clearing token");
      clearToken();

      // Optional: Auto redirect to login
      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const getErrorMsg = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

// ─────────────────────────────────────────────────────────────
//  Existing APIs
// ─────────────────────────────────────────────────────────────

// Blog APIs
export const getBlogs = () => api.get("/blogs");
export const createBlog = (data) => api.post("/blogs", data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

// Hotel Content APIs
export const getHotelContent = () => api.get("/hotel");
export const updateHotelContent = (data) => api.put("/hotel", data);
export const toggleBlogPublish = (id) => api.patch(`/blogs/${id}/toggle-publish`);

// ─────────────────────────────────────────────────────────────
//  Booking APIs  ←←← Add these if not already present
// ─────────────────────────────────────────────────────────────
export const getBookings = () => api.get("/bookings");
export const createBooking = (data) => api.post("/bookings", data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const deleteBulkBookings = (ids) => api.post("/bookings/bulk-delete", { ids });

export const getBookingStats = () => api.get("/bookings/stats");