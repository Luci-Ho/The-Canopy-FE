const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.message || 'Có lỗi xảy ra', res.status, data);
  }

  return data as T;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Auth APIs ────────────────────────────────────────────

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  birthdate?: string;
  zodiac?: string;
  personality?: string;
  strengths?: string[];
  weaknesses?: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  register(email: string, password: string, username: string) {
    return request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },

  login(email: string, password: string) {
    return request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return request<UserProfile>('/api/auth/me');
  },

  updateProfile(updates: Partial<UserProfile>) {
    return request<UserProfile>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return request<{ avatarUrl: string }>('/api/auth/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  },

  getChatHistory() {
    return request<any[]>('/api/auth/chat/history');
  },
};
