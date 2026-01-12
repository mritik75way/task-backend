# Feature Flag Management System



## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* Zod (request validation)
* JWT Authentication

---

## Core Concepts

* **Feature Flags** are backend-controlled toggles evaluated per request
* **RBAC is enforced before rule evaluation**
* **Rules determine final access**, not roles alone
* **Percentage rollout is deterministic per user**
* **Admins manage features but are not automatically included in rollouts**

---

## Feature Evaluation Flow

Features are evaluated in the following order:

1. Feature existence check
2. Feature enabled check
3. Role-Based Access Control (RBAC)
4. Rule group evaluation (AND / OR)
5. Final decision returned to the client

This guarantees that users without required roles never gain access, even if rules match.

---

## Data Models

### User

```ts
{
  email: string
  password: string
  roles: string['USER' | 'ADMIN' | 'BETA']
}
```

### Feature

```ts
{
  key: string
  enabled: boolean
  allowedRoles: string[]
  ruleGroup?: {
    operator: 'AND' | 'OR'
    rules: {
      type: 'ROLE' | 'USER_ID' | 'PERCENTAGE'
      value: string | number
    }[]
  }
}
```

---

## Authentication

JWT-based authentication is used throughout the system.

All protected routes require the following header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/feature-flags
JWT_SECRET=your_jwt_secret
```

### 4. Run the project

```bash
npm run dev
```

The server will start on the configured port and connect to MongoDB.

---

## API Documentation

### Auth APIs

#### Register User

```
POST /auth/register
```

```json
{
  "email": "user@test.com",
  "password": "password123",
  "roles": ["USER"]
}
```

---

#### Login User

```
POST /auth/login
```

```json
{
  "email": "user@test.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

## Admin APIs (ADMIN role required)

### Create Feature

```
POST /admin/features
```

```json
{
  "key": "new_dashboard",
  "enabled": false,
  "allowedRoles": ["ADMIN", "BETA"]
}
```

---

### Update Feature

```
PUT /admin/features/:key
```

```json
{
  "enabled": true
}
```

---

### Set Rule Group

```
POST /admin/features/:key/rules
```

```json
{
  "operator": "OR",
  "rules": [
    { "type": "ROLE", "value": "BETA" },
    { "type": "PERCENTAGE", "value": 50 }
  ]
}
```

---

## Feature Evaluation API

### Evaluate Feature for Current User

```
GET /features/:key/evaluate
```

Headers:

```
Authorization: Bearer <JWT_TOKEN>
```

Response examples:

```json
{
  "enabled": true,
  "reason": "RULE_MATCHED"
}
```

```json
{
  "enabled": false,
  "reason": "ROLE_RESTRICTED"
}
```

---

## Evaluation Reasons

| Reason            | Description                   |
| ----------------- | ----------------------------- |
| FEATURE_NOT_FOUND | Feature does not exist        |
| FEATURE_DISABLED  | Feature is turned off         |
| ROLE_RESTRICTED   | User role not allowed         |
| NO_RULES          | Feature enabled without rules |
| RULE_MATCHED      | Rule group matched            |
| RULE_NOT_MATCHED  | Rule group did not match      |

---

## Rule Types

### ROLE

User must have the specified role.

```json
{ "type": "ROLE", "value": "BETA" }
```

### USER_ID

User ID must match exactly.

```json
{ "type": "USER_ID", "value": "507f1f77bcf86cd799439011" }
```

### PERCENTAGE

Enables the feature for a percentage of users using deterministic hashing.

```json
{ "type": "PERCENTAGE", "value": 30 }
```

---

## How to Test the System

1. Register an admin user
2. Login as admin and copy JWT token
3. Create a feature
4. Enable the feature
5. Add a rule group
6. Register and login as other users
7. Call the feature evaluation API
8. Observe different results based on roles and rules

---

## Project Structure

```
src/
 ├── controllers
 ├── models
 ├── repositories
 ├── routes
 ├── services
 ├── validations
 ├── middlewares
 └── utils
```

---

## Design Decisions

* RBAC is enforced before rule evaluation
* Percentage rollout is deterministic and consistent per user
* Admin users are not automatically included in rule evaluation
* Zod ensures strict request validation
* MVC structure keeps the codebase clean and maintainable


