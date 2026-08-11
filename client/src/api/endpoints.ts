export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    ME: '/users/me',
    PROFILE: '/users/profile',
  },
  CATEGORIES: {
    TREE: '/categories/tree',
    SLUG: (slug: string) => `/categories/slug/${slug}`,
    LIST: '/categories',
    SEARCH: '/categories/search',
  },
  ATTRIBUTES: {
    LIST: '/attributes',
    SEARCH: '/attributes/search',
  },
  CATEGORY_TEMPLATES: {
    BY_CATEGORY: (categoryId: string) => `/category-templates/category/${categoryId}`,
  },
  MACHINES: {
    LIST: '/machines',
    SEARCH: '/machines/search',
    DETAILS: (id: string) => `/machines/${id}/details`,
    MEDIA: (id: string) => `/machines/${id}/media`,
    SPECS: (id: string) => `/machines/${id}/specifications`,
    PRICES: (id: string) => `/machines/${id}/prices`,
  },
  UPLOADS: {
    SINGLE: '/uploads',
    BATCH: '/uploads/batch',
    MY_UPLOADS: '/uploads/my-uploads',
  },
  COMPARISONS: {
    CREATE: '/comparisons',
    TABLE: (id: string) => `/comparisons/${id}/table`,
    SCORES: (id: string) => `/comparisons/${id}/scores`,
    REQUIREMENTS: (id: string) => `/comparisons/${id}/requirements`,
    MY_COMPARISONS: '/comparisons/user/my-comparisons',
  },
  AI: {
    SEARCH: '/ai/search',
    SIMILAR: (machineId: string) => `/ai/similar/${machineId}`,
    EMBEDDING: '/ai/generate-embedding',
  },
  ANALYTICS: {
    LOG: '/search-analytics',
    POPULAR: '/search-analytics/popular',
    SUMMARY: '/search-analytics/summary',
  },
};
