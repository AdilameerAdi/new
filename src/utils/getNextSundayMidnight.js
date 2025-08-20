const getNextSundayMidnight = () => {
  const now = new Date();
  const nextSunday = new Date(now.getTime());
  const currentDayOfWeek = now.getDay();
  const daysUntilNextSunday =
    currentDayOfWeek === 0
      ? 7
      : 7 - currentDayOfWeek;

  nextSunday.setDate(
    now.getDate() + daysUntilNextSunday,
  );

  nextSunday.setHours(0, 0, 0, 0);

  return nextSunday.getTime();
};

export default getNextSundayMidnight;
