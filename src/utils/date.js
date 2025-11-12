export function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

export function formatISODate(d) {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export function startOfMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return d;
}

export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function formatDisplayDate(isoDate) {
  // Convert ISO format (YYYY-MM-DD) to display format (Selasa, 12 November 2025)
  const date = new Date(isoDate + "T00:00:00");
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
}
