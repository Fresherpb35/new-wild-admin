/**
 * Converts an array of booking objects to a CSV string and triggers download.
 * @param {Array} bookings
 * @param {string} filename
 */
export function downloadBookingsCSV(bookings, filename = "bookings.csv") {
  const headers = [
    "Booking ID",
    "Name",
    "Email",
    "Phone",
    "Check-in",
    "Check-out",
    "Guests",
    "Status",
  ];

  const rows = bookings.map((b) => [
    b.id,
    b.name,
    b.email,
    b.phone,
    b.checkin,
    b.checkout,
    b.guests,
    b.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
