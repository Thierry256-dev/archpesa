export const formatCurrency = (
  amount,
  currencyCode = "UGX",
  locale = "en-US",
) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currencyCode} 0`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
