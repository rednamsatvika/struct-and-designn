export interface IDesign{
    success:boolean;
    result?:IdesignDetails[]|null;
};

export interface IdesignDetails{
    _id: string;
    type: string;
    name:string;
    project:string;
    structure: string;
    storage:Istorage[]|null
    createdAt:string;
    updatedAt:string;
    __v:number;
    tm:{tm:any[];
    offset:any[]}
}

export interface Istorage{
        provider:string;
        providerType:string;
        format:string;
        path:string;
        pathId:string
};