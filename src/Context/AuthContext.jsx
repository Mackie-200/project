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
    name: "Irene Smith",
    email: "irenes@gmail.com",
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
  const [users, setUsers] = useState([...mockUsers]);

  useEffect(() => {
    const storedUser = localStorage.getItem("psf_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = ({ email, password, role }) => {
    // Accept any email and password for now
    const foundUser = {
      id: Date.now().toString(),
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

  const signup = ({ name, email, phone, password, role }) => {
    if (users.some((u) => u.email === email)) {
      return { error: "Email already registered" };
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      passwordHash: password,
      role: role || "user",
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem("psf_user", JSON.stringify(newUser));
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 