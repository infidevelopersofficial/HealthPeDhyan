/**
 * API Service
 * Handles all communication with the HealthPeDhyan backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';
import {
  Product,
  Article,
  LabelScan,
  Category,
  Brand,
  ApiResponse,
} from '../types';

// Get API URL from app.json extra config
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || 'https://healthpedhyan.com';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function handleApiError(error: any): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;
    throw new ApiError(message, status);
  }
  throw new ApiError(error.message || 'Unknown error occurred');
}

// ============================================================================
// PRODUCTS
// ============================================================================

/**
 * Get all products
 */
export async function getProducts(params?: {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/api/products', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get a single product by slug
 */
export async function getProduct(slug: string): Promise<Product> {
  try {
    const response = await api.get<Product>(`/api/products/${slug}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/api/products/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// CATEGORIES & BRANDS
// ============================================================================

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get<Category[]>('/api/categories');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await api.get<Brand[]>('/api/brands');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// ARTICLES
// ============================================================================

/**
 * Get all published articles
 */
export async function getArticles(params?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<Article[]> {
  try {
    const response = await api.get<Article[]>('/api/articles', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get a single article by slug
 */
export async function getArticle(slug: string): Promise<Article> {
  try {
    const response = await api.get<Article>(`/api/articles/${slug}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// LABEL SCANNER
// ============================================================================

/**
 * Upload a product label image for scanning
 */
export async function uploadLabel(imageUri: string): Promise<LabelScan> {
  try {
    const formData = new FormData();

    // Convert image URI to blob for upload
    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append('image', blob as any, 'label.jpg');

    const uploadResponse = await api.post<LabelScan>(
      '/api/label-scan',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return uploadResponse.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get scan result by ID
 */
export async function getScanResult(scanId: string): Promise<LabelScan> {
  try {
    const response = await api.get<LabelScan>(`/api/label-scan/${scanId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Poll for scan completion
 * Checks scan status every 2 seconds until completed or failed
 */
export async function pollScanResult(
  scanId: string,
  maxAttempts: number = 30
): Promise<LabelScan> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const scan = await getScanResult(scanId);

    if (scan.status === 'COMPLETED' || scan.status === 'FAILED') {
      return scan;
    }

    // Wait 2 seconds before next attempt
    await new Promise((resolve) => setTimeout(resolve, 2000));
    attempts++;
  }

  throw new ApiError('Scan timeout - analysis took too long');
}

// ============================================================================
// CONTACT
// ============================================================================

/**
 * Submit contact form
 */
export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post('/api/contact', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if API is reachable
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await api.get('/api/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.warn('Health check failed:', error);
    return false;
  }
}

export default api;
