export interface IStrature {
  success: boolean;
  result?: IStratureEntity[] | null;
}
export interface IStratureEntity {
  _id: string;
  name: string;
  type: string;
  wbs:string;
  parent?: null;
  children?: ChildrenEntity[] | null;
}
export interface ChildrenEntity {
  _id: string;
  name: string;
  type: string;
  parent: string;
  wbs:string;
  children?: ChildrenEntity1[] | null;
}
export interface ChildrenEntity1 {
  _id: string;
  name: string;
  type: string;
  parent: string;
  wbs:string;
  children?: null[] | null;
}


export interface IStructure{
  success:boolean;
  result?:IStructureInfo[]|null;
}

export interface IStructureInfo{

  _id: string;
  name: string;
  type: string;
  isExterior: boolean;
  project: string;
  wbs:string;
  designs:{_id:string;
  type:string;
  name:string;
  project:string;
  structure:string;
  storage:any[];
  createdAt:string;
  updatedAt:string;
  __v:number;
}; 
  location: any[];  
  parent: string;
  children: string[]|undefined;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDesign{
     _id:string;
     type:string;
     name:string;
     project:string;
     structure:string;
     storage:any[];
     createdAt:string;
     updatedAt:string;
     __v:number;
}
export interface IChildStructure{
  _id:string;
  name:string;
  wbs:string;
}