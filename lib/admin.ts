export const ADMIN_EMAILS = [
  "your@email.com", // ← replace with your Google login email
];

export function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}