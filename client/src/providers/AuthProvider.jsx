import { AuthContext } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // ONE state for everything
  const [allLanguages, setAllLanguages] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const loggedIn = Boolean(user);
  const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

  useEffect(() => {
    checkSession();
    fetchAllLanguages();
    fetchAllCategories();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/check_session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.logged_in) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLanguages = async () => {
    try {
      const res = await fetch(`${API_URL}/languages`);
      const data = await res.json();
      setAllLanguages(data);
    } catch (err) {
      console.error("Failed to fetch languages:", err);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setAllCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  async function signup(credentials) {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        await checkSession();
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  }

  async function login(credentials) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        await checkSession();
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ THE "IOU" PATTERN - Just update the flat list
  async function createCheat(newCheatData) {
    try {
      const res = await fetch(`${API_URL}/cheats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newCheatData),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.message };
      }

      const newCheat = await res.json();

      // Just refetch - simplest solution
      await checkSession();

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  }

  async function updateCheat(cheatId, updatedData) {
    try {
      const res = await fetch(`${API_URL}/cheats/${cheatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.message };
      }

      // Just refetch
      await checkSession();

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  }

  async function deleteCheat(cheatId) {
    try {
      const res = await fetch(`${API_URL}/cheats/${cheatId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.message };
      }

      // Just refetch
      await checkSession();

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  }

  const value = {
    loading,
    loggedIn,
    user, // ✅ Everything is here: user.languages, user.categories
    allLanguages,
    allCategories,
    signup,
    login,
    logout,
    checkSession,
    createCheat,
    updateCheat,
    deleteCheat,
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#0a0a0a",
          color: "#33aa33",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        LOADING...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
