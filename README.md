# 🍬 Sweet Management System

A comprehensive full-stack application for managing sweet inventory and customer purchases, built with modern web technologies and following Test-Driven Development principles.

## 🎯 Project Overview

The Sweet Management System is designed to streamline sweet shop operations by providing a digital platform for inventory management and customer interactions. This application demonstrates clean architecture, proper authentication, and role-based access control.

## 🔬 Development Philosophy

This project follows the **Test-Driven Development (TDD)** approach:

- **🔴 Red Phase**: Write comprehensive test cases that initially fail
- **🟢 Green Phase**: Implement minimal code to pass the tests
- **🔵 Refactor Phase**: Optimize and clean code while maintaining test coverage

## ⚡ Key Features

### 🔐 Authentication System
- Secure user registration and login
- JWT-based session management
- Role-based access control (Customer/Admin)

### 👥 Customer Features
- Browse complete sweet catalog
- Advanced search and filtering capabilities
- Seamless purchase experience with real-time stock updates
- User-friendly dashboard interface

### 🛠️ Admin Management
- Complete inventory control (Add/Edit/Delete sweets)
- Stock management and restocking functionality
- Protected admin panel with secure access
- Real-time inventory tracking
- Admin-only sweet management operations
- Bulk operations for efficient inventory management

### 🎨 User Experience
- Responsive design for all devices
- Intuitive navigation and clean interface
- Real-time feedback and error handling

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Context API** - State management solution
- **CSS3** - Custom styling with responsive design
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Testing & Development
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library
- **Nodemon** - Development server auto-restart

## 📁 Project Architecture

```
sweet-management-system/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state management
│   │   │   └── SweetContext.jsx     # Sweet inventory state
│   │   ├── pages/
│   │   │   ├── Login.jsx           # User authentication page
│   │   │   ├── Login.css           # Login page styles
│   │   │   ├── Dashboard.jsx       # Customer dashboard
│   │   │   ├── Dashboard.css       # Dashboard styles
│   │   │   ├── AdminPanel.jsx      # Admin management interface
│   │   │   └── AdminPanel.css      # Admin panel styles
│   │   ├── utils/
│   │   │   └── validation.js       # Form validation utilities
│   │   ├── Register.jsx            # User registration component
│   │   ├── App.jsx                 # Main application component
│   │   ├── App.css                 # Global application styles
│   │   ├── index.css               # Base CSS styles
│   │   └── main.jsx                # React application entry point
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite configuration
│   └── package.json                # Frontend dependencies
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection setup
│   │   ├── models/
│   │   │   ├── User.js             # User data model
│   │   │   └── Sweet.js            # Sweet inventory model
│   │   ├── controllers/
│   │   │   ├── authController.js   # Authentication logic
│   │   │   └── sweetController.js  # Sweet management logic
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js   # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Authentication endpoints
│   │   │   └── sweetRoutes.js      # Sweet management endpoints
│   │   ├── app.js                  # Express application setup
│   │   ├── server.js               # Server entry point
│   │   └── seed.js                 # Database seeding script
│   └── package.json                # Backend dependencies
│
└── README.md                       # Project documentation
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd sweet-management-system
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. **Database Initialization**
```bash
npm run seed  # Creates admin user and sample data
```

5. **Start Backend Server**
```bash
# For development (with auto-restart)
npm run dev

# For production
npm start
```
6. **Start Backend Server**
```bash
# For development (with auto-restart)
npm run dev

# For production
npm start
```
Backend will run on: `http://localhost:5000`

