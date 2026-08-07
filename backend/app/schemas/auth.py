import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import UserRole, UserStatus


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=255)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: str | None = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

class VerifyEmailRequest(BaseModel):
    token: str

class OAuthCallbackRequest(BaseModel):
    code: str

class Setup2FAResponse(BaseModel):
    totp_secret: str
    qr_uri: str

class Verify2FARequest(BaseModel):
    totp_code: str

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: UserRole
    status: UserStatus
    is_verified: bool
    is_totp_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse
