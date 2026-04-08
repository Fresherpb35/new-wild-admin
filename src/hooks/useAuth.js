import { useState, useEffect, useCallback } from "react";
import * as authSvc from "../services/authService";
import { getToken, clearToken, setToken } from "../services/api"; // ✅ added setToken
import { getErrorMsg } from "../services/api";

/**
 * Handles login, logout, token persistence, and session restore.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  /* ── Restore session from localStorage ── */
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }

    authSvc
      .getMe()
      .then((res) => {
        const u = res?.user ?? res?.admin ?? res;
        setUser(u);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setChecking(false));
  }, []);

  /* ── Listen for forced logout (401 from interceptor) ── */
  useEffect(() => {
    const handler = () => {
      setUser(null);
    };
    window.addEventListener("wrs:logout", handler);
    return () => window.removeEventListener("wrs:logout", handler);
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    setError("");

    // validation
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setLoading(true);
    try {
      const res = await authSvc.login(email, password);

      console.log("LOGIN RESPONSE:", res); // 🔍 debug (remove later)

      // ✅ IMPORTANT: store token properly
      const token = res?.token || res?.data?.token;
      if (!token) {
        throw new Error("Token not received from server");
      }

      setToken(token); // 🔥 MAIN FIX

      const u = res?.user ?? res?.admin ?? res?.data?.admin ?? {};
      setUser(u);

      return true;
    } catch (err) {
      setError(getErrorMsg(err) || "Invalid email or password.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await authSvc.logout();
    clearToken(); // ✅ also clear token
    setUser(null);
  }, []);

  const isLoggedIn = Boolean(user) || Boolean(getToken());

  return { user, isLoggedIn, checking, loading, error, login, logout };
}