const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ParentAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  // Parent Dashboard
  async getParentDashboard() {
    return this.request('/parents/dashboard');
  }

  // Child Management
  async getChildGrades(studentId: string, filters?: any) {
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.academicYear) params.append('academicYear', filters.academicYear);
    if (filters?.term) params.append('term', filters.term);
    
    const query = params.toString();
    return this.request(`/parents/children/${studentId}/grades${query ? `?${query}` : ''}`);
  }

  async getChildAttendance(studentId: string, filters?: any) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return this.request(`/parents/children/${studentId}/attendance${query ? `?${query}` : ''}`);
  }

  async getChildFees(studentId: string) {
    return this.request(`/parents/children/${studentId}/fees`);
  }

  async getChildProgress(studentId: string) {
    return this.request(`/parents/children/${studentId}/progress`);
  }

  // Complaint Management
  async getComplaints() {
    return this.request('/parents/complaints');
  }

  async createComplaint(complaintData: any) {
    return this.request('/parents/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }

  async updateComplaint(complaintId: string, updateData: any) {
    return this.request(`/parents/complaints/${complaintId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }
}

export const parentAPI = new ParentAPI();