const JWT_KEY = "traking_jwt";
const REFRESH_TOKEN_KEY = "traking_refresh_token";

export function getJwt(): string | null {
  return localStorage.getItem(JWT_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setSession(jwt: string, refreshToken: string): void {
  localStorage.setItem(JWT_KEY, jwt);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearSession(): void {
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getJwt() !== null;
}
