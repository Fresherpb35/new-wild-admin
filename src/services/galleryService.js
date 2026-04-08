import api from "./api";

export const getGallery        = ()        => api.get("/gallery");
export const addGalleryItem    = (data)    => api.post("/gallery", data);
export const deleteGalleryItem = (id)      => api.delete(`/gallery/${id}`);
