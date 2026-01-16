from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from api.v1 import auth, users
from middleware.auth import AuthMiddleware 
from middleware.logging import LogMiddleware
from middleware.tracing import RequestIdMiddleware
from core.handlers import http_exception_handler, validation_exception_handler, unhandled_exception_handler

app = FastAPI()

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.add_middleware(AuthMiddleware)
app.add_middleware(LogMiddleware)
app.add_middleware(RequestIdMiddleware)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")

@app.get("/")
async def health_check():
    return {"status": "system healthy"}