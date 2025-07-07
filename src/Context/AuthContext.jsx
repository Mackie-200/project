import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const mockUsers = [
  {
    id: "1",
    name: "micheal mutisi",
    email: "john@example.com",
    phone: "1234567890",
    passwordHash: "password123", 
    role: "admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    passwordHash: "mypassword",
    role: "owner",
  },
  {
    id: "3",
    name: "Bob User",
    email: "bob@example.com",
    phone: "5555555555",
    passwordHash: "userpass",
    role: "user",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("psf_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = ({ email, password, role }) => {
    const foundUser = {
      id: "demo-id",
      name: email.split("@")[0] || "Demo User",
      email,
      phone: "0000000000",
      passwordHash: password,
      role: role || "user", 
    };
    setUser(foundUser);
    localStorage.setItem("psf_user", JSON.stringify(foundUser));
    return foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("psf_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 