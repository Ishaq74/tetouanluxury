export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'staff';
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  user?: AuthUser;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'client' | 'staff';
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  error?: string;
}
