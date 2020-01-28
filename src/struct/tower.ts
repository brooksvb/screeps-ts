const repairClosest = (tower: any) => {
  const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (structure: any) => structure.hits < structure.hitsMax
  });
  if(closestDamagedStructure) {
    tower.repair(closestDamagedStructure);
  }
};

const attackClosest = (tower: any) => {
  const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if(closestHostile) {
    tower.attack(closestHostile);
  }
};

export const run = (tower: any) => {
  repairClosest(tower);
  attackClosest(tower);
};
