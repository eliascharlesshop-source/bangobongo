type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiError extends Error {
  status?: number
  code?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: HttpMethod
      headers?: Record<string, string>
      body?: any
      token?: string
    } = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, token } = options

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config)

      if (!response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type')
        let errorData: any = {}

        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}))
        } else {
          // If not JSON, try to get text for debugging
          const text = await response.text().catch(() => '')
          errorData = { error: text || `HTTP ${response.status}` }
        }

        const error: ApiError = new Error(errorData.error || `HTTP ${response.status}`)
        error.status = response.status
        error.code = errorData.code
        throw error
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const error: ApiError = new Error('Expected JSON response but received ' + (contentType || 'unknown content type'))
        error.status = response.status
        throw error
      }

      const data: ApiResponse<T> = await response.json()

      if (!data.success && data.error) {
        const error: ApiError = new Error(data.error)
        error.code = 'API_ERROR'
        throw error
      }

      return data.data || data as T
    } catch (error) {
      if (error instanceof Error) {
        console.error(`API Error [${method} ${endpoint}]:`, error.message)
      }
      throw error
    }
  }

  // Auth methods
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: credentials
      }),

    register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
      this.request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: userData
      }),

    logout: () =>
      this.request('/auth/logout', { method: 'POST' }),

    me: (token: string) =>
      this.request<{ user: any }>('/auth/me', { token })
  }

  // Products methods
  products = {
    list: (params?: { category?: string; page?: number; limit?: number }) => {
      const query = params ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value)
          return acc
        }, {} as Record<string, string>)
      ).toString() : ''

      return this.request<{ products: any[]; total: number; pages: number }>(`/products${query}`)
    },

    get: (id: string) =>
      this.request<{ product: any }>(`/products/${id}`),

    create: (product: any, token: string) =>
      this.request<{ product: any }>('/products', {
        method: 'POST',
        body: product,
        token
      }),

    update: (id: string, product: any, token: string) =>
      this.request<{ product: any }>(`/products/${id}`, {
        method: 'PUT',
        body: product,
        token
      }),

    delete: (id: string, token: string) =>
      this.request(`/products/${id}`, {
        method: 'DELETE',
        token
      })
  }

  // Cart methods
  cart = {
    get: (token: string) =>
      this.request<{ items: any[]; total: number }>('/cart', { token }),

    add: (item: { productId: string; quantity: number; selectedSize?: string; selectedColor?: string }, token: string) =>
      this.request('/cart/add', {
        method: 'POST',
        body: item,
        token
      }),

    update: (id: string, quantity: number, token: string) =>
      this.request(`/cart/${id}`, {
        method: 'PUT',
        body: { quantity },
        token
      }),

    remove: (id: string, token: string) =>
      this.request(`/cart/${id}`, {
        method: 'DELETE',
        token
      }),

    clear: (token: string) =>
      this.request('/cart', {
        method: 'DELETE',
        token
      })
  }

  // Orders methods
  orders = {
    list: (token: string, params?: { page?: number; limit?: number }) => {
      const query = params ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value)
          return acc
        }, {} as Record<string, string>)
      ).toString() : ''

      return this.request<{ orders: any[]; total: number; pages: number }>(`/orders${query}`, { token })
    },

    create: (order: any, token: string) =>
      this.request<{ order: any }>('/orders', {
        method: 'POST',
        body: order,
        token
      })
  }

  // Music methods
  music = {
    list: (params?: { page?: number; limit?: number; published?: boolean }) => {
      const query = params ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value)
          return acc
        }, {} as Record<string, string>)
      ).toString() : ''

      return this.request<{ music: any[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/music${query}`)
    },

    get: (id: string) =>
      this.request<{ track: any }>(`/music/${id}`),

    upload: (track: any, token: string) =>
      this.request<{ track: any }>('/music', {
        method: 'POST',
        body: track,
        token
      })
  }

  // Gear methods
  gear = {
    list: (params?: { category?: string; page?: number; limit?: number }) => {
      const query = params ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value)
          return acc
        }, {} as Record<string, string>)
      ).toString() : ''

      return this.request<{ gear: any[]; total: number }>(`/gear${query}`)
    },

    get: (id: string) =>
      this.request<{ item: any }>(`/gear/${id}`)
  }

  // Tours methods
  tours = {
    list: (params?: { upcoming?: boolean; city?: string; country?: string }) => {
      const query = params ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value)
          return acc
        }, {} as Record<string, string>)
      ).toString() : ''

      return this.request<{ tours: any[]; total: number }>(`/tours${query}`)
    },

    get: (id: string) =>
      this.request<{ tour: any }>(`/tours/${id}`),

    create: (tour: any, token: string) =>
      this.request<{ tour: any }>('/tours', {
        method: 'POST',
        body: tour,
        token
      })
  }

  // Licenses methods
  licenses = {
    getTiers: () =>
      this.request<{ tiers: any[] }>('/licenses'),

    purchase: (license: { trackId: string; tierName: string; customerInfo: any }, token: string) =>
      this.request<{ license: any; paymentUrl: string }>('/licenses/purchase', {
        method: 'POST',
        body: license,
        token
      })
  }

  // Admin methods
  admin = {
    dashboard: (token: string) =>
      this.request<{ stats: any; recentOrders: any[]; topProducts: any[] }>('/admin/dashboard', { token })
  }
}

export const apiClient = new ApiClient()
export type { ApiError, ApiResponse }
