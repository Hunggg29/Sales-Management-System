/**
 * API Service - All backend API calls in one place
 * 
 * This file contains simple fetch functions to communicate with your ASP.NET Core backend.
 * Each function handles the HTTP request and returns the JSON response.
 */

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Category,
} from '../types';

// Base URL of your backend API
const API_BASE_URL = 'https://localhost:7078/api';

/**
 * Helper function to handle fetch responses
 * Checks if response is ok, then returns JSON data
 * If not ok, throws an error with the error message from backend
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to get error message from backend
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP Error ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * AUTH ENDPOINTS
 */

/**
 * Login a user
 * POST /api/Auth/login
 * 
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with user data and JWT token
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const requestBody: LoginRequest = { email, password };

  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return handleResponse<LoginResponse>(response);
}

/**
 * Register a new user
 * POST /api/Auth/register
 * 
 * @param username - Desired username
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with success message
 */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const requestBody: RegisterRequest = { username, email, password };

  const response = await fetch(`${API_BASE_URL}/Auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return handleResponse<RegisterResponse>(response);
}

/**
 * CATEGORY ENDPOINTS
 */

/**
 * Get all categories (without products)
 * GET /api/Categories
 * 
 * @returns Promise with array of categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/Categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Category[]>(response);
}

/**
 * Get all categories with their products
 * GET /api/Categories/with-products
 * 
 * @returns Promise with array of categories, each containing products array
 */
export async function getCategoriesWithProducts(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/Categories/with-products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Category[]>(response);
}

/**
 * PRODUCT ENDPOINTS
 */

/**
 * Get all products
 * GET /api/Products
 * 
 * @returns Promise with array of all products
 */
export async function getAllProducts(): Promise<import('../types').Product[]> {
  const response = await fetch(`${API_BASE_URL}/Products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Product[]>(response);
}

/**
 * Get product by ID
 * GET /api/Products/{id}
 * 
 * @param productId - The ID of the product to fetch
 * @returns Promise with product details
 */
export async function getProductById(productId: number): Promise<import('../types').Product> {
  const response = await fetch(`${API_BASE_URL}/Products/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Product>(response);
}

/**
 * Search products by name
 * GET /api/Products/search?name={searchTerm}
 * 
 * @param searchTerm - The search term to find products
 * @returns Promise with array of matching products
 */
export async function searchProductsByName(searchTerm: string): Promise<import('../types').Product[]> {
  const response = await fetch(`${API_BASE_URL}/Products/search?name=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Product[]>(response);
}

/**
 * CUSTOMER ENDPOINTS
 */

/**
 * Create a new customer
 * POST /api/Customers
 * 
 * @param customerData - Customer information
 * @returns Promise with created customer data
 */
export async function createCustomer(
  customerData: import('../types').CreateCustomerRequest
): Promise<import('../types').CreateCustomerResponse> {
  const response = await fetch(`${API_BASE_URL}/Customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  return handleResponse<import('../types').CreateCustomerResponse>(response);
}

/**
 * Get customer by user ID
 * GET /api/Customers/user/{userId}
 * 
 * @param userId - The ID of the user
 * @returns Promise with customer details
 */
export async function getCustomerByUserId(userId: number): Promise<import('../types').Customer> {
  const response = await fetch(`${API_BASE_URL}/Customers/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Customer>(response);
}

/**
 * Update customer information by user ID
 * PUT /api/Customers/user/{userId}
 * 
 * @param userId - The ID of the user
 * @param customerData - Updated customer information
 * @returns Promise with updated customer data
 */
export async function updateCustomerByUserId(
  userId: number,
  customerData: import('../types').CreateCustomerRequest
): Promise<import('../types').Customer> {
  const response = await fetch(`${API_BASE_URL}/Customers/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  return handleResponse<import('../types').Customer>(response);
}
