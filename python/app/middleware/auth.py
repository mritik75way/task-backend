from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from utils.auth_utils import verify_access_token

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in ["/docs", "/redoc", "/openapi.json", "/api/v1/auth/login", "/", "/api/v1/auth/signup"]:
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

        token = auth_header.split(" ")[1]
        
        username = verify_access_token(token)
        if not username:
            return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})
        request.state.user = username

        return await call_next(request)