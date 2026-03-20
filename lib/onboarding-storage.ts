const ONBOARDING_SESSION_TOKEN_KEY = "nexoru_onboarding_session_token";

export function getOnboardingSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ONBOARDING_SESSION_TOKEN_KEY);
}

export function setOnboardingSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_SESSION_TOKEN_KEY, token);
}

export function clearOnboardingSessionToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_SESSION_TOKEN_KEY);
}