import api, { setToken, clearToken } from "./api";

/** POST /auth/login → { token, user } */
export async function login(email, password) {
  const data = await api.post("/admin/login", { email, password });
  if (data?.token) {
    setToken(data.token);
    localStorage.setItem("wrs_user", JSON.stringify(data.user || {}));
  }
  return data;
}

/** POST /auth/logout */
export async function logout() {
  try { await api.post("/auth/logout"); } catch (_) {}
  finally { clearToken(); }
}

/** GET /auth/me */
export async function getMe() {
  return api.get("/auth/me");
}
