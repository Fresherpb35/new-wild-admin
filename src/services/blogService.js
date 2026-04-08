import api from "./api";

export const getBlogs          = ()        => api.get("/blogs");
export const createBlog        = (data)    => api.post("/blogs", data);
export const updateBlog        = (id, data)=> api.put(`/blogs/${id}`, data);
export const deleteBlog        = (id)      => api.delete(`/blogs/${id}`);
export const toggleBlogPublish = (id)      => api.patch(`/blogs/${id}/toggle-publish`);
