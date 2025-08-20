const bonus = (value, percent) => {
  return value + value * Number(`0.${percent}`);
};

const discount = (value, percent) => {
  return value - value * Number(`0.${percent}`);
};

export { bonus, discount };
