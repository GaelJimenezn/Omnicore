export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en API: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('ApiService get error:', error);
      throw error;
    }
  }

  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error en API: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('ApiService post error:', error);
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
