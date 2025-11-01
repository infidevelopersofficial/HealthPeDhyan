/**
 * TypeScript Types for HealthPeDhyan Mobile App
 * These types match the backend API responses from the web application
 */

// ============================================================================
// PRODUCTS & BRANDS
// ============================================================================

export interface Brand {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brandId: string;
  categoryId: string;
  description?: string;
  heroImage?: string;
  galleryJson?: string[];
  createdAt: string;
  updatedAt: string;

  // Nutrition & Ingredients
  shortSummary?: string;
  nutritionJson?: NutritionInfo;
  ingredientsText?: string;
  allergensText?: string;
  healthScore: number;

  // Health Flags
  isPalmOilFree: boolean;
  isArtificialColorFree: boolean;
  isLowSugar: boolean;
  isWholeGrain: boolean;
  isMeetsStandard: boolean;

  // Relations (populated by API)
  brand?: Brand;
  category?: Category;
  badges?: ProductBadge[];
  affiliateLinks?: AffiliateLink[];
}

export interface NutritionInfo {
  servingSize?: string;
  servings?: number;
  calories?: number;
  totalFat?: string;
  saturatedFat?: string;
  transFat?: string;
  cholesterol?: string;
  sodium?: string;
  totalCarbohydrate?: string;
  dietaryFiber?: string;
  sugars?: string;
  protein?: string;
  vitaminD?: string;
  calcium?: string;
  iron?: string;
  potassium?: string;
}

// ============================================================================
// BADGES
// ============================================================================

export interface Badge {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductBadge {
  id: string;
  productId: string;
  badgeId: string;
  rationale?: string;
  createdAt: string;
  badge?: Badge;
}

// ============================================================================
// AFFILIATE LINKS
// ============================================================================

export type AffiliateMerchant = 'AMAZON' | 'FLIPKART' | 'OTHER';

export interface AffiliateLink {
  id: string;
  productId: string;
  merchant: AffiliateMerchant;
  url: string;
  paramsJson?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ARTICLES & BLOG
// ============================================================================

export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  bodyMarkdown: string;
  coverImage?: string;
  videoUrl?: string;
  category?: string;
  tags?: string;
  status: ArticleStatus;
  metaJson?: Record<string, any>;
  publishedAt?: string;
  canonicalUrl?: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
}

// ============================================================================
// LABEL SCANNER
// ============================================================================

export type ScanStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface LabelScan {
  id: string;
  imageUrl?: string;
  rawText?: string;
  extractedData?: ExtractedLabelData;
  status: ScanStatus;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedLabelData {
  productName?: string;
  brandName?: string;
  ingredients?: string[];
  nutrition?: Partial<NutritionInfo>;
  allergens?: string[];
  additives?: string[];
  confidence?: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// NAVIGATION
// ============================================================================

export type RootStackParamList = {
  Tabs: undefined;
  ProductDetail: { slug: string };
  ArticleDetail: { slug: string };
  ScanResult: { scanId: string };
};

export type TabParamList = {
  Home: undefined;
  Shop: undefined;
  Scanner: undefined;
  Articles: undefined;
  Profile: undefined;
};

// ============================================================================
// APP STATE
// ============================================================================

export interface AppSettings {
  apiUrl: string;
  apiTimeout: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  savedProducts: string[]; // Product IDs
}
