import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();


const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
    console.log('Making API call to:', url);
    console.log('Config:', config);
    
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Check if response is ok
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON response');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Server returned invalid response. Please check if the backend is running correctly.');
    }
    throw error;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
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
      console.log('Attempting login with:', { email });
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const { user: userData, token } = response.data;
      
      
      localStorage.setItem('psf_token', token);
      localStorage.setItem('psf_user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
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
      console.log('Attempting signup with:', { name, email, phone, role });
      
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
      
      console.log('Signup response:', response);
      
      
      if (!response.success || !response.token || !response.user) {
        throw new Error(response.message || 'Invalid response from server');
      }
      
      const { user: userData, token } = response;
      
    
      localStorage.setItem('psf_token', token);
      localStorage.setItem('psf_user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Account created successfully!');
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  
  const apiRequest = async (endpoint, options = {}) => {
    return await apiCall(endpoint, options);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading, apiRequest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 