export type UserRole = 'ADMIN' | 'SECURITY_ENGINEER' | 'DEVELOPER' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  is_verified: boolean;
  is_totp_enabled: boolean;
  created_at: string;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}
