FastAPI (Professional Boilerplate)

A production-ready FastAPI architecture featuring SQLModel (PostgreSQL), Alembic migrations, JWT Authentication via Custom Middleware, and Global Exception Handling.

Project Architecture

The project follows a modular structure to separate concerns between the database, security, and API layers.
```
.
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py          # Signup & Login (Token generation)
│   │       └── users.py         # Protected User & Profile routes
│   ├── core/
│   │   ├── config.py            # Pydantic Settings & Environment loading
│   │   ├── security.py          # Password hashing & JWT logic
│   │   └── exceptions.py        # Global Exception Handlers
│   ├── db/
│   │   ├── engine.py            # SQLModel Engine configuration
│   │   ├── models.py            # Unified Schemas & Table Models
│   │   └── session.py           # DB Session Dependency
│   ├── middleware/
│   │   └── auth.py              # Custom JWT Middleware (The Gatekeeper)
│   └── main.py                  # Entry point & Global configurations
├── migrations/                  # Alembic Version control
├── .env                         # Secrets (DO NOT COMMIT TO GIT)
├── alembic.ini                  # Migration configuration
└── requirements.txt             # Dependencies
```

Setup & Installation

1. Virtual Environment

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt


2. Environment Variables (.env)

Create a .env file in the root directory:

DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=generate_a_secure_random_hex_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True


3. Database Migrations (Alembic)

Manage your database schema changes without losing data.

# Generate a new migration script
alembic revision --autogenerate -m "initial_schema"

# Apply the migration to the database
alembic upgrade head


Authentication & Security

Password Safety

We never store plain-text passwords.

Bcrypt (via Passlib) is used for salting and hashing.

Note: Input is limited to 72 bytes by the Bcrypt algorithm.

JWT Flow

Login: Client sends credentials to /api/v1/auth/login.

Token: Server returns a signed JWT.

Middleware: Our AuthMiddleware intercepts every request, decodes the token, and attaches the user to request.state.user.

Exception Handling

The API includes a global "Safety Net" to prevent internal server errors from exposing sensitive data.

422 Unprocessable Entity: Custom handler for cleaner Pydantic validation errors.

500 Internal Server Error: Global handler to catch database crashes or unexpected Python errors, returning a clean JSON response.

Running the Server

uvicorn app.main:app --reload


Swagger Docs: http://127.0.0.1:8000/docs

Workflow:

Go to /signup to create a user.

Go to /login to get a token.

Click the Authorize button in Swagger and paste your token.

Access /users/me to see your profile.

Key Best Practices Implemented

Multiple Models: Used UserBase, UserCreate, UserPublic, and User (Table) to segregate API data from Database data.

Dependency Injection: Used Depends(get_session) for efficient database connection pooling.

Case-Insensitive Config: Pydantic Settings configured to handle .env variables gracefully.