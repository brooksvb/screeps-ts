import { ErrorMapper } from "utils/ErrorMapper";

import _ from "lodash";
import * as Builder from 'roles/builder.js';
import * as Harvester from 'roles/harvester.js';
import * as Upgrader from 'roles/upgrader.js';
import * as Spawn from 'struct/spawn.js';
import * as Tower from 'struct/tower.js';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export let loop = () : any => {
  console.log(`Current game tick is ${Game.time}`);
  console.log('Running new ts deployment');

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const thisRoom = Game.spawns.Spawn1.room;
  const towers = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
  console.log('Towers:' + JSON.stringify(towers));
  towers.forEach((tower) => Tower.run(tower));

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
  console.log('Harvesters: ' + harvesters.length);

  if(harvesters.length < 2) {
    const options: SpawnOptions = {
      memory: {
        role: 'harvester',
        room: '',
        upgrading: false,
        working: false
      }
    };
    const newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns.Spawn1.spawnCreep([WORK,CARRY,MOVE], newName, options);
  }

  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
  console.log('Upgraders: ' + upgraders.length);

  if (upgraders.length < 3) {
    // Spawn upgrader
    const newName = 'Upgrader' + Game.time;
    const options: SpawnOptions = {
      memory: {
        role: 'upgrader',
        room: '',
        upgrading: false,
        working: false
      }
    };
    Game.spawns.Spawn1.spawnCreep([WORK,CARRY,MOVE], newName, options);
  }

  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
  console.log('Builders: ' + upgraders.length);

  if (builders.length < 2) {
    // Spawn builder
    const newName = 'Builder' + Game.time;
    const options: SpawnOptions = {
      memory: {
        role: 'builder',
        room: '',
        upgrading: false,
        working: false
      }
    };
    Game.spawns.Spawn1.spawnCreep([WORK,CARRY,MOVE], newName, options);
  }

  for(const name in Game.creeps) {
    const creep = Game.creeps[name];
    if(creep.memory.role === 'builder') {
      Builder.run(creep);
    }
    if(creep.memory.role === 'harvester') {
      Harvester.run(creep);
    }
    if(creep.memory.role === 'upgrader') {
      Upgrader.run(creep);
    }
  }
};
// TODO: ErrorMapper has a dependency issue that is not fixed yet: https://github.com/screepers/screeps-typescript-starter/issues/102#issuecomment-496351851
// loop = ErrorMapper.wrapLoop(loop);
