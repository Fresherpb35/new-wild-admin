import { useState, useEffect, useCallback } from "react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/api";

// Use env variable only
const API_BASE = import.meta.env.VITE_API_URL;

export function useContent(toastFn) {
  const [blogs, setBlogs] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [siteInfo, setSiteInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const toast = toastFn ?? (() => {});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [blogsRes, hotelsRes] = await Promise.allSettled([
        getBlogs(),
        fetch(`${API_BASE}/hotels`),
      ]);

      if (blogsRes.status === "fulfilled") {
        const data = blogsRes.value?.data?.data || blogsRes.value?.data || [];
        setBlogs(Array.isArray(data) ? data : []);
      }

      if (hotelsRes.status === "fulfilled") {
        const res = await hotelsRes.value.json();
        const hotelList = res.success ? res.data || [] : [];
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

  // hotel CRUD
  const addHotel = async (formData) => {
    const res = await fetch(`${API_BASE}/hotels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (result.success) {
      setHotels((prev) => [result.data, ...prev]);
      toast("Hotel added successfully!", "success");
      return result.data;
    }
    toast("Failed to add hotel", "error");
  };

  const updateHotel = async (id, formData) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (result.success) {
      setHotels((prev) => prev.map((h) => (h.id === id ? result.data : h)));
      toast("Hotel updated successfully", "success");
      return result.data;
    }
    toast("Failed to update hotel", "error");
  };

  const deleteHotel = async (id) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) {
      setHotels((prev) => prev.filter((h) => h.id !== id));
      toast("Hotel deleted successfully", "success");
    } else {
      toast("Failed to delete hotel", "error");
    }
  };

  // blogs
  const addBlog = async (formData) => {
    const res = await createBlog(formData);
    const newBlog = res?.data?.data || res?.data || {};
    setBlogs((p) => [newBlog, ...p]);
    toast("Blog created successfully!");
  };

  const editBlog = async (id, formData) => {
    const res = await updateBlog(id, formData);
    const updated = res?.data?.data || res?.data || {};
    setBlogs((p) => p.map((b) => (b.id === id || b._id === id ? { ...b, ...updated } : b)));
    toast("Blog updated successfully");
  };

  const removeBlog = async (id) => {
    await deleteBlog(id);
    setBlogs((p) => p.filter((b) => b.id !== id && b._id !== id));
    toast("Blog deleted");
  };

  const flipPublish = async (id) => {
    const blog = blogs.find((b) => b.id === id || b._id === id);
    if (!blog) return;
    const newPublished = !blog.published;
    await updateBlog(id, { published: newPublished });
    setBlogs((p) =>
      p.map((b) => (b.id === id || b._id === id ? { ...b, published: newPublished } : b))
    );
    toast(newPublished ? "Blog published" : "Blog unpublished");
  };

  const saveSite = async (data) => {
    if (!hotels.length) {
      toast("No hotel found. Please add a hotel first.", "error");
      return;
    }
    const mainHotelId = hotels[0].id;
    const payload = {
      name: (data.name || data.hotelName || "").trim(),
      img: (data.img || "").trim(),
      tag: (data.tag || "").trim() || null,
      desc: (data.desc || data.hotelDesc || "").trim(),
      sortOrder: parseInt(data.sortOrder) || 0,
      isActive: data.isActive ?? true,
    };
    const res = await fetch(`${API_BASE}/hotels/${mainHotelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      await fetchAll();
      toast("Hotel saved successfully!", "success");
    } else {
      toast(result.message || "Failed to save", "error");
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