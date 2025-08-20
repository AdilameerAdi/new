const amountFormat = (
  n,
  region = 'es-ES',
  min = 2,
  max = 2,
) => {
  return n.toLocaleString(region, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
};

export default amountFormat;
