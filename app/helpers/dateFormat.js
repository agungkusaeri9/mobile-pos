/**
 * Format tanggal dan waktu ke format yang diinginkan
 * @param {string | Date} date - Tanggal dalam bentuk string atau Date
 * @param {string} dateFormat - Format yang diinginkan (default: 'dd-MM-yyyy hh:mm:ss')
 * @returns {string} Tanggal dan waktu yang sudah diformat
 */
export const dateFormat = (date, dateFormat = "dd-MM-yyyy hh:mm:ss") => {
  try {
    if (date) {
      const d = new Date(date);

      if (isNaN(d)) {
        throw new Error("Invalid date");
      }

      // Mendapatkan bagian-bagian tanggal
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
      const year = d.getFullYear();

      // Mendapatkan bagian waktu (jam, menit, detik)
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");

      // Mengubah format sesuai yang diminta
      if (dateFormat === "dd-MM-yyyy hh:mm:ss") {
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      } else if (dateFormat === "dd MMMM yyyy hh:mm:ss") {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${day} ${
          months[parseInt(month) - 1]
        } ${year} ${hours}:${minutes}:${seconds}`;
      } else if (dateFormat === "dddd, dd MMMM yyyy hh:mm:ss") {
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayOfWeek = daysOfWeek[d.getDay()];
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${dayOfWeek}, ${day} ${
          months[parseInt(month) - 1]
        } ${year} ${hours}:${minutes}:${seconds}`;
      }

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`; // Default format
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    // return ""; // Return string kosong jika terjadi kesalahan
  }
};
