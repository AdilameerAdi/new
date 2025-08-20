const reputation = (reput) => {
  // Define los rangos de reputación y los IDs de imagen correspondientes
  const ranges = [
    { min: 0, max: 50, id: 1 }, // BEGINNER_1
    { min: 51, max: 150, id: 1 }, // BEGINNER_2
    { min: 151, max: 250, id: 1 }, // BEGINNER_3
    { min: 251, max: 500, id: 2 }, // GREEN_TRAINEE
    { min: 501, max: 750, id: 3 }, // BLUE_TRAINEE
    { min: 751, max: 1000, id: 4 }, // RED_TRAINEE
    { min: 1001, max: 2250, id: 5 }, // GREEN_EXPERIENCED
    { min: 2251, max: 3500, id: 6 }, // BLUE_EXPERIENCED
    { min: 3501, max: 5000, id: 7 }, // RED_EXPERIENCED
    { min: 5001, max: 9500, id: 8 }, // GREEN_BATTLE_SOLDIER
    { min: 9501, max: 19000, id: 9 }, // BLUE_BATTLE_SOLDIER
    { min: 19001, max: 25000, id: 10 }, // RED_BATTLE_SOLDIER
    { min: 25001, max: 40000, id: 11 }, // GREEN_EXPERT
    { min: 40001, max: 60000, id: 12 }, // BLUE_EXPERT
    { min: 60001, max: 85000, id: 13 }, // RED_EXPERT
    { min: 85001, max: 115000, id: 14 }, // GREEN_LEADER
    { min: 115001, max: 150000, id: 15 }, // BLUE_LEADER
    { min: 150001, max: 190000, id: 16 }, // RED_LEADER
    { min: 190001, max: 235000, id: 17 }, // GREEN_MASTER
    { min: 235001, max: 285000, id: 18 }, // BLUE_MASTER
    { min: 285001, max: 350000, id: 19 }, // RED_MASTER
    { min: 350001, max: 500000, id: 20 }, // GREEN_NOS
    { min: 500001, max: 1500000, id: 21 }, // BLUE_NOS
    { min: 1500001, max: 2500000, id: 22 }, // RED_NOS
    { min: 2500001, max: 3750000, id: 23 }, // GREEN_ELITE
    { min: 3750001, max: 5000000, id: 24 }, // BLUE_ELITE
    { min: 5000001, id: 25 }, // RED_ELITE y más allá
  ];

  // Encuentra el rango correspondiente a la reputación dada
  const result = ranges.find(
    (range) =>
      reput >= range.min &&
      (reput <= range.max ||
        range.max === undefined),
  );

  // Asigna el ID de imagen basado en el rango encontrado
  const id = result ? result.id : 'default';

  // Retorna el elemento de imagen
  return `/img/reputation/${id}.png`;
};

export default reputation;
