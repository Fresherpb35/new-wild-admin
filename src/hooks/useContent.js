import { useState, useEffect, useCallback } from "react";
import api, {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/api"; // Added 'api' import for custom calls

export function useContent(toastFn) {
  const [blogs, setBlogs] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [siteInfo, setSiteInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const toast = toastFn ?? (() => {});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Axios automatically handles VITE_API_URL and Token
      const [blogsRes, hotelsRes] = await Promise.allSettled([
        getBlogs(),
        api.get("/hotels"), 
      ]);

      if (blogsRes.status === "fulfilled") {
        // Axios uses .data, no need for .json()
        const data = blogsRes.value?.data?.data || blogsRes.value?.data || [];
        setBlogs(Array.isArray(data) ? data : []);
      }

      if (hotelsRes.status === "fulfilled") {
        const res = hotelsRes.value; // Axios instance already returns res.data if configured
        const hotelList = res.success ? res.data || [] : (Array.isArray(res) ? res : []);
        setHotels(hotelList);
        if (hotelList.length > 0) setSiteInfo(hotelList[0]);
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
      toast("Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── HOTEL CRUD (Now using Axios) ──────────────────────────────────────────

  const addHotel = async (formData) => {
    try {
      const res = await api.post("/hotels", formData);
      if (res.success) {
        setHotels((prev) => [res.data, ...prev]);
        toast("Hotel added successfully!", "success");
        return res.data;
      }
    } catch (err) {
      toast("Failed to add hotel", "error");
    }
  };

  const updateHotel = async (id, formData) => {
    try {
      const res = await api.put(`/hotels/${id}`, formData);
      if (res.success) {
        setHotels((prev) => prev.map((h) => (h.id === id || h._id === id ? res.data : h)));
        toast("Hotel updated successfully", "success");
        return res.data;
      }
    } catch (err) {
      toast("Failed to update hotel", "error");
    }
  };

  const deleteHotel = async (id) => {
    try {
      const res = await api.delete(`/hotels/${id}`);
      if (res.success) {
        setHotels((prev) => prev.filter((h) => h.id !== id && h._id !== id));
        toast("Hotel deleted successfully", "success");
      }
    } catch (err) {
      toast("Failed to delete hotel", "error");
    }
  };

  // ─── BLOG CRUD ─────────────────────────────────────────────────────────────

  const addBlog = async (formData) => {
    try {
      const res = await createBlog(formData);
      const newBlog = res?.data?.data || res?.data || res || {};
      setBlogs((p) => [newBlog, ...p]);
      toast("Blog created successfully!", "success");
    } catch (err) {
      toast("Failed to create blog", "error");
    }
  };

  const editBlog = async (id, formData) => {
    try {
      const res = await updateBlog(id, formData);
      const updated = res?.data?.data || res?.data || res || {};
      setBlogs((p) => p.map((b) => (b.id === id || b._id === id ? { ...b, ...updated } : b)));
      toast("Blog updated successfully", "success");
    } catch (err) {
      toast("Failed to update blog", "error");
    }
  };

  const removeBlog = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs((p) => p.filter((b) => b.id !== id && b._id !== id));
      toast("Blog deleted", "success");
    } catch (err) {
      toast("Failed to delete blog", "error");
    }
  };

  const flipPublish = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id || b._id === id);
      if (!blog) return;
      const newPublished = !blog.published;
      await updateBlog(id, { published: newPublished });
      setBlogs((p) =>
        p.map((b) => (b.id === id || b._id === id ? { ...b, published: newPublished } : b))
      );
      toast(newPublished ? "Blog published" : "Blog unpublished", "success");
    } catch (err) {
      toast("Update failed", "error");
    }
  };

  const saveSite = async (data) => {
    if (!hotels.length) {
      toast("No hotel found. Please add a hotel first.", "error");
      return;
    }
    const mainHotelId = hotels[0].id || hotels[0]._id;
    const payload = {
      name: (data.name || data.hotelName || "").trim(),
      img: (data.img || "").trim(),
      tag: (data.tag || "").trim() || null,
      desc: (data.desc || data.hotelDesc || "").trim(),
      sortOrder: parseInt(data.sortOrder) || 0,
      isActive: data.isActive ?? true,
    };

    try {
      const res = await api.put(`/hotels/${mainHotelId}`, payload);
      if (res.success) {
        await fetchAll();
        toast("Hotel saved successfully!", "success");
      }
    } catch (err) {
      toast(err.response?.data?.message || "Failed to save", "error");
    }
  };

  return {
    blogs,
    hotels,
    siteInfo,
    loading,
    addBlog,
    editBlog,
    removeBlog,
    flipPublish,
    addHotel,
    updateHotel,
    deleteHotel,
    saveSite,
    refetch: fetchAll,
  };
}