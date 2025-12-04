import { AuthContext } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cheats, setCheats] = useState([]);
  
  const loggedIn = Boolean(userData);
  const API_URL = "http://localhost:5555";


  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/check_session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.logged_in) {
          setUserData(data.user);
          setLanguages(data.languages || []);
          setCategories(data.categories || []);
          
          // Extract flat cheats list from nested languages
          const allCheats = (data.languages || []).flatMap(lang => 
            (lang.cheats || []).map(cheat => ({
              ...cheat,
              language: { id: lang.id, name: lang.name }
            }))
          );
          setCheats(allCheats);
        } else {
          setUserData(null);
          setLanguages([]);
          setCategories([]);
          setCheats([]);
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
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
      setUserData(null);
      setLanguages([]);
      setCategories([]);
      setCheats([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

    // Update nested languages
    setLanguages(prev => prev.map(lang => 
      lang.id === newCheat.language_id
        ? { ...lang, cheats: [...(lang.cheats || []), newCheat] }
        : lang
    ));

    // Update nested categories
    setCategories(prev => prev.map(cat => 
      cat.id === newCheat.category_id
        ? { ...cat, cheats: [...(cat.cheats || []), newCheat] }
        : cat
    ));

    // Update flat cheats list (newCheat already has language/category from backend)
    setCheats(prev => [...prev, newCheat]);

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

    const updatedCheat = await res.json();

    // Update languages: remove from old, add to new
    setLanguages(prev => prev
      .map(lang => ({
        ...lang,
        cheats: lang.cheats.filter(c => c.id !== updatedCheat.id) // Remove from all
      }))
      .map(lang => 
        lang.id === updatedCheat.language_id
          ? { ...lang, cheats: [...lang.cheats, updatedCheat] } // Add to new language
          : lang
      )
      .filter(lang => lang.cheats.length > 0) // Remove empty languages
    );

    // Update categories: remove from old, add to new
    setCategories(prev => prev
      .map(cat => ({
        ...cat,
        cheats: cat.cheats.filter(c => c.id !== updatedCheat.id) // Remove from all
      }))
      .map(cat => 
        cat.id === updatedCheat.category_id
          ? { ...cat, cheats: [...cat.cheats, updatedCheat] } // Add to new category
          : cat
      )
      .filter(cat => cat.cheats.length > 0) // Remove empty categories
    );

    // Update flat cheats list
    setCheats(prev => prev.map(cheat => 
      cheat.id === updatedCheat.id ? updatedCheat : cheat
    ));

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

    // Remove from nested languages and filter out empty ones
    setLanguages(prev => prev
      .map(lang => ({
        ...lang,
        cheats: lang.cheats.filter(cheat => cheat.id !== cheatId)
      }))
      .filter(lang => lang.cheats.length > 0) // ✅ Remove languages with no cheats
    );

    // Remove from nested categories and filter out empty ones
    setCategories(prev => prev
      .map(cat => ({
        ...cat,
        cheats: cat.cheats.filter(cheat => cheat.id !== cheatId)
      }))
      .filter(cat => cat.cheats.length > 0) // ✅ Remove categories with no cheats
    );

    // Remove from flat cheats list
    setCheats(prev => prev.filter(cheat => cheat.id !== cheatId));

    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error" };
  }
}

  const value = {
    loading,
    loggedIn,
    userData,
    languages,
    categories,
    cheats,
    signup,
    login,
    logout,
    checkSession,
    createCheat,
    updateCheat,
    deleteCheat
  };

  if (loading) {
    return <div style={{ background: '#0a0a0a', color: '#33aa33', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>LOADING...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}