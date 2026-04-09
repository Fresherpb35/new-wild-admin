import { useState, useEffect, useCallback } from "react";
import api, { getBlogs, createBlog, updateBlog, deleteBlog } from "../services/api";

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
        api.get("/hotels"),
      ]);

      // blogs logic
      if (blogsRes.status === "fulfilled") {
        const data = blogsRes.value?.data?.data || blogsRes.value?.data || [];
        setBlogs(Array.isArray(data) ? data : []);
      }

      // hotels logic - Fix for Admin visibility
      if (hotelsRes.status === "fulfilled") {
        const fullResponse = hotelsRes.value.data; 
        const hotelList = fullResponse?.success ? (fullResponse.data || []) : (Array.isArray(fullResponse) ? fullResponse : []);
        
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

  const addHotel = async (formData) => {
    try {
      const res = await api.post("/hotels", formData);
      const resData = res.data;
      if (resData.success || res.status === 201) {
        const newHotel = resData.data || resData;
        setHotels((prev) => [newHotel, ...prev]);
        toast("Hotel added successfully!", "success");
        return newHotel;
      }
    } catch (err) {
      toast("Failed to add hotel", "error");
    }
  };

  const updateHotel = async (id, formData) => {
    try {
      const res = await api.put(`/hotels/${id}`, formData);
      const resData = res.data;
      if (resData.success || res.status === 200) {
        const updatedHotel = resData.data || resData;
        setHotels((prev) => prev.map((h) => (h.id === id || h._id === id ? updatedHotel : h)));
        toast("Hotel updated successfully", "success");
        return updatedHotel;
      }
    } catch (err) {
      toast("Failed to update hotel", "error");
    }
  };

  const deleteHotel = async (id) => {
    try {
      const res = await api.delete(`/hotels/${id}`);
      if (res.status === 200 || res.data?.success) {
        setHotels((prev) => prev.filter((h) => h.id !== id && h._id !== id));
        toast("Hotel deleted successfully", "success");
      }
    } catch (err) {
      toast("Failed to delete hotel", "error");
    }
  };

  // Blog CRUD
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
      setBlogs((p) => p.map((b) => (b.id === id || b._id === id ? { ...b, published: newPublished } : b)));
      toast(newPublished ? "Blog published" : "Blog unpublished", "success");
    } catch (err) {
      toast("Update failed", "error");
    }
  };

  return {
    blogs, hotels, siteInfo, loading,
    addBlog, editBlog, removeBlog, flipPublish,
    addHotel, updateHotel, deleteHotel, refetch: fetchAll
  };
}