7. **Frontend Setup** (New terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:4000`

## 🧪 Testing

Run the comprehensive test suite:
```bash
cd backend
npm test
```

The testing covers:
- Authentication endpoints
- Sweet management operations
- Authorization middleware
- Database operations

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### 🔐 Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "dhruv123",
  "email": "dhruv@example.com",
  "password": "StrongPass@123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered",
  "user": {
    "id": "651234abcd567ef901234567",
    "username": "dhruv123",
    "email": "dhruv@example.com",
    "role": "customer"
  }
}
```

**Failure Cases:**
- Email already exists: `{"error": "Email already registered"}`
- Validation fails: `{"error": ["Password must be at least 6 characters long"]}`

#### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "dhruv@example.com",
  "password": "StrongPass@123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
  "role": "customer"
}
```

**Failure Cases:**
- Missing credentials: `{"error": "Email and password are required"}`
- Invalid credentials: `{"error": "Invalid credentials"}`

### 🍬 Sweet Management Endpoints

#### 1. Add Sweet (Admin Only)
**POST** `/api/sweets`

**Request Body:**
```json
{
  "name": "Kaju Katli",
  "category": "Dry Fruit",
  "price": 250,
  "quantity": 50
}
```

**Success Response (201):**
```json
{
  "_id": "651234abcd567ef901234567",
  "name": "Kaju Katli",
  "category": "Dry Fruit",
  "price": 250,
  "quantity": 50,
  "__v": 0
}
```

**Failure Response:**
```json
{
  "error": "Duplicate sweet name already exists"
}
```

#### 2. Get All Sweets
**GET** `/api/sweets`

**Success Response (200):**
```json
[
  {
    "_id": "651234abcd567ef901234567",
    "name": "Kaju Katli",
    "category": "Dry Fruit",
    "price": 250,
    "quantity": 50,
    "__v": 0
  },
  {
    "_id": "651234abcd567ef901234890",
    "name": "Gulab Jamun",
    "category": "Milk Sweet",
    "price": 150,
    "quantity": 100,
    "__v": 0
  }
]
```

#### 3. Search Sweets
**GET** `/api/sweets/search?name=jamun&minPrice=100&maxPrice=200&category=Milk Sweet`

**Success Response (200):**
```json
[
  {
    "_id": "651234abcd567ef901234890",
    "name": "Gulab Jamun",
    "category": "Milk Sweet",
    "price": 150,
    "quantity": 100,
    "__v": 0
  }
]
```

#### 4. Update Sweet (Admin Only)
**PUT** `/api/sweets/:id`

**Request Body:**
```json
{
  "price": 300,
  "quantity": 70
}
```

**Success Response (200):**
```json
{
  "_id": "651234abcd567ef901234567",
  "name": "Kaju Katli",
  "category": "Dry Fruit",
  "price": 300,
  "quantity": 70,
  "__v": 0
}
```

**Not Found:**
```json
{
  "error": "Not found"
}
```

#### 5. Delete Sweet (Admin Only)
**DELETE** `/api/sweets/:id`

**Success Response:**
```json
{
  "message": "Deleted successfully"
}
```

**Not Found:**
```json
{
  "error": "Not found"
}
```

#### 6. Purchase Sweet (Customer)
**POST** `/api/sweets/:id/purchase`

**Request Body:**
```json
{
  "quantity": 5
}
```

**Success Response:**
```json
{
  "message": "Purchased",
  "sweet": {
    "_id": "651234abcd567ef901234890",
    "name": "Gulab Jamun",
    "category": "Milk Sweet",
    "price": 150,
    "quantity": 95,
    "__v": 0
  }
}
```

**Failure (insufficient stock):**
```json
{
  "error": "Not enough stock"
}
```

#### 7. Restock Sweet (Admin Only)
**POST** `/api/sweets/:id/restock`

**Request Body:**
```json
{
  "quantity": 20
}
```

**Success Response:**
```json
{
  "message": "Restocked",
  "sweet": {
    "_id": "651234abcd567ef901234890",
    "name": "Gulab Jamun",
    "category": "Milk Sweet",
    "price": 150,
    "quantity": 115,
    "__v": 0
  }
}
```

## 🎨 User Interface

The application features a modern, responsive design with a beautiful purple gradient theme and intuitive user experience.

### 📱 Application Screenshots

#### 🏠 Customer Dashboard

**Features visible:**
- Clean dashboard with "Available Sweets" heading
- Sweet cards showing Chocolate Bar (₹50), Gummy Bears (₹30), Ladoo (₹20)
- Stock information for each sweet (100, 200, 150 units)
- Advanced search with category dropdown and price filters
- Admin Panel and Logout navigation buttons

#### 🔐 Login Page

**Features visible:**
- Centered white card on purple gradient background
- "Welcome Back" title with subtitle
- Clean email and password input fields
- Purple "Sign In" button
- "Create account" link for registration

#### 📝 Registration Page

**Features visible:**
- "Create Account" form with community invitation
- Username, Email, and Password fields
- Purple "Create Account" button
- "Sign in" link for existing users

#### ⚙️ Admin Panel

**Admin Features:**
- **Sweet Management Dashboard**: Complete inventory overview
- **Add New Sweet**: Form to add sweets with name, category, price, and quantity
- **Edit/Update Sweets**: Modify existing sweet details and pricing
- **Delete Sweets**: Remove items from inventory
- **Restock Management**: Add stock to existing sweets
- **Inventory Tracking**: Real-time stock levels and alerts
- **Admin-only Access**: Protected routes with role-based authentication

### 🎨 Design Features
- **Modern Purple Gradient**: Eye-catching purple-to-blue gradient background
- **Clean Cards Design**: Sweet items displayed in organized, easy-to-scan cards
- **Responsive Layout**: Adapts seamlessly to different screen sizes
- **Intuitive Navigation**: Clear navigation with Admin Panel access and logout functionality
- **Advanced Search**: Comprehensive filtering by name, category, and price range
- **Professional Typography**: Clean, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects and smooth transitions
- **Stock Indicators**: Real-time stock information displayed on each sweet card
- **Consistent Branding**: Sweet Shop logo with candy emoji (🍭) throughout the app

## 🔒 Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TDD principles when adding new features
4. Ensure all tests pass (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Development Notes

- Follow the Red-Green-Refactor TDD cycle
- Write tests before implementing features
- Maintain consistent code formatting
- Use meaningful commit messages
- Document any new API endpoints

## 🚀 Deployment

For production deployment:
1. Set NODE_ENV=production
2. Use a production MongoDB instance
3. Configure proper CORS settings
4. Set up SSL certificates
5. Use PM2 or similar for process management

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Follow the TDD principles when reporting bugs
- Include test cases when suggesting features

---

*This project demonstrates modern full-stack development practices with emphasis on test-driven development and clean architecture.*
