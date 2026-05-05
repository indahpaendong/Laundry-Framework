/**
 * LaundryGo - API Service (JWT Authentication)
 * File: frontend/assets/js/api.js
 */

const API_BASE = 'http://localhost:3000/api';

const API = {
  // 🔐 Login & simpan JWT token
  async login(email, password, remember = false) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  // 🚪 Logout (hapus token)
  logout() {
    localStorage.removeItem('laundrygo_token');
    localStorage.removeItem('laundrygo_admin');
    if (!remember) {
      localStorage.removeItem('laundrygo_email');
    }
  },

  // 🎫 Get JWT token dari localStorage
  getToken() {
    return localStorage.getItem('laundrygo_token');
  },

  // 👤 Get admin info dari localStorage
  getAdmin() {
    const admin = localStorage.getItem('laundrygo_admin');
    return admin ? JSON.parse(admin) : null;
  },

  // ✅ Check if logged in
  isLoggedIn() {
    return this.getToken() !== null;
  },

  // 💾 Save token & admin info
  saveAuth(token, admin) {
    localStorage.setItem('laundrygo_token', token);
    localStorage.setItem('laundrygo_admin', JSON.stringify(admin));
  },

  // 🔗 Generic API call dengan JWT
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) // Add JWT token
      }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401) {
      this.logout();
      window.location.href = 'login.html?expired=1';
      throw new Error('Session expired. Silakan login ulang.');
    }
    
    return await response.json();
  },

  // 📦 GET request helper
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  // 📤 POST request helper
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // ✏️ PUT request helper
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // 🗑️ DELETE request helper
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// Make API available globally
window.API = API;