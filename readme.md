# User Routes Documentation

This document provides a comprehensive overview of the routes available in the `routes/userRoute.js` file. These routes handle user registration, login, profile retrieval, and logout functionalities, and are intended for frontend developers.

## Routes

### 1. Register User
**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** Registers a new user.

#### Validation
- **email:** Must be a valid email address.
- **fullname.firstname:** Must be at least 3 characters long.
- **password:** Must be at least 6 characters long.

#### Request Body
```json
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John"
  },
  "password": "password123"
}
```

#### Response
- **Success:** Returns the registered user details.
- **Failure:** Returns validation errors.

### 2. Login User
**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Logs in an existing user.

#### Validation
- **email:** Must be a valid email address.
- **password:** Must be at least 6 characters long.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response
- **Success:** Returns the user details and authentication token.
- **Failure:** Returns validation errors or authentication errors.

### 3. Get User Profile
**Endpoint:** `/profile`  
**Method:** `GET`  
**Description:** Retrieves the profile of the authenticated user.

#### Middleware
- **authMiddleware:** Ensures the user is authenticated.

#### Response
- **Success:** Returns the user profile details.
- **Failure:** Returns authentication errors.

### 4. Logout User
**Endpoint:** `/logout`  
**Method:** `GET`  
**Description:** Logs out the authenticated user.

#### Middleware
- **authMiddleware:** Ensures the user is authenticated.

#### Response
- **Success:** Confirms the user has been logged out.
- **Failure:** Returns authentication errors.

## Middleware

### authMiddleware
This middleware ensures that the user is authenticated before accessing certain routes. It should be applied to routes that require user authentication.

## Controllers

### UserController
The `UserController` handles the logic for the user-related routes. The following methods are available:

- **registerUser:** Handles user registration.
- **loginUser:** Handles user login.
- **getUserProfile:** Retrieves the authenticated user's profile.
- **logoutUser:** Handles user logout.

