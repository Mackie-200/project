import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('psf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('psf_token');
      if (token) {
        try {
          const response = await apiCall('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('psf_token');
          localStorage.removeItem('psf_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const { user: userData, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('psf_token', token);
      localStorage.setItem('psf_user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('psf_token');
    localStorage.removeItem('psf_user');
    toast.success('Logged out successfully');
  };

  const signup = async ({ name, email, phone, password, role, businessName }) => {
    try {
      setLoading(true);
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          password, 
          role: role || 'user',
          businessName 
        }),
      });
      
      const { user: userData, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('psf_token', token);
      localStorage.setItem('psf_user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Registration successful!');
      return { success: true, user: userData };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 