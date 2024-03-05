import React, { Children, use, useEffect, useState } from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import Tree from './tree';
interface IProps {
  treeList: ChildrenEntity[];
  getStructureData: (strature: ChildrenEntity) => void;
  sidebarStatus: boolean;
  RevSideBarStatusChange: (newStatus: boolean) => void;
  AllJobButtonStatusChange: boolean;
  RevAllJobStatusChange: (newStatus: boolean) => void;
  AllSnapShotButtonStatus: boolean;

}
const TreeList: React.FC<IProps> = ({ treeList, getStructureData, sidebarStatus, RevSideBarStatusChange, AllJobButtonStatusChange, RevAllJobStatusChange, AllSnapShotButtonStatus }) => {
  localStorage.setItem("tree",JSON.stringify(treeList))
  const [currentClickedStructure, setCurrentClickedStructure] = useState<any>();
  const [revSideBarStatusChange, setRevSideBarStatusChange] = useState(false)
  const [revAllJobButtonStatus, setRevAllJobButtonStatus] = useState(false)
  const [localStorageStatus, setLocalStoragestatus] = useState(0)
  useEffect(() => {
    setLocalStoragestatus(1);
    getStructureData(JSON.parse(localStorage.getItem('structure') || 'null'))
  }, [])




  RevSideBarStatusChange(revSideBarStatusChange)
  RevAllJobStatusChange(revAllJobButtonStatus)

useEffect(()=>{
  
})
  const getStructure = (structure: ChildrenEntity) => {
    if(localStorageStatus === 0){
       getStructureData(JSON.parse(localStorage.getItem('structure') || 'null'))
          
      }  
      else{
        getStructureData(structure);
        setCurrentClickedStructure(structure._id)
       
      }
    }
    
  useEffect(() => {
    if (AllJobButtonStatusChange) {
      setCurrentClickedStructure(null)
      setRevAllJobButtonStatus(false)

    }

  }, [AllJobButtonStatusChange, currentClickedStructure, getStructure])
  useEffect(() => {
    if (AllSnapShotButtonStatus) {
      setCurrentClickedStructure(null)
    }
  }, [AllSnapShotButtonStatus])
  useEffect(() => {
    if (sidebarStatus) {
      setRevSideBarStatusChange(false)
    }
  }, [sidebarStatus, setRevSideBarStatusChange]);
  return (
    <div>
      <Tree
        tree={treeList}
        getStructureData={
           getStructure

            
        }
        currentClickedStructure={
          
            currentClickedStructure 
        }
        depth={1}
      />


    </div>
  );
};

export default TreeList;
