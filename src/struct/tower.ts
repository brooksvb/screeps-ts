
const drawUi = function (tower: any) {

};

const repairClosest = function(tower : any) {
  let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (structure: any) => structure.hits < structure.hitsMax
  });
  if(closestDamagedStructure) {
    tower.repair(closestDamagedStructure);
  }
};

const attackClosest = function(tower: any) {
  let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if(closestHostile) {
    tower.attack(closestHostile);
  }
};

/** @param {StructureTower} tower **/
export const run = function(tower: any) {
  drawUi(tower);

  repairClosest(tower);
  attackClosest(tower);

};
