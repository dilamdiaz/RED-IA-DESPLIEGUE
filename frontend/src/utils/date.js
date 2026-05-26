export const formatDateLong = (date) => {
  if (!date) return '';

  const d = new Date(date);

  return new Intl.DateTimeFormat('es-CO', {
    timeZone: 'UTC', // 🔥 evita que baje/suba días por zona horaria
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
};