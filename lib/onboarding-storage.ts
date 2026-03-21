const ONBOARDING_SESSION_TOKEN_KEY = "nexoru_onboarding_session_token";

export function getOnboardingSessionToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ONBOARDING_SESSION_TOKEN_KEY);
}

export function setOnboardingSessionToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ONBOARDING_SESSION_TOKEN_KEY, token);
}

export function clearOnboardingSessionToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ONBOARDING_SESSION_TOKEN_KEY);
}