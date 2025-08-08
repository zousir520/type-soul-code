export function getIsoTimestr(): string {
  return new Date().toISOString();
}

export function getOneYearLaterTimestr(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

export function getOneMonthLaterTimestr(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}
