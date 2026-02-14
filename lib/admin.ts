export const ADMIN_EMAILS = [
  "muhammedismailps232@gmail.com"
];

export function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}