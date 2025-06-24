# XM Bakery Management System - API Documentation

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Response Format
All API responses follow this format:

**Success Response:**
\`\`\`json
{
  "message": "Success message",
  "data": { ... }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": "Error message"
}
\`\`\`

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
\`\`\`json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "User registered successfully",
  "userId": 1
}
\`\`\`

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error or user already exists

---

### 2. Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
\`\`\`

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

Get all products with optional filtering and sorting.

**Query Parameters:**
- `category` (string) - Filter by product category
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `sortBy` (string) - Sort field (name, price, category, quantity, created_at)
- `sortOrder` (string) - Sort order (asc, desc)

**Example Request:**
\`\`\`
GET /products?category=bread&minPrice=400&sortBy=price&sortOrder=asc
\`\`\`

**Response:**
\`\`\`json
{
  "products": [
    {
      "id": 1,
      "name": "White Bread",
      "price": 500.00,
      "category": "bread",
      "quantity": 50,
      "description": "Fresh white bread",
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
\`\`\`

**Status Codes:**
- `200` - Success

---

### 2. Get Single Product
**GET** `/products/:id`

Get details of a specific product.

**Response:**
\`\`\`json
{
  "id": 1,
  "name": "White Bread",
  "price": 500.00,
  "category": "bread",
  "quantity": 50,
  "description": "Fresh white bread",
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T10:00:00.000Z"
}
\`\`\`

**Status Codes:**
- `200` - Success
- `404` - Product not found

---

### 3. Add Product
**POST** `/products`

Add a new product (Admin only).

**Authentication:** Required (Admin role)

**Request Body:**
\`\`\`json
{
  "name": "Chocolate Cake",
  "price": 2500.00,
  "category": "cake",
  "quantity": 15,
  "description": "Delicious chocolate cake"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Product added successfully",
  "productId": 5
}
\`\`\`

**Status Codes:**
- `201` - Product created successfully
- `400` - Validation error
- `401` - Authentication required
- `403` - Admin access required

---

### 4. Update Product
**PUT** `/products/:id`

Update an existing product (Admin only).

**Authentication:** Required (Admin role)

**Request Body:**
\`\`\`json
{
  "name": "Updated Product Name",
  "price": 600.00,
  "category": "bread",
  "quantity": 30,
  "description": "Updated description"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Product updated successfully"
}
\`\`\`

**Status Codes:**
- `200` - Product updated successfully
- `400` - Validation error
- `401` - Authentication required
- `403` - Admin access required
- `404` - Product not found

---

### 5. Delete Product
**DELETE** `/products/:id`

Delete a product (Admin only).

**Authentication:** Required (Admin role)

**Response:**
\`\`\`json
{
  "message": "Product deleted successfully"
}
\`\`\`

**Status Codes:**
- `200` - Product deleted successfully
- `401` - Authentication required
- `403` - Admin access required
- `404` - Product not found

---

## Order Endpoints

### 1. Create Order
**POST** `/orders`

Create a new order.

**Authentication:** Required

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ],
  "delivery_location": "Kigali, Nyarugenge District"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Order created successfully",
  "orderId": 10,
  "totalAmount": 1500.00
}
\`\`\`

**Status Codes:**
- `201` - Order created successfully
- `400` - Validation error or insufficient stock
- `401` - Authentication required

---

### 2. Get User Orders
**GET** `/orders`

Get all orders for the authenticated user.

**Authentication:** Required

**Response:**
\`\`\`json
{
  "orders": [
    {
      "id": 10,
      "customer_id": 2,
      "total_amount": 1500.00,
      "status": "pending",
      "delivery_location": "Kigali, Nyarugenge District",
      "created_at": "2024-01-01T14:30:00.000Z",
      "updated_at": "2024-01-01T14:30:00.000Z",
      "items": "White Bread (2), Chocolate Cake (1)"
    }
  ]
}
\`\`\`

**Status Codes:**
- `200` - Success
- `401` - Authentication required

---

### 3. Get Single Order
**GET** `/orders/:id`

Get details of a specific order.

**Authentication:** Required

**Response:**
\`\`\`json
{
  "order": [
    {
      "id": 10,
      "customer_id": 2,
      "total_amount": 1500.00,
      "status": "pending",
      "delivery_location": "Kigali, Nyarugenge District",
      "created_at": "2024-01-01T14:30:00.000Z",
      "updated_at": "2024-01-01T14:30:00.000Z",
      "quantity": 2,
      "item_price": 500.00,
      "product_name": "White Bread"
    }
  ]
}
\`\`\`

**Status Codes:**
- `200` - Success
- `401` - Authentication required
- `404` - Order not found

---

### 4. Update Order Status
**PUT** `/orders/:id/status`

Update the status of an order (Admin only).

**Authentication:** Required (Admin role)

**Request Body:**
\`\`\`json
{
  "status": "processing"
}
\`\`\`

**Valid Status Values:**
- `pending`
- `processing`
- `delivered`
- `cancelled`

**Response:**
\`\`\`json
{
  "message": "Order status updated successfully"
}
\`\`\`

**Status Codes:**
- `200` - Status updated successfully
- `400` - Invalid status value
- `401` - Authentication required
- `403` - Admin access required
- `404` - Order not found

---

## Report Endpoints

### 1. Sales Report
**GET** `/reports/sales`

Get sales report data (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `startDate` (string) - Start date (YYYY-MM-DD format)
- `endDate` (string) - End date (YYYY-MM-DD format)

**Example Request:**
\`\`\`
GET /reports/sales?startDate=2024-01-01&endDate=2024-01-31
\`\`\`

**Response:**
\`\`\`json
{
  "salesReport": [
    {
      "date": "2024-01-15",
      "total_orders": 5,
      "total_sales": 7500.00,
      "average_order_value": 1500.00
    },
    {
      "date": "2024-01-14",
      "total_orders": 3,
      "total_sales": 4200.00,
      "average_order_value": 1400.00
    }
  ]
}
\`\`\`

**Status Codes:**
- `200` - Success
- `401` - Authentication required
- `403` - Admin access required

---

### 2. Inventory Report
**GET** `/reports/inventory`

Get inventory report data (Admin only).

**Authentication:** Required (Admin role)

**Response:**
\`\`\`json
{
  "inventoryReport": [
    {
      "id": 3,
      "name": "Chocolate Cake",
      "category": "cake",
      "quantity": 5,
      "price": 2000.00,
      "total_value": 10000.00,
      "stock_status": "Low Stock"
    },
    {
      "id": 1,
      "name": "White Bread",
      "category": "bread",
      "quantity": 50,
      "price": 500.00,
      "total_value": 25000.00,
      "stock_status": "Medium Stock"
    }
  ],
  "summary": {
    "totalProducts": 4,
    "totalInventoryValue": 45000.00,
    "lowStockItems": 1
  }
}
\`\`\`

**Status Codes:**
- `200` - Success
- `401` - Authentication required
- `403` - Admin access required

---

### 3. Customer Report
**GET** `/reports/customers`

Get customer report data (Admin only).

**Authentication:** Required (Admin role)

**Response:**
\`\`\`json
{
  "customerReport": [
    {
      "id": 2,
      "username": "john_doe",
      "email": "john@example.com",
      "total_orders": 3,
      "total_spent": 4500.00,
      "last_order_date": "2024-01-15T14:30:00.000Z"
    },
    {
      "id": 3,
      "username": "jane_smith",
      "email": "jane@example.com",
      "total_orders": 1,
      "total_spent": 1200.00,
      "last_order_date": "2024-01-10T10:15:00.000Z"
    }
  ]
}
\`\`\`

**Status Codes:**
- `200` - Success
- `401` - Authentication required
- `403` - Admin access required

---

## Health Check

### Health Check
**GET** `/health`

Check if the API is running.

**Response:**
\`\`\`json
{
  "message": "XM Bakery API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

**Status Codes:**
- `200` - API is running

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Common Error Messages

### Authentication Errors
- `"Access token required"` - No token provided
- `"Invalid token"` - Token is invalid or expired
- `"Invalid credentials"` - Wrong email/password
- `"Admin access required"` - Endpoint requires admin role

### Validation Errors
- `"Missing required fields: name, price, category, quantity"` - Required fields missing
- `"Price must be greater than 0"` - Invalid price value
- `"Quantity cannot be negative"` - Invalid quantity value
- `"Password must be at least 6 characters"` - Password too short
- `"Order must contain at least one item"` - Empty order
- `"Delivery location is required"` - Missing delivery location

### Business Logic Errors
- `"Product {id} not found"` - Product doesn't exist
- `"Insufficient stock for product {id}"` - Not enough inventory
- `"Duplicate entry found"` - Trying to create duplicate record
- `"Referenced record not found"` - Foreign key constraint error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit:** 100 requests per 15 minutes per IP address
- **Response when exceeded:** HTTP 429 with message "Too many requests"

---

## Data Types

### User Object
\`\`\`json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "role": "string (admin|customer)",
  "created_at": "datetime"
}
\`\`\`

### Product Object
\`\`\`json
{
  "id": "integer",
  "name": "string",
  "price": "decimal(10,2)",
  "category": "string",
  "quantity": "integer",
  "description": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
\`\`\`

### Order Object
\`\`\`json
{
  "id": "integer",
  "customer_id": "integer",
  "total_amount": "decimal(10,2)",
  "status": "string (pending|processing|delivered|cancelled)",
  "delivery_location": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
\`\`\`

### Order Item Object
\`\`\`json
{
  "id": "integer",
  "order_id": "integer",
  "product_id": "integer",
  "quantity": "integer",
  "price": "decimal(10,2)"
}
