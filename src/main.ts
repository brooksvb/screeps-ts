import { ErrorMapper } from "utils/ErrorMapper";

import * as Harvester from 'roles/harvester.js';
import * as Builder from 'roles/builder.js';
import * as Upgrader from 'roles/upgrader.js';
import * as Tower from 'struct/tower.js';
import * as Spawn from 'struct/spawn.js';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  let thisRoom = Game.spawns['Spawn1'].room;
  let towers = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
  console.log(JSON.stringify(towers));
  towers.forEach((tower) => Tower.run(tower));


  let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  console.log('Harvesters: ' + harvesters.length);

  let options: SpawnOptions = {
    memory: {
      role: 'harvester',
      room: '',
      working: false,
      upgrading: false
    }
  };

  if(harvesters.length < 2) {
    let newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, options);
  }

  // Trouble code, can't figure out how to call the other function in the module
  try {
    for (let spawnName in Game.spawns) {
      // Spawn.run(Game.spawns[spawnName]);
    }
  } catch (e) {
    console.log(e);
  }
  // Game.spawns.forEach((spawn) => structSpawn.run(spawn));

  let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  console.log('Upgraders: ' + upgraders.length);

  if (upgraders.length < 5) {
    // Spawn upgrader
    let newName = 'Upgrader' + Game.time;
    let options: SpawnOptions = {
      memory: {
        role: 'upgrader',
        room: '',
        working: false,
        upgrading: false
      }
    };
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, options);
  }

  for(let name in Game.creeps) {
    let creep = Game.creeps[name];
    if(creep.memory.role == 'builder') {
      Builder.run(creep);
    }
    if(creep.memory.role == 'harvester') {
      Harvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      Upgrader.run(creep);
    }
  }
});
