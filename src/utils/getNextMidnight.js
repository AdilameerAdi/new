const getNextMidnight = () => {
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setDate(now.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);
  return nextMidnight.getTime();
};
export default getNextMidnight;
