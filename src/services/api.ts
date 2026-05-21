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

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

export interface ChatSessionSummary {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  messageCount: number;
  lastSnippet: string;
}

export interface ChatSessionDetail extends ChatSessionSummary {
  messages: ChatMessage[];
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
    return request<UserProfile>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return request<{ avatarUrl: string }>('/api/profile/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  },

};

// ─── Chat APIs ────────────────────────────────────────────

export const chatApi = {
  // Get all chat sessions (list view)
  getSessions() {
    return request<ChatSessionSummary[]>('/api/chat/sessions');
  },

  // Get single session with messages
  getSession(sessionId: string) {
    return request<ChatSessionDetail>(`/api/chat/sessions/${sessionId}`);
  },

  // Create new session with initial messages
  createSession(messages: ChatMessage[], title?: string) {
    return request<ChatSessionDetail>('/api/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: title || 'Oracle Session', messages }),
    });
  },

  // Add messages to session
  appendMessages(sessionId: string, messages: ChatMessage[]) {
    return request<ChatSessionDetail>(`/api/chat/sessions/${sessionId}/messages`, {
      method: 'PATCH',
      body: JSON.stringify({ messages }),
    });
  },
};

// ─── Content APIs ────────────────────────────────────────────

export interface AudioTrack {
  id: string;
  name: string;
  label?: string; // For backwards compatibility with UI components
  url: string;
  duration?: number;
}

export interface ZodiacInfo {
  sign: string;
  dates?: string;
  description?: string;
  personality?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export const contentApi = {
  getAudioTracks() {
    return request<AudioTrack[]>('/api/content/audio-tracks');
  },

  getZodiacInfo(sign: string) {
    return request<ZodiacInfo>(`/api/content/zodiac/${sign}`);
  },
};
