import api from "./api";

export const getSiteInfo    = ()     => api.get("/site-info");
export const updateSiteInfo = (data) => api.put("/site-info", data);
