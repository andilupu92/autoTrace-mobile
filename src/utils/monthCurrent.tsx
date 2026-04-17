export default function monthCurrent(date: Date) {
  
    return date.toLocaleDateString("ro-RO", {
        month: "long",
        year: "numeric",
    }).toUpperCase();

}