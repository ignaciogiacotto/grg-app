export const formatCurrency = (value: number) => {
  if (isNaN(value) || value === 0) return "";
  return `$${new Intl.NumberFormat("es-AR").format(value)}`;
};
