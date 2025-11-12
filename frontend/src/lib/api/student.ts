const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class StudentAPI {
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

  // Student Dashboard
  async getStudentDashboard() {
    return this.request('/students/profile/me');
  }

  // Student Grades
  async getStudentGrades(filters?: { subject?: string; academicYear?: string; term?: string }) {
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.academicYear) params.append('academicYear', filters.academicYear);
    if (filters?.term) params.append('term', filters.term);
    
    const query = params.toString();
    return this.request(`/students/grades/me${query ? `?${query}` : ''}`);
  }

  // Student Attendance
  async getStudentAttendance(filters?: { startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return this.request(`/students/attendance/me${query ? `?${query}` : ''}`);
  }

  // Student Fees
  async getStudentFees() {
    return this.request('/students/fees/me');
  }

  // Student Profile
  async getStudentProfile() {
    return this.request('/students/profile/me');
  }

  async updateStudentProfile(profileData: any) {
    return this.request('/students/profile/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

export const studentAPI = new StudentAPI();