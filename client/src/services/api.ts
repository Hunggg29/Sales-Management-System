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
 * Create a new category
 * POST /api/Categories
 * 
 * @param categoryData - Category information
 * @returns Promise with created category data
 */
export async function createCategory(
  categoryData: { categoryName: string; description?: string }
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/Categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });

  return handleResponse<Category>(response);
}

/**
 * Update a category
 * PUT /api/Categories/{id}
 * 
 * @param categoryId - The ID of the category to update
 * @param categoryData - Updated category information
 * @returns Promise with updated category data
 */
export async function updateCategory(
  categoryId: number,
  categoryData: { categoryName: string; description?: string }
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/Categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });

  return handleResponse<Category>(response);
}

/**
 * Delete a category
 * DELETE /api/Categories/{id}
 * 
 * @param categoryId - The ID of the category to delete
 * @returns Promise with success message
 */
export async function deleteCategory(categoryId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string }>(response);
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
 * Get all customers
 * GET /api/Customers
 * 
 * @returns Promise with array of all customers
 */
export async function getAllCustomers(): Promise<import('../types').Customer[]> {
  const response = await fetch(`${API_BASE_URL}/Customers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Customer[]>(response);
}

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

/**
 * Delete a customer
 * DELETE /api/Customers/{userId}
 * 
 * @param userId - The ID of the user/customer to delete
 * @returns Promise with success message
 */
export async function deleteCustomer(userId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Customers/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * CART ENDPOINTS
 */

/**
 * Get cart by user ID
 * GET /api/Cart/user/{userId}
 * 
 * @param userId - The ID of the user
 * @returns Promise with cart details including items and total
 */
export async function getCartByUserId(userId: number): Promise<import('../types').Cart> {
  const response = await fetch(`${API_BASE_URL}/Cart/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Cart>(response);
}

/**
 * Add product to cart
 * POST /api/Cart/user/{userId}/items
 * 
 * @param userId - The ID of the user
 * @param cartData - Product ID and quantity
 * @returns Promise with updated cart
 */
export async function addToCart(
  userId: number,
  cartData: import('../types').AddToCartRequest
): Promise<import('../types').Cart> {
  const response = await fetch(`${API_BASE_URL}/Cart/user/${userId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartData),
  });

  return handleResponse<import('../types').Cart>(response);
}

/**
 * Update cart item quantity
 * PUT /api/Cart/user/{userId}/items/{cartItemId}
 * 
 * @param userId - The ID of the user
 * @param cartItemId - The ID of the cart item
 * @param updateData - New quantity
 * @returns Promise with updated cart
 */
export async function updateCartItem(
  userId: number,
  cartItemId: number,
  updateData: import('../types').UpdateCartItemRequest
): Promise<import('../types').Cart> {
  const response = await fetch(`${API_BASE_URL}/Cart/user/${userId}/items/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  return handleResponse<import('../types').Cart>(response);
}

/**
 * Remove item from cart
 * DELETE /api/Cart/user/{userId}/items/{cartItemId}
 * 
 * @param userId - The ID of the user
 * @param cartItemId - The ID of the cart item to remove
 * @returns Promise with success message
 */
export async function removeCartItem(
  userId: number,
  cartItemId: number
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Cart/user/${userId}/items/${cartItemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Clear entire cart
 * DELETE /api/Cart/user/{userId}
 * 
 * @param userId - The ID of the user
 * @returns Promise with success message
 */
export async function clearCart(userId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Cart/user/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * ORDER ENDPOINTS
 */

/**
 * Create order from cart
 * POST /api/Orders/create/{userId}
 * 
 * @param userId - The ID of the user
 * @param orderData - Order details including payment method
 * @returns Promise with created order details
 */
export async function createOrder(
  userId: number,
  orderData: import('../types').CreateOrderRequest
): Promise<import('../types').Order> {
  const response = await fetch(`${API_BASE_URL}/Orders/create/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  return handleResponse<import('../types').Order>(response);
}

/**
 * Get all orders by user ID
 * GET /api/Orders/user/{userId}
 * 
 * @param userId - The ID of the user
 * @returns Promise with array of orders
 */
export async function getOrdersByUserId(userId: number): Promise<import('../types').Order[]> {
  const response = await fetch(`${API_BASE_URL}/Orders/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Order[]>(response);
}

/**
 * Get order by ID
 * GET /api/Orders/{orderId}
 * 
 * @param orderId - The ID of the order
 * @returns Promise with order details
 */
export async function getOrderById(orderId: number): Promise<import('../types').Order> {
  const response = await fetch(`${API_BASE_URL}/Orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Order>(response);
}

/**
 * Cancel an order
 * POST /api/Orders/{orderId}/cancel
 * 
 * @param orderId - The ID of the order to cancel
 * @returns Promise with success message
 */
export async function cancelOrder(orderId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Orders/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * ADMIN PRODUCT ENDPOINTS
 */

/**
 * Create a new product
 * POST /api/Products
 * 
 * @param productData - Product information
 * @returns Promise with created product data
 */
export async function createProduct(
  productData: {
    productName: string;
    description: string;
    unitPrice: number;
    stockQuantity: number;
    categoryID: number;
    imageURL: string;
    unit: string;
  }
): Promise<import('../types').Product> {
  const response = await fetch(`${API_BASE_URL}/Products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  return handleResponse<import('../types').Product>(response);
}

/**
 * Update a product
 * PUT /api/Products/{id}
 * 
 * @param productId - The ID of the product to update
 * @param productData - Updated product information
 * @returns Promise with updated product data
 */
export async function updateProduct(
  productId: number,
  productData: {
    productName: string;
    description: string;
    unitPrice: number;
    stockQuantity: number;
    categoryID: number;
    imageURL: string;
    unit: string;
  }
): Promise<import('../types').Product> {
  const response = await fetch(`${API_BASE_URL}/Products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  return handleResponse<import('../types').Product>(response);
}

/**
 * Delete a product
 * DELETE /api/Products/{id}
 * 
 * @param productId - The ID of the product to delete
 * @returns Promise with success message
 */
export async function deleteProduct(productId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Update product stock quantity
 * PATCH /api/Products/{id}/stock
 * 
 * @param productId - The ID of the product
 * @param stockQuantity - New stock quantity
 * @returns Promise with success message
 */
export async function updateProductStock(
  productId: number,
  stockQuantity: number
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Products/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stockQuantity }),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * ADMIN ORDER ENDPOINTS
 */

/**
 * Get all orders (Admin only)
 * GET /api/Orders
 * 
 * @returns Promise with array of all orders
 */
export async function getAllOrders(): Promise<import('../types').Order[]> {
  const response = await fetch(`${API_BASE_URL}/Orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').Order[]>(response);
}

/**
 * Update order status (Admin only)
 * PUT /api/Orders/{orderId}/status
 * 
 * @param orderId - The ID of the order
 * @param status - New status (e.g., "Confirmed", "Cancelled")
 * @returns Promise with success message
 */
export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * PAYMENT ENDPOINTS
 */

/**
 * Create VietQR payment code for bank transfer
 * POST /api/Payment/create-bank-transfer-qr
 * 
 * @param orderId - The ID of the order
 * @returns Promise with QR code URL and payment details
 */
export async function createBankTransferQR(orderId: number): Promise<{
  success: boolean;
  qrCodeUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderId: number;
  message: string;
}> {
  const response = await fetch(`${API_BASE_URL}/Payment/create-bank-transfer-qr?orderId=${orderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{
    success: boolean;
    qrCodeUrl: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderId: number;
    message: string;
  }>(response);
}

/**
 * STATISTICS ENDPOINTS
 */

/**
 * Get dashboard statistics
 * GET /api/Statistics/dashboard
 */
export async function getDashboardStats(): Promise<import('../types').DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/Statistics/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').DashboardStats>(response);
}

/**
 * Get monthly revenue data
 * GET /api/Statistics/monthly-revenue
 */
export async function getMonthlyRevenue(months: number = 12): Promise<import('../types').MonthlyRevenue[]> {
  const response = await fetch(`${API_BASE_URL}/Statistics/monthly-revenue?months=${months}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').MonthlyRevenue[]>(response);
}

/**
 * Get top selling products
 * GET /api/Statistics/top-products
 */
export async function getTopProducts(top: number = 10): Promise<import('../types').TopProduct[]> {
  const response = await fetch(`${API_BASE_URL}/Statistics/top-products?top=${top}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').TopProduct[]>(response);
}

/**
 * Get recent orders
 * GET /api/Statistics/recent-orders
 */
export async function getRecentOrders(count: number = 10): Promise<import('../types').RecentOrder[]> {
  const response = await fetch(`${API_BASE_URL}/Statistics/recent-orders?count=${count}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').RecentOrder[]>(response);
}

/**
 * Get detailed report
 * GET /api/Statistics/detailed-report
 */
export async function getDetailedReport(): Promise<import('../types').DetailedReport> {
  const response = await fetch(`${API_BASE_URL}/Statistics/detailed-report`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<import('../types').DetailedReport>(response);
}

/**
 * SETTINGS ENDPOINTS
 */

/**
 * Get store information
 * GET /api/Settings/store-info
 */
export async function getStoreInfo(): Promise<{
  storeName: string;
  email: string;
  phone: string;
  address: string;
  taxCode: string;
}> {
  const response = await fetch(`${API_BASE_URL}/Settings/store-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Update store information
 * PUT /api/Settings/store-info
 */
export async function updateStoreInfo(data: {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  taxCode: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Settings/store-info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Get user settings
 * GET /api/Settings/user/{userId}
 */
export async function getUserSettings(userId: number): Promise<{
  fullName: string;
  email: string;
}> {
  const response = await fetch(`${API_BASE_URL}/Settings/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Update user settings
 * PUT /api/Settings/user/{userId}
 */
export async function updateUserSettings(userId: number, data: {
  fullName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Settings/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Get notification settings
 * GET /api/Settings/notifications
 */
export async function getNotificationSettings(): Promise<{
  emailNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  customerMessages: boolean;
}> {
  const response = await fetch(`${API_BASE_URL}/Settings/notifications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Update notification settings
 * PUT /api/Settings/notifications
 */
export async function updateNotificationSettings(data: {
  emailNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  customerMessages: boolean;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Settings/notifications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Get payment settings
 * GET /api/Settings/payment
 */
export async function getPaymentSettings(): Promise<{
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrEnabled: boolean;
}> {
  const response = await fetch(`${API_BASE_URL}/Settings/payment`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Update payment settings
 * PUT /api/Settings/payment
 */
export async function updatePaymentSettings(data: {
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrEnabled: boolean;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/Settings/payment`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

