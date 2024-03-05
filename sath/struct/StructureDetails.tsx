import React, { useEffect, useState } from 'react';
import { ChildrenEntity, IChildStructure, IStructureInfo, } from '../../models/IStrature';
import { addStructure, displayStructureDetails, getStructure, updateDesignStructure, updateStructureDetails, updatestructureWbs, updatestructuredragwbs } from '../../services/structure';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import AddStructureDetails from './addStructureDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import StrictModeDroppable from '../layout/droppable';
import { TypeValue } from '../../utils/constants';


interface IProps {
  strature: ChildrenEntity
  structure: IStructureInfo;
  parentName?: string[] | undefined;
  child: IChildStructure[];
  onSidebarStatusChange: (newStatus: boolean) => void;
  RevSideBarStatus: any;
  SideMenuReload : (newStatus: boolean) => void;
  RevSideMenuReloadStatus: boolean;
  StructureName:any
  invalidateStructureQuery: () => void;
 
}
interface DraggableChild {
  draggableId: string | null;
  source?: {
    index: number;
  } | null;
  destination?:{
    index:number;
  } | null;
}
const StructureDetails: React.FC<IProps> = ({ strature, structure, parentName, child, onSidebarStatusChange, RevSideBarStatus, SideMenuReload,RevSideMenuReloadStatus, StructureName,invalidateStructureQuery}) => {
  console.log("str",structure)
  const router = useRouter()
  const [details, setDetails] = useState<IProps>({ strature, structure, parentName, child, onSidebarStatusChange, RevSideBarStatus, SideMenuReload,RevSideMenuReloadStatus, StructureName ,invalidateStructureQuery });
  const [sidebarStatus, setSideBarStatus] = useState(false);
  const [popupOpen, setPopupOpen] = useState<'addStructure' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wbsChanged, setWbsChanged] = useState<boolean>(false);
  const [structureDataDetails, setstructureDataDetails] = useState<IStructureInfo>(structure);
  const [type, setType] = useState();
  const [nameexist, setNameExist] = useState(false);
  const [name, setname] = useState('')
  const [nameLength, setNameLength] = useState(false)
  const [isSubmitting, setIsSumbitting] = useState(false);
  const [sideMenuStatusReload,setSideMenuReload] = useState(false)
  const [trimmedValueLength,setrimmedValueLength] = useState(0)
  const [errorMessage,setErrorMessage] = useState('')
  const [wbsLoading, setWbsLoading] = useState<boolean>(false);
  const [wbsUpdatePopup, setwbsUpdatePopup] = useState<boolean>(false);
  const [currentStructureId, setCurrentStructureId] = useState('');
  const [draggedChild, setDraggedChild] = useState<DraggableChild | null>(null);
  const [children, setchildren] = useState<IChildStructure[]>([]);
  console.log(structureDataDetails)
  //SideMenuReload(sideMenuStatusReload)
  //onSidebarStatusChange(sidebarStatus);
  
  useEffect(()=>{
    setSideMenuReload(RevSideMenuReloadStatus)
    setSideBarStatus(RevSideBarStatus)
   // fetchDetails();
  },[sideMenuStatusReload,sidebarStatus])
  const handleOpen = () => {
    setPopupOpen('addStructure');
  };
  const handleClose = () => {
    setPopupOpen(null);
  };
  const handleChildInputChange = (childID: any, e: React.ChangeEvent<HTMLInputElement>) => {
    setWbsChanged(true);
    const childIndex = child.findIndex((c) => c._id === childID);
    if (childIndex !== -1) {
      child[childIndex].wbs = e.target.value;
    }
  };

  

 const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;

  if (name === "name") {
    setname(value);
    const trimmedValue = value.trim();
    if (trimmedValue.length > 0) {
      setErrorMessage('');
    } else {
      setErrorMessage('Please Enter the Name');
    }
    setrimmedValueLength(trimmedValue.length);

    const nameExists = child?.some((name_check_details: any) => {
      if (
        name_check_details.parent === structure.parent &&
        name_check_details.name !== structure.name &&
        name_check_details.name.trim().toLowerCase() === trimmedValue.toLowerCase()
      ) {
        setNameExist(true);
        return true;
      } else {
        setNameExist(false);
        return false;
      }
    });

    if (trimmedValue.length > 20) {
      setNameLength(true);
    } else {
      setNameLength(false);
    }
  }

  setDetails({
    ...details,
    [name]: value,
  });
};
  const handleAddStructure = (formValue: {
    
    name: string,
    type: string,
    parent: string,
  }) => {
    addStructure(router.query.projectId as string, formValue as any).then(
      (response) => {
        setWbsLoading(true)
        if (response.data.success === true) {
          if (sidebarStatus === true) {
            setSideBarStatus(RevSideBarStatus)
          }
          else {
            setSideBarStatus(true)
          }
          if(sideMenuStatusReload === true){
            setSideMenuReload(RevSideMenuReloadStatus)
          }
          else{
            setSideMenuReload(true)
          }
          
          
          toast.success('Data added successfully!');
     //fetchDetails();
          setWbsLoading(false)
          
        }
       
      },
      (error) => {
        setWbsLoading(false)
      }
    )
 // fetchDetails();
    handleClose();
  };

  const handleSubmit = (e: any) => {
    setIsSumbitting(true)
    e.preventDefault();
    if (wbsChanged) {
      let matchingWbs: { val: number, _id: string }[] = [];
      child.forEach(childObject => {
        if (structure.children?.includes(childObject._id)) {
          const val = childObject.wbs;
          const _id = childObject._id;
          matchingWbs.push({ val: Number(val), _id });
        }
      });
      let updateChildren = child.map(({ _id, wbs }) => ({ [_id]: wbs }));
      let updateChild = [];
      let idSet = new Set();  
      
      for (const item of matchingWbs) {
        if (!idSet.has(item._id)) {
          idSet.add(item._id);
          updateChild.push(item);
        }
      }
      
      var wbsVal: Number[] = [];
      var wbsValues: Number[] = [];
      updateChild.forEach(wbs=>{
        if (matchingWbs.some(item => item._id === wbs._id)) {
          wbsVal.push(Number(wbs.val));
        }
      })   
      wbsValues=wbsVal
      const hasDuplicates = (new Set(wbsValues)).size !== wbsValues?.length;
      if (hasDuplicates) {
        setIsSumbitting(false)
        toast.error('check duplicates !!')
        

      } else {
        updatestructureWbs(structure?._id, router.query.projectId as string, updateChildren)
          .then((Response) => {
            if (Response.data.success === true) {
              // if (sidebarStatus === true) {
              //   setSideBarStatus(RevSideBarStatus)
              // }
              // else {
              //   setSideBarStatus(true)
              // }
            
              if(sideMenuStatusReload === true){
               
                setSideMenuReload(RevSideMenuReloadStatus)
              }
              else{
                setSideMenuReload(true)
              }
              setIsSumbitting(false)
              toast.success("sequence updated successfully!!!")
              
              
            //  fetchDetails();
            } 
          })

      }
    } else {
      updateStructureDetails(structure?._id, router.query.projectId as string, {
      
        name: e.target.name.value.trim(),
        type: e.target.type.value,
        wbs: e.target.wbs.value,
        
      })
        .then((Response) => {
          if (Response.data.success === true) {
           
            setDetails(Response.data.result);
             
            if (sidebarStatus === true) {
              setSideBarStatus(false)
            }
            else {
              setSideBarStatus(true)
            }
          
           
            setIsSumbitting(false)
           // fetchDetails();
            
            
            toast.success('Data updated successfully!');
          }
          
          else{
            toast.error('Failed to update data');
            setIsSumbitting(false);
          }

        })
        .catch((error) => {
          setIsSumbitting(false)
        });
    }
  };

 
  const handleUpdate = () => {
    // Check if the router is ready before attempting to access the projectId
    if (router.isReady && router.query.projectId !== currentStructureId) {
        setCurrentStructureId(router.query.projectId as string);

      updateDesignStructure(structure._id, router.query.projectId as string)
        .then((response) => {
          if (response.data.success === true) {
            toast.success('updated successfully');
          }
        })
        .catch((error) => {
          // Handle your error here
          console.error("Error updating design structure:", error);
        });
    }
  };
  
  const WbsUpdateConfirmation = (event : any)=>{
    setwbsUpdatePopup(true)
    setDraggedChild(event) 
  }
  const handleClosePopup = () =>{
    setwbsUpdatePopup(false)
  }
  const handleReorder = (result: any) => {
    if (!result.destination) return;
    

    const reorderedChildren = [...(structureDataDetails?.children || [])];
    const [reorderedChild] = reorderedChildren.splice(result.source.index, 1);
    reorderedChildren.splice(result.destination.index, 0, reorderedChild);

    const updatedStructureDataDetails: IStructureInfo = {
      ...structureDataDetails!,
      children: reorderedChildren.map((childID, newIndex) => {
        const matchingChilds = child.find((item) => item._id === childID);

        if (matchingChilds) {
          matchingChilds.wbs = (newIndex + 1).toString();
        }
        return childID;
      }),
    };

    setstructureDataDetails(updatedStructureDataDetails);
    const draggedChildID = reorderedChild;
    const draggedChild = child.find((item) => item._id === draggedChildID);


    const updateWbsData: any = {};
    if (draggedChild) {
      const wbsAsNumber = parseInt(draggedChild.wbs, 10);
      updateWbsData[draggedChild._id] = wbsAsNumber;
    }

    updatestructuredragwbs(structure._id, router.query.projectId as string, updateWbsData)
      .then((response) => {
        if (response.data.success === true) {
         
          toast.success('WBS value updated successfully!');
          setwbsUpdatePopup(false)
        } else {

        }
      })
      .catch((error) => {
        console.error('Error updating WBS value:', error);
        setwbsUpdatePopup(false)
      });

  };
  function typechange(event: any) {

    setType(event.target.value)

  }

  return (
    <React.Fragment>

      <div >
        <div >
          <div className='flex  justify-between my-2 px-4'>
            <div className='flex'>
              <div> <h5 className="text-gray-900 font-bold text-xl mb-2 "> Update Structure Details</h5></div>
              <div>   <button className=" bg-custom-yellow text-black py-1 ml-4 px-2 rounded"
                onClick={() => {
                  if (popupOpen === null) {
                    handleOpen();
                  }
                }}>Add child structure</button></div>
            </div>
            {loading && <div className='text-center py-4'>
              <FontAwesomeIcon icon={faSpinner} spin className='text-4xl text-black' />
            </div>}
            <div className=' justify-end' > <button className=" bg-custom-yellow text-black py-1 ml-4 px-2 rounded" onClick={() => { handleUpdate() }} >Refresh</button></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div >
              <div className='grid grid-cols-3 gap-4 px-4 py-6'>
                <div className="mb-2">
                  <label className='block text-gray-700 font-medium mb-2'>Structure Name: </label>
                  <input className=" border border-border-yellow border-solid w-11/12 p-2 rounded  focus:outline-yellow-500 hover:border-yellow-500"
                    type="text"
                    name="name"
                    defaultValue={structureDataDetails?.name}
                    onChange={handleChange}
                    pattern="[a-zA-Z_0-9. ]+"
                    title=" Special characters are not allowed."
                    required
                  />
                  {errorMessage.length > 0 ? (
                          <p className="text-red-500">{errorMessage}</p>
                        ) : (
                          ""
                        )}
                  {nameexist ? (
                    <p className="text-red-500">Name already exist choose another name</p>
                  ) : (
                    ""
                  )}
                  {nameLength && trimmedValueLength!=0? (
                    <p className="text-red-500">Name should not exceed 20 characters</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mb-2">
                  <label className='block text-gray-700 font-medium mb-2'>Type: </label>
                  <select
                    className="border border-border-yellow border-solid w-11/12 p-2 rounded  focus:outline-yellow-500 hover:border-yellow-500"
                    name="type"
                    value={type}
                    onChange={typechange}

                  >
                    {

                      TypeValue.map((type) => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))
                    }
                  </select>

                </div>
                <div className="mb-2">
                  <label className='block text-gray-700 font-medium mb-2'>Structure sequence no: </label>
                  <input className=" border border-border-yellow border-solid w-11/12 p-2 rounded  focus:outline-yellow-500 hover:border-yellow-500 cursor-not-allowed"
                    type="text"
                    name="wbs"
                    defaultValue={structureDataDetails?.wbs}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className='block text-gray-700 font-medium mb-2'>Parent: </label>

                  <input className="cursor-not-allowed border border-border-yellow border-solid  focus:outline-yellow-500  w-11/12 p-2 rounded hover:border-yellow-500"

                    type="text"
                    name=" parent"
                    value={
                      (structureDataDetails?.parent === null ? 'null' : structureDataDetails?.parent) +
                      (parentName === null ? ' ' : ` ${parentName}`)
                    }
                  />
                </div>
              </div>
              {wbsUpdatePopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-10">
              <div className="fixed top-1/3 left-1/3 bg-white">
                <div className='flex justify-between py-2 px-4 border-b border-black'>
                  <div></div>
                  <div><FontAwesomeIcon icon={faXmark} onClick={handleClosePopup} className='cursor-pointer' /></div>
                </div>
                <h1 className='py-4 px-4' >Are you sure you want to drop {draggedChild?.draggableId} from Index {draggedChild?.source?.index} to Index {draggedChild?.destination?.index} ?</h1>
                <div className='flex justify-between py-2 px-4 '>
                  <div onClick={handleClosePopup} className='bg-white px-4 py-2 cursor-pointer'>Cancel</div>
                  <div onClick={() => handleReorder(draggedChild)} className='bg-custom-yellow px-4 py-2 rounded cursor-pointer'>Yes</div>
                </div>
              </div>
            </div>
          )}

              {structureDataDetails && structureDataDetails?.children?.length !== 0 || wbsLoading === true ?
                <div className="grid grid-cols-2 gap-1 px-6">
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Children: </label>
                    <div className=' flex  overflow-y-scroll max-h-[150px] p-2 border border-border-yellow border-solid'>
                      <DragDropContext onDragEnd={WbsUpdateConfirmation}>
                        <StrictModeDroppable droppableId="childrenList" >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            > 
                            
                              {structureDataDetails?.children?.map((childID, index) => {
                                
                                const matchingChild = child.find((item) => item._id === childID);


                                return (
                                  
                                  <Draggable key={childID} draggableId={childID} index={index}>
                                    {(provided, snapshot) => (

                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}

                                        className={`bg-white border-soild border-2 border-border-yellow p-1 mb-1 ${snapshot.isDragging ? "bg-red-100" : ""
                                          }`}>

                                        <ul>
                                          <li>
                                            {matchingChild ? matchingChild.name : childID} ({childID})

                                            <input
                                              className="border border-border-yellow border-solid p-1 rounded ml-2"
                                              type="text"
                                              defaultValue={matchingChild?.wbs}
                                              onChange={(e) => handleChildInputChange(childID, e)}
                                            />
                                          </li>
                                        </ul>
                                      </div>
                                    )}

                                  </Draggable>
                                );
                              })}

                              {provided.placeholder}
                            </div>
                          )}
                        </StrictModeDroppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div> : ""}
              <div className="flex  justify-center  mt-6">
              <button className={`p-2 bg-custom-yellow hover:bg-custom-yellow text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSubmitting || nameexist ? ' cursor-not-allowed' : ''
          }`} type="submit"
          disabled={ isSubmitting|| nameexist || errorMessage.length > 0}
                 >{isSubmitting ? 'Updating...' : 'Update'}</button>
              </div>
            </div>
          </form>

          
        </div>
        <div>
          {popupOpen === 'addStructure' && (
            <div className="fixed top-10 right-20 m-20 flex item-center justify-center bg-blur">
              <AddStructureDetails
                structure={structure as IStructureInfo}
                handleclose={handleClose}
                handlerAdd={handleAddStructure}
                details={child}
                StructureName={ StructureName}
              
              ></AddStructureDetails>
            </div>)}

        </div>
      </div>

    </React.Fragment>
  );
};

export default StructureDetails;





