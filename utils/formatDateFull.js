export const formatDateFull = (dateInput) => {
  if (!dateInput) return "N/A";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
