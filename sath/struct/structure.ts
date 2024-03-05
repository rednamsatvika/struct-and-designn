import authHeader from './auth-header';
import { instance } from './instance';
export const getStructure = async (projectId: string) => {
  return await instance.get(`/projects/${projectId}/structures/hierarchy`);
};

export const displayStructureDetails=async(projectId:string)=>{
  return await instance.get(`/projects/${projectId}/structures`, {
    headers: authHeader.authHeader(),
  });
};

export const addNewStructure =async(projectId:string, newStructure: any) =>{
  return await instance.post(`/projects/${projectId}/structures`,newStructure);
};

export const updateStructureDetails =async(
  structureId:string,
  projectId:string, 
  updatedDetails:object, 
  
 ) => {
   try{
         return await instance.put(`/projects/${projectId}/structures/${structureId}`,updatedDetails);
      }
  catch (error) {
    throw error;
  }
};

export const addStructure =async( 
  projectId:string,
  formValue:[])=>{
    try{
        return instance.post(`/projects/${projectId}/structures/`,formValue);
        
       }
  catch (error) {
    throw error;
  }
};

export const updateDesignStructure=async(structureId:string,projectId:string)=>{
  const updateDesign={structure:structureId, project:projectId}
  try{
    return await instance.put(`/projects/${projectId}/structures/${structureId}/update-designs`,updateDesign);
  }
  catch(error){
    throw error;
  }
};

export const fetchStructureDetails=async(structureId:string,projectId:string)=>{
  try{
    return await instance.get(`/projects/${projectId}/structures/${structureId}`,
    );
  }
  catch(error){
    throw error;
  }
}

export const updatestructureWbs=async(structureId:string,projectId:string, updateChildren:any)=>{
  try{
    return await instance.put(`/projects/${projectId}/structures/${structureId}/updatewbs`,updateChildren
    
    );
    

  }catch(error){
    throw error;
  }
}


export const updatestructuredragwbs=async(structureId:string,projectId:string,updateWbs:any)=>{
  try{
    return await instance.put(`/projects/${projectId}/structures/${structureId}/rearrangewbsids`,updateWbs);
  }
  catch(error){
    throw error;
  }
}