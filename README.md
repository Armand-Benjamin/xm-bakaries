# XM Bakery Management System

A simple Node.js backend system for managing bakery operations including products, orders, inventory, and customer management.

## Features

- User authentication and authorization
- Product management (CRUD operations)
- Order management and tracking
- Inventory tracking
- Sales and inventory reporting
- Customer management
- Search and filter functionality

## Setup Instructions

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env` file with your database credentials:
\`\`\`
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=xm_bakery
JWT_SECRET=your_jwt_secret_key_here
\`\`\`

3. Setup database:
\`\`\`bash
node scripts/setup-database.js
\`\`\`

4. Start the server:
\`\`\`bash
npm start
\`\`\`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products (with search/filter)
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Add new product (admin only)
- PUT `/api/products/:id` - Update product (admin only)
- DELETE `/api/products/:id` - Delete product (admin only)

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get single order
- PUT `/api/orders/:id/status` - Update order status (admin only)

### Reports
- GET `/api/reports/sales` - Sales report (admin only)
- GET `/api/reports/inventory` - Inventory report (admin only)
- GET `/api/reports/customers` - Customer report (admin only)

## Usage Examples

### Register User
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
\`\`\`

### Search Products
\`\`\`bash
curl "http://localhost:3000/api/products?category=bread&minPrice=400&sortBy=price&sortOrder=asc"
\`\`\`

### Create Order
\`\`\`bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"product_id":1,"quantity":2}],"delivery_location":"Kigali, Nyarugenge"}'
