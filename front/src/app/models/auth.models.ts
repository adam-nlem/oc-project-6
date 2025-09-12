export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}
