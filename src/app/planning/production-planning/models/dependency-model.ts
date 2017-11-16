/**
 * Created by marvinlott on 14.11.17.
 */
export interface Dependencie{
  id:number;
  dependencies:number[];
}

export class Dependency implements  Dependencie{
  id:number;
  dependencies:number[];
  constructor(id:number, dependencies: number[]){
    this.id = id;
    this.dependencies = dependencies;
  }
}
