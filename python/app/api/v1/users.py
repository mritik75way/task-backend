from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(oauth2_scheme)])

@router.get("/me")
def get_me(request: Request):
    return {"current_user": request.state.user}