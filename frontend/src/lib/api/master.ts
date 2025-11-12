const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class MasterAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/master${endpoint}`, {
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

  // Academic Years
  async getAcademicYears(schoolId: string) {
    return this.request(`/academic-years?schoolId=${schoolId}`);
  }

  async createAcademicYear(data: any) {
    return this.request('/academic-years', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAcademicYear(id: string, data: any) {
    return this.request(`/academic-years/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAcademicYear(id: string) {
    return this.request(`/academic-years/${id}`, {
      method: 'DELETE',
    });
  }

  // Classes
  async getClasses(schoolId: string, branchId?: string, academicYearId?: string) {
    const params = new URLSearchParams({ schoolId });
    if (branchId) params.append('branchId', branchId);
    if (academicYearId) params.append('academicYearId', academicYearId);
    return this.request(`/classes?${params.toString()}`);
  }

  async createClass(data: any) {
    return this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(id: string, data: any) {
    return this.request(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClass(id: string) {
    return this.request(`/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // Subjects
  async getSubjects(schoolId: string) {
    return this.request(`/subjects?schoolId=${schoolId}`);
  }

  async createSubject(data: any) {
    return this.request('/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubject(id: string, data: any) {
    return this.request(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id: string) {
    return this.request(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Students
  async getStudents(schoolId: string, branchId?: string, classId?: string, search?: string) {
    const params = new URLSearchParams({ schoolId });
    if (branchId) params.append('branchId', branchId);
    if (classId) params.append('classId', classId);
    if (search) params.append('search', search);
    return this.request(`/students?${params.toString()}`);
  }

  async createStudent(data: any) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: any) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUploadStudents(file: File, schoolId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolId', schoolId);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/master/students/bulk-upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Teachers
  async getTeachers(schoolId: string, branchId?: string, search?: string) {
    const params = new URLSearchParams({ schoolId });
    if (branchId) params.append('branchId', branchId);
    if (search) params.append('search', search);
    return this.request(`/teachers?${params.toString()}`);
  }

  async createTeacher(data: any) {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacher(id: string, data: any) {
    return this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeacher(id: string) {
    return this.request(`/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUploadTeachers(file: File, schoolId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolId', schoolId);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/master/teachers/bulk-upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Fee Structures
  async getFeeStructures(schoolId: string, classId?: string, academicYearId?: string) {
    const params = new URLSearchParams({ schoolId });
    if (classId) params.append('classId', classId);
    if (academicYearId) params.append('academicYearId', academicYearId);
    return this.request(`/fee-structures?${params.toString()}`);
  }

  async createFeeStructure(data: any) {
    return this.request('/fee-structures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFeeStructure(id: string, data: any) {
    return this.request(`/fee-structures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFeeStructure(id: string) {
    return this.request(`/fee-structures/${id}`, {
      method: 'DELETE',
    });
  }

  // Templates
  async getStudentsTemplate() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/master/templates/students`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Template download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async getTeachersTemplate() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/master/templates/teachers`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Template download failed: ${response.statusText}`);
    }

    return response.blob();
  }
}

export const masterAPI = new MasterAPI();