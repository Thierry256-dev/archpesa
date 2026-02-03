export const getNextDate = (dateFormat) => {
  if (!dateFormat) return "N/A";

  const [year, month, day] = dateFormat.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + 30);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
