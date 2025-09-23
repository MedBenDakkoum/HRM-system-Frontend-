// src/utils/helpers.js
export const formatDate = (date, format = "long") => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (format === "short") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "#10b981";
    case "rejected":
      return "#ef4444";
    case "pending":
    default:
      return "#f59e0b";
  }
};
