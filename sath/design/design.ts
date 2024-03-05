
import authHeader from './auth-header';

import {instance}from './instance'


export const addDesign=async(projectId:string,formValue:[])=>{
    
    try{
        return instance.post(`/projects/${projectId}/designs/`, formValue);
       }
    catch(error){
        throw error;
       
    }

};

export const editTmInfo=async(projectId:string,designId:string,tm:any)=>{
    try{
        return instance.put(`projects/${projectId}/designs/${designId}`,tm)
    }
    catch{

    }
}

export const getDesign=async(projectId:string)=>{
    try{
        return instance.get(`/projects/${projectId}/designs`);
        
    }
    catch(error){
        throw error;
    }
};
export const getDesignRefresh=async(projectId:string)=>{
    try{
        return instance.get(`/projects/${projectId}/designs?refresh=true`);
    }
    catch(error){
        throw error;
    }
};

export const deleteDesign=async(projectId:string, designId:string)=>{
    try{
        return instance.delete(`/projects/${projectId}/designs/${designId}`);
    }catch(error){
        throw error;
    }
};

export const editDesignInfo=async(projectId:string,designId:string, formValue:object)=>{
    
    try{
        return instance.put(`/projects/${projectId}/designs/${designId}/add-format`,formValue);
    }catch(error){
        throw error;
    }
};

export const editDesignPathId=async(projectId:string,designId:string,formValue:object)=>{   
    try{
        return instance.put(`/projects/${projectId}/designs/${designId}`,formValue);

    }catch(error){
        throw error;
    }
};

export const getDesignDetails=async(projectId:string,designId:string)=>{
    try{
        return instance.get(`/projects/${projectId}/designs/${designId}`);
    }catch(error){
        throw error;
    }
};

