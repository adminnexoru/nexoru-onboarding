export function generateMeetingReference(date = new Date()): string {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `NXR-SES-${year}${month}${day}-${random}`;
}

export function getOnboardingTimezone(): string {
  return "America/Mexico_City";
}