// Utility to format date to yyyy-MM-dd HH:mm:ss
export function formatDateTime(dt) {
  if (!dt) return '';
  const date = new Date(dt);
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
