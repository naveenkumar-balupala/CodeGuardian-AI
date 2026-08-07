from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    OAuthCallbackRequest,
    RefreshTokenRequest,
    ResetPasswordRequest,
    Setup2FAResponse,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
    Verify2FARequest,
    VerifyEmailRequest,
)
from app.schemas.common import ResponseEnvelope
from app.services.auth_service import AuthService
from app.services.oauth_service import OAuthService

router = APIRouter()

@router.post("/register", summary="User Registration", status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    user = await AuthService.register_user(db, data)
    return {
        "status": "success",
        "data": UserResponse.model_validate(user),
        "message": "User registered successfully. Please verify your email.",
    }

@router.post("/login", summary="User Login (JWT)", response_model=ResponseEnvelope[TokenResponse])
async def login(request: Request, data: UserLogin, db: AsyncSession = Depends(get_db)):
    client_ip = request.client.host if request.client else None
    tokens = await AuthService.authenticate_user(db, data, ip_address=client_ip)
    return ResponseEnvelope(data=tokens)

@router.post("/refresh", summary="Refresh JWT Access Token", response_model=ResponseEnvelope[TokenResponse])
async def refresh(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    tokens = await AuthService.refresh_access_token(db, data.refresh_token)
    return ResponseEnvelope(data=tokens)

@router.post("/logout", summary="User Logout")
async def logout(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    await AuthService.logout_user(db, data.refresh_token)
    return {"status": "success", "message": "Successfully logged out."}

@router.post("/forgot-password", summary="Request Password Reset")
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    reset_token = await AuthService.request_password_reset(db, data.email)
    return {
        "status": "success",
        "message": "If the account exists, a password reset link has been issued.",
        "debug_token": reset_token, # Exposed in dev for convenient testing
    }

@router.post("/reset-password", summary="Reset Password")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    await AuthService.reset_password(db, data.token, data.new_password)
    return {"status": "success", "message": "Password successfully reset."}

@router.post("/verify-email", summary="Verify Email Address")
async def verify_email(data: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    await AuthService.verify_email(db, data.token)
    return {"status": "success", "message": "Email address successfully verified."}

@router.get("/me", summary="Get Current User Profile", response_model=ResponseEnvelope[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    return ResponseEnvelope(data=UserResponse.model_validate(current_user))

# OAuth Endpoints
@router.get("/oauth/github/url", summary="Get GitHub OAuth Authorization URL")
async def get_github_url():
    return {"status": "success", "url": OAuthService.get_github_auth_url()}

@router.post("/oauth/github/callback", summary="GitHub OAuth Callback", response_model=ResponseEnvelope[TokenResponse])
async def github_callback(data: OAuthCallbackRequest, db: AsyncSession = Depends(get_db)):
    profile = await OAuthService.process_github_callback(data.code)
    tokens = await AuthService.authenticate_oauth_user(db, profile)
    return ResponseEnvelope(data=tokens)

@router.get("/oauth/google/url", summary="Get Google OAuth Authorization URL")
async def get_google_url():
    return {"status": "success", "url": OAuthService.get_google_auth_url()}

@router.post("/oauth/google/callback", summary="Google OAuth Callback", response_model=ResponseEnvelope[TokenResponse])
async def google_callback(data: OAuthCallbackRequest, db: AsyncSession = Depends(get_db)):
    profile = await OAuthService.process_google_callback(data.code)
    tokens = await AuthService.authenticate_oauth_user(db, profile)
    return ResponseEnvelope(data=tokens)

# 2FA Placeholder Endpoints
@router.post("/2fa/setup", summary="Setup Two-Factor Authentication", response_model=ResponseEnvelope[Setup2FAResponse])
async def setup_2fa(current_user: User = Depends(get_current_user)):
    secret = "JBSWY3DPEHPK3PXP" # Sample base32 TOTP secret
    qr_uri = f"otpauth://totp/CodeGuardian:{current_user.email}?secret={secret}&issuer=CodeGuardianAI"
    return ResponseEnvelope(data=Setup2FAResponse(totp_secret=secret, qr_uri=qr_uri))

@router.post("/2fa/verify", summary="Verify and Enable 2FA")
async def verify_2fa(data: Verify2FARequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if data.totp_code != "123456": # Placeholder validation
        return {"status": "error", "message": "Invalid 2FA code."}
    current_user.is_totp_enabled = True
    await db.commit()
    return {"status": "success", "message": "Two-factor authentication enabled successfully."}
