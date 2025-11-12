const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class SuperAdminAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/super-admin${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Analytics APIs
  async getPlatformAnalytics() {
    return this.request('/analytics');
  }

  async getRevenueAnalytics(period: string = 'monthly') {
    return this.request(`/analytics/revenue?period=${period}`);
  }

  async getGeographicAnalytics() {
    return this.request('/analytics/geographic');
  }

  async getDashboardOverview() {
    return this.request('/dashboard');
  }

  // Schools APIs
  async getAllSchools(filters?: { status?: string; plan?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.plan) params.append('plan', filters.plan);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.request(`/schools${query ? `?${query}` : ''}`);
  }

  async getSchoolById(id: string) {
    return this.request(`/schools/${id}`);
  }

  async createSchool(schoolData: any) {
    return this.request('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  }

  async updateSchool(id: string, schoolData: any) {
    return this.request(`/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  }

  async deleteSchool(id: string) {
    return this.request(`/schools/${id}`, {
      method: 'DELETE',
    });
  }

  // Users APIs
  async getAllUsers(filters?: { role?: string; status?: string; schoolId?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.schoolId) params.append('schoolId', filters.schoolId);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Billing APIs
  async getAllBillingRecords(filters?: { status?: string; plan?: string; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.plan) params.append('plan', filters.plan);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return this.request(`/billing${query ? `?${query}` : ''}`);
  }

  async getBillingById(id: string) {
    return this.request(`/billing/${id}`);
  }

  async createBillingRecord(billingData: any) {
    return this.request('/billing', {
      method: 'POST',
      body: JSON.stringify(billingData),
    });
  }

  async updateBillingStatus(id: string, status: string, paidDate?: Date) {
    return this.request(`/billing/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paidDate }),
    });
  }

  // Settings APIs
  async getSettings(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/settings${query}`);
  }

  async updateSettings(settings: Array<{ key: string; value: string; category: string }>) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async updateSetting(key: string, value: string, category: string) {
    return this.request(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, category }),
    });
  }

  // Export APIs
  async exportSchools(format: string = 'json') {
    return this.request(`/export/schools?format=${format}`);
  }

  async exportUsers(format: string = 'json') {
    return this.request(`/export/users?format=${format}`);
  }

  async exportBilling(format: string = 'json') {
    return this.request(`/export/billing?format=${format}`);
  }

  // System APIs
  async getSystemHealth() {
    return this.request('/health');
  }
}

export const superAdminAPI = new SuperAdminAPI();