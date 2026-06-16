const API_BASE = 'https://laundrygo-backend-production.up.railway.app/api';

const STORAGE_KEYS = {
    TOKEN: 'laundrygo_token',
    ADMIN: 'laundrygo_admin',
    EMAIL: 'laundrygo_email'
};

let onUnauthorized = null;

const API = {
    setUnauthorizedHandler(callback) { onUnauthorized = callback; },

    async login(email, password) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    },

    logout(remember = false) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
        if (!remember) localStorage.removeItem(STORAGE_KEYS.EMAIL);
    },

    getToken() { return localStorage.getItem(STORAGE_KEYS.TOKEN); },

    getAdmin() {
        const admin = localStorage.getItem(STORAGE_KEYS.ADMIN);
        return admin ? JSON.parse(admin) : null;
    },

    isLoggedIn() { return this.getToken() !== null; },

    saveAuth(token, admin) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const token = this.getToken();

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: { ...defaultOptions.headers, ...(options.headers || {}) }
        };

        const response = await fetch(url, mergedOptions);

        if (response.status === 401) {
            this.logout();
            if (onUnauthorized) onUnauthorized();
            throw new Error('Session expired. Silakan login ulang.');
        }

        return await response.json();
    },

    async get(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    async post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); },
    async put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};

export default API;
