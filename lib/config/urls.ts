export function appUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim().replace(/\/$/, "");

  return `${base}${path}`;
}

export function resolveAppHost(fallback = "app.nexoru.ai"): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;

  if (!configured) {
    return fallback;
  }

  try {
    return new URL(configured).host;
  } catch {
    return fallback;
  }
}
