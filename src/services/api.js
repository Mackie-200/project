// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('psf_token');
  }

  // Make authenticated API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Parking spaces endpoints
  async getParkingSpaces(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/parking-spaces${queryParams ? `?${queryParams}` : ''}`);
  }

  async getParkingSpace(id) {
    return this.request(`/parking-spaces/${id}`);
  }

  async createParkingSpace(spaceData) {
    return this.request('/parking-spaces', {
      method: 'POST',
      body: JSON.stringify(spaceData),
    });
  }

  async updateParkingSpace(id, spaceData) {
    return this.request(`/parking-spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(spaceData),
    });
  }

  async deleteParkingSpace(id) {
    return this.request(`/parking-spaces/${id}`, {
      method: 'DELETE',
    });
  }

  async getOwnerSpaces(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/parking-spaces/owner/my-spaces${queryParams ? `?${queryParams}` : ''}`);
  }

  // Bookings endpoints
  async getBookings(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/bookings${queryParams ? `?${queryParams}` : ''}`);
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(id, statusData) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async checkInBooking(id, checkInData) {
    return this.request(`/bookings/${id}/checkin`, {
      method: 'POST',
      body: JSON.stringify(checkInData),
    });
  }

  async checkOutBooking(id, checkOutData) {
    return this.request(`/bookings/${id}/checkout`, {
      method: 'POST',
      body: JSON.stringify(checkOutData),
    });
  }

  async getOwnerBookings(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/bookings/owner/my-bookings${queryParams ? `?${queryParams}` : ''}`);
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/users${queryParams ? `?${queryParams}` : ''}`);
  }

  async updateUserStatus(id, statusData) {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async getAdminParkingSpaces(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/parking-spaces${queryParams ? `?${queryParams}` : ''}`);
  }

  async updateParkingSpaceStatus(id, statusData) {
    return this.request(`/admin/parking-spaces/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async getAdminBookings(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/bookings${queryParams ? `?${queryParams}` : ''}`);
  }

  async getAnalytics(period = '30') {
    return this.request(`/admin/analytics?period=${period}`);
  }

  // Contact endpoint
  async submitContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;