export const formatCurrency = (value: number) => {
  if (isNaN(value)) return "";
  return `$${new Intl.NumberFormat("es-AR").format(value)}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", { timeZone: "UTC" });
};
