// TypeScript interfaces that match your backend models

// User from backend
export interface User {
  userID: number;
  userName: string;
  email: string;
  passwordHash?: string | null; // Optional, backend removes it
  role: string;
  createdAt: string;
  isActive: boolean;
}

// Product from backend
export interface Product {
  productID: number;
  categoryID: number;
  productName: string;
  description?: string;
  unitPrice: number;
  unit?: string;
  stockQuantity: number;
  imageURL?: string;
  createdAt: string;
  isActive: boolean;
}

// Category from backend
export interface Category {
  categoryID: number;
  categoryName: string;
  description?: string;
  products?: Product[]; // Only available in "with-products" endpoint
}

// Request DTOs (for sending data to backend)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Response from login endpoint
export interface LoginResponse {
  user: User;
  token: string;
}

// Response from register endpoint
export interface RegisterResponse {
  message: string;
}

// News Article
export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  views: number;
  image: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
}

// Customer
export interface Customer {
  customerID: number;
  userID: number;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  companyName?: string | null;
  createdAt: string;
  isActive: boolean;
}

// Customer creation request
export interface CreateCustomerRequest {
  userID: number;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  companyName?: string | null;
}

// Customer creation response (API returns the created customer directly)
export interface CreateCustomerResponse extends Customer {}

// Cart Item
export interface CartItem {
  cartItemID: number;
  productID: number;
  productName: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  stockQuantity: number;
}

// Cart
export interface Cart {
  cartID: number;
  customerID: number;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Add to Cart Request
export interface AddToCartRequest {
  productID: number;
  quantity: number;
}

// Update Cart Item Request
export interface UpdateCartItemRequest {
  quantity: number;
}

// Order
export interface Order {
  orderID: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  payment?: Payment;
  orderDetails?: OrderDetail[];
}

// Order Detail
export interface OrderDetail {
  productID: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Payment
export interface Payment {
  paymentID: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
  transactionCode?: string;
  amount: number;
}

// Create Order Request
export interface CreateOrderRequest {
  paymentMethod: string;
  shippingAddress?: string | null;
  note?: string | null;
}

