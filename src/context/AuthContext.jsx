import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simulated user database (in a real MERN app this hits MongoDB via Express)
const MOCK_USERS_KEY = 'foodloop_users';
const AUTH_KEY = 'foodloop_auth';
const KITCHEN_KEY = 'foodloop_kitchens'; // stores kitchen profiles keyed by userId

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const getKitchens = () => {
  try {
    return JSON.parse(localStorage.getItem(KITCHEN_KEY)) || {};
  } catch {
    return {};
  }
};

// Ensure demo account always exists
const seedDemoUser = () => {
  const users = getStoredUsers();
  const hasDemo = users.some((u) => u.email === 'demo@foodloop.com');
  if (!hasDemo) {
    const demo = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@foodloop.com',
      password: 'demo1234',
      restaurant: 'The Green Plate (Restaurant)',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, demo]));
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [kitchenProfile, setKitchenProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    seedDemoUser();
    try {
      const saved = JSON.parse(localStorage.getItem(AUTH_KEY));
      if (saved) {
        setUser(saved);
        // Also restore kitchen profile
        const kitchens = getKitchens();
        if (kitchens[saved.id]) setKitchenProfile(kitchens[saved.id]);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  // --- Signup (Step 1) — creates account but does NOT log in yet ---
  // Returns { success, userId } so Step 2 can save kitchen profile
  const signup = ({ name, email, password, restaurant, role }) => {
    const users = getStoredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, message: 'An account with this email already exists.' };

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // NOTE: plain text only for demo — use bcrypt in real backend
      restaurant: restaurant || 'My Restaurant',
      role: role || 'kitchen', // 'kitchen' | 'ngo' | 'agent'
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, newUser]));
    return { success: true, userId: newUser.id, user: newUser };
  };

  // --- Complete registration — saves session after Step 2 (or skip) ---
  const completeRegistration = (newUser) => {
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, restaurant: newUser.restaurant, role: newUser.role };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    setUser(session);
  };

  // --- Save kitchen profile (Step 2) ---
  const saveKitchenProfile = (userId, profile) => {
    const kitchens = getKitchens();
    const updated = { ...kitchens, [userId]: { ...profile, savedAt: new Date().toISOString() } };
    localStorage.setItem(KITCHEN_KEY, JSON.stringify(updated));
    setKitchenProfile(profile);
    return { success: true };
  };

  // --- Login ---
  const login = ({ email, password }) => {
    const users = getStoredUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) return { success: false, message: 'Invalid email or password.' };

    const session = { id: match.id, name: match.name, email: match.email, restaurant: match.restaurant };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    setUser(session);

    // Restore kitchen profile
    const kitchens = getKitchens();
    if (kitchens[match.id]) setKitchenProfile(kitchens[match.id]);

    return { success: true };
  };

  // --- Logout ---
  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setKitchenProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, signup,
      completeRegistration, saveKitchenProfile,
      kitchenProfile, isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
