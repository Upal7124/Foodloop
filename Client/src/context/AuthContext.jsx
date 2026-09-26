import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Simulated user database (in a real MERN app this hits MongoDB via Express)
const AUTH_KEY = "foodloop_auth";
const KITCHEN_KEY = "foodloop_kitchens"; // stores kitchen profiles keyed by userId

const getKitchens = () => {
  try {
    return JSON.parse(localStorage.getItem(KITCHEN_KEY)) || {};
  } catch {
    return {};
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [kitchenProfile, setKitchenProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUTH_KEY));
      const token = localStorage.getItem("token");

      if (saved && token) {
        {
          setUser(saved);
          // Also restore kitchen profile
          const kitchens = getKitchens();
          if (kitchens[saved.id]) setKitchenProfile(kitchens[saved.id]);
        }
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  // --- Signup (Step 1) — creates account but does NOT log in yet ---
  // Returns { success, userId } so Step 2 can save kitchen profile
  const signup = async ({ name, email, password, restaurant, role }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role || "donor",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Signup failed.",
        };
      }
      localStorage.setItem("token", data.token);
      return {
        success: true,
        userId: data.user.id,
        user: data.user,
      };
    } catch (error) {
      console.error("Signup error:", error);

      return {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  };
  // --- Complete registration — saves session after Step 2 (or skip) ---
  const completeRegistration = (newUser) => {
    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      restaurant: newUser.restaurant,
      role: newUser.role,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    setUser(session);
  };

  // --- Save kitchen profile (Step 2) ---
  const saveKitchenProfile = async (userId, profileData) => {
    try {
      const response = await fetch("http://localhost:5000/api/kitchen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Kitchen profile error:", data.message);
        return { success: false, message: data.message };
      }

      return { success: true, profile: data.profile };
    } catch (error) {
      console.error("Kitchen profile error:", error);
      return { success: false, message: "Unable to save kitchen profile." };
    }
  };

  // --- Login ---
  const login = async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Invalid email or password.",
        };
      }

      const session = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      setUser(session);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  };

  // --- Logout ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setKitchenProfile(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        completeRegistration,
        saveKitchenProfile,
        kitchenProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
