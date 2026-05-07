/**
 * Realestway Centralized API Service
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  uuid?: string;
  id?: string | number;
}

class ApiService {
  private static async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('realestway_token');
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      let data: unknown;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Non-JSON response from server' };
      }

      if (!response.ok) {
        // If unauthorized or session expired, clear user data and redirect to login
        if (response.status === 401 || response.status === 403) {
          if (typeof window !== 'undefined') {
            const hasSession = !!localStorage.getItem('realestway_token');
            if (hasSession) {
              // Only clear and redirect if the user had an active session — not on public API 401s
              localStorage.clear();
              if (!window.location.pathname.startsWith('/auth/')) {
                window.location.href = '/auth/login?expired=true';
              }
            }
          }
        }

        const error = new Error((data as any)?.message || 'API Request Failed');
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }

      return data as T;
    } catch (err: unknown) {
      // Handle network errors (Failed to fetch)
      if (err instanceof Error && err.message === 'Failed to fetch') {
        throw new Error('Network Error: Unable to connect to the server. Please ensure the backend is running.');
      }
      throw err;
    }
  }

  static getMediaUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    
    // Use CloudFront if configured
    const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    if (cloudFrontUrl) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${cloudFrontUrl.replace(/\/$/, '')}${cleanPath}`;
    }

    const cleanBase = BASE_URL.replace(/\/api$/, '');
    return `${cleanBase}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  // --- Authentication ---
  static auth = {
    login: (credentials: any) => 
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: any) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    verifyEmail: (data: { email: string; code: string }) =>
      this.request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    sendOtp: (data: { phone_number: string }) =>
      this.request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    sendEmailVerification: (data: { email: string }) =>
      this.request('/auth/send-email-verification', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    verifyOtp: (data: { phone_number: string; otp_code: string }) =>
      this.request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    googleAuth: (google_token: string) =>
      this.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ google_token }),
      }),
    
    me: () => this.request('/auth/me'),
    
    logout: () => this.request('/auth/logout', { method: 'POST' }),
    
    updateProfile: (data: any) => 
      this.request('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // --- Agent ---
  static agent = {
    checkProfile: () => this.request('/agent/check-profile'),
    
    claimProfile: (data: { phone_number: string }) =>
      this.request('/agent/claim-profile', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      
    register: () => this.request('/agent/register', { method: 'POST' }),

    getProfile: (id: string | number) => this.request(`/agent/profile/${id}`),
    
    getPublicProperties: (id: string | number, params: string = '') => this.request(`/agent/profile/${id}/properties${params ? `?${params}` : ''}`),
    
    getProperties: (params: string = '') => this.request(`/agent/properties${params ? `?${params}` : ''}`),
    
    getStats: () => this.request('/agent/stats'),
    
    updateProfile: (data: any) => 
      this.request('/agent/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // --- Properties ---
  static properties = {
    getCities: () => this.request('/properties/cities'),
    getPublicStats: () => this.request('/properties/stats'),

    getAll: (params: string = '') => this.request(`/properties${params ? `?${params}` : ''}`),
    
    getHome: () => this.request('/properties/home'),
    
    getNearby: (params: { lat: number; lng: number; radius?: number; city?: string; state?: string; address?: string; limit?: number }) => {
      const query = new URLSearchParams();
      query.append('lat', params.lat.toString());
      query.append('lng', params.lng.toString());
      if (params.radius) query.append('radius', params.radius.toString());
      if (params.city) query.append('city', params.city);
      if (params.state) query.append('state', params.state);
      if (params.address) query.append('address', params.address);
      if (params.limit) query.append('limit', params.limit.toString());
      return this.request(`/properties/nearby?${query.toString()}`);
    },
    
    getOne: (id: string | number) => this.request(`/properties/${id}`),
    
    create: (data: any) => this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (id: string | number, data: any) => this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

    delete: (id: string | number) => this.request(`/properties/${id}`, {
      method: 'DELETE',
    }),

    publish: (id: string | number) => this.request(`/properties/${id}/publish`, {
      method: 'POST',
    }),
    
    save: (id: string | number) => this.request(`/properties/${id}/save`, { method: 'POST' }),
    
    unsave: (id: string | number) => this.request(`/properties/${id}/save`, { method: 'DELETE' }),
    
    isSaved: (id: string | number) => this.request(`/properties/${id}/is-saved`),

    like: (id: string | number) => this.request(`/properties/${id}/like`, { method: 'POST' }),

    unlike: (id: string | number) => this.request(`/properties/${id}/like`, { method: 'DELETE' }),

    isLiked: (id: string | number) => this.request(`/properties/${id}/is-liked`),
    
    getSaved: (params: string = '') => this.request(`/saved-properties${params ? `?${params}` : ''}`),
    
    confirmAvailability: (id: string | number, stillAvailable: boolean, token?: string) => 
      this.request(`/properties/${id}/confirm-availability`, {
        method: 'POST',
        body: JSON.stringify({ still_available: stillAvailable, token }),
      }),
    
    requestAgentContact: (id: string | number, data: { message?: string }) =>
      this.request(`/properties/${id}/request-contact`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // --- Media ---
  static media = {
    upload: (formData: FormData) => this.request('/media', {
      method: 'POST',
      body: formData,
    }),
    delete: (pathOrUrl: string) => this.request('/media', {
      method: 'DELETE',
      body: JSON.stringify({ path: pathOrUrl }),
    }),
  };

  // --- Blog ---
  static blogs = {
    getAll: () => this.request('/blogs'),
    getOne: (slug: string) => this.request(`/blogs/${slug}`),
  };

  // --- Newsletter ---
  static newsletter = {
    subscribe: (email: string) => 
      this.request('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  };

  // --- Admin ---
  static admin = {
    getStats: () => this.request('/admin/stats'),
    getHealth: () => this.request('/admin/health'),
    
    // User Management
    getUsers: (params: string = '') => this.request(`/admin/users${params ? `?${params}` : ''}`),
    
    createAdmin: (userData: any) =>
      this.request('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ ...userData, role: 'admin' }),
      }),
      
    updateUser: (id: string | number, data: any) =>
      this.request(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      
    blockUser: (id: string | number, isBlocked: boolean) =>
      this.request(`/admin/users/${id}/block`, {
        method: 'PUT',
        body: JSON.stringify({ is_blocked: isBlocked }),
      }),
      
    deleteUser: (id: string | number) =>
      this.request(`/admin/users/${id}`, {
        method: 'DELETE',
      }),

    // Property Management
    getProperties: (params: string = '') => this.request(`/admin/properties${params ? `?${params}` : ''}`),
    verifyProperty: (id: string | number) => this.request(`/admin/properties/${id}/verify`, { method: 'POST' }),
    deleteProperty: (id: string | number) => this.request(`/admin/properties/${id}`, { method: 'DELETE' }),

    // Blog Management
    createBlog: (data: any) => this.request('/admin/blogs', { method: 'POST', body: JSON.stringify(data) }),
    updateBlog: (id: string | number, data: any) => this.request(`/admin/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBlog: (id: string | number) => this.request(`/admin/blogs/${id}`, { method: 'DELETE' }),

    // Newsletter Management
    getSubscribers: () => this.request('/admin/subscribers'),

    // WhatsApp Group Management
    getWhatsappGroups: (params: string = '') => this.request(`/admin/whatsapp-groups${params ? `?${params}` : ''}`),
    updateWhatsappGroup: (id: string | number, data: any) =>
      this.request(`/admin/whatsapp-groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteWhatsappGroup: (id: string | number) =>
      this.request(`/admin/whatsapp-groups/${id}`, {
        method: 'DELETE',
      }),

    // Contact Requests Management
    getContactRequests: (params: string = '') => this.request(`/admin/contact-requests${params ? `?${params}` : ''}`),
    updateContactRequest: (id: string | number, data: { status: string; admin_note?: string }) =>
      this.request(`/admin/contact-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // --- Analytics ---
  static analytics = {
    log: (data: { event_type: string; property_id?: number; metadata?: any; anon_id?: string }) =>
      this.request('/analytics/log', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}

export default ApiService;
