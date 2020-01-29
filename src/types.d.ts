// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string,
  room: string,
  working: boolean,
  upgrading: boolean
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension sampleso
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
