import React, { useEffect, useState } from "react";
import { IdesignDetails, Istorage } from "../../models/IDesign";
import { ChildrenEntity } from "../../models/IStrature";
import AddDesign from "./AddDesign";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faPlus, faSpinner, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import Moment from "moment"
import EditDesign from "./editDesign";
import { deleteDesign, getDesign, getDesignDetails, getDesignRefresh } from "../../services/design";
import router from 'next/router';
import { toast } from "react-toastify";


interface IProps {
  designDetails: IdesignDetails[];
  structure: ChildrenEntity;
  
  handleAddDesign: (
    formValue: {
      project: string,
      structure: string,
      type: string,
      name: string,
      providerType: string,
      tm: {
        tm: number[],
        offset: number[]
      }
    }
  ) => void;
  load: boolean;

}

const DesignIds: React.FC<IProps> = ({ structure, designDetails, handleAddDesign, load }) => {
  const [designDetail, setDesignDetails] = useState<IdesignDetails[]>();
  const [selectedDesign, setSelectedDesign] = useState<string | null>();
  const [designIdDetails, setDesignIdDetails] = useState<IdesignDetails>();
  const [designStorage, setDesignStorage] = useState<Istorage[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<any>();
  const [filterdDesigns, setFilterdDesign] = useState<IdesignDetails[]>();
  const [editDesignKey, setEditDesignKey] = useState(0);
  const [popupOpen, setPopupOpen] = useState<'Add Design' | 'designDetails' | 'editDesign' | 'deleteDesign' | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setDesignDetails(designDetails)
    }, 2000);

    return () => clearTimeout(timer);

  }, [loading])

  useEffect(() => {
    if (designDetail) {
      const filterdDesign = designDetail?.filter((design) => design.structure === structure._id);
      setFilterdDesign(filterdDesign)
    }
  },[])


  const closeAddDesignPopup = () => {
    setPopupOpen(null);
  };

  const handleOPEN = () => {
    setPopupOpen('Add Design');
  };
  const handleCLOSE = () => {
    setPopupOpen(null);
  }
  const handleEditOpen = () => {
    setPopupOpen('editDesign');
  }

  const handlerClose = () => {
    setPopupOpen(null);

  }

  const handleAddDesignStatus = () => {
   
          setDesignDetails(designDetail);
          setLoading(false);
      
  }



  const handleDesignClick = (designId: string) => {
    getDesignDetails(router.query.projectId as string, designId)
      .then((Response) => {
        if (Response.data.success === true) {
          setSelectedDesign(designId);
          setDesignIdDetails(Response.data.result);
          setDesignStorage(Response.data.result.storage);
          setEditDesignKey((prevKey) => prevKey + 1);

        }
      })

    handleEditOpen();
  };


  const [isPopUp, setPopup] = useState(false);

  const handleOpenPopup = (designId: any) => {
    setPopup(true)
    setSelectedId(designId)
  }
  const handleClosePopup = () => {
    setPopup(false)
  }
  const handleDeleteDesign = (designId: string) => {

    deleteDesign(router.query.projectId as string, designId)
      .then((Response) => {
        if (Response.data.success === true) {
          toast.success("Design deleted successfully");
          const updatedDesignDetails = designDetail?.filter(
            (design) => design._id !== designId
          );
          setDesignDetails(updatedDesignDetails);

        }
      })
    handleClosePopup()


  }
  const handleUpdate = () => {

    getDesignRefresh(router.query.projectId as string)
      .then((response) => {
        if (response.data.success === true){
        if (response.data.result.length > 0) {
          toast.success("Updated!!");
        } else {
          toast.error("No data available");
        }
      }
      })
  }

  // const handleEyeIconClick = () => {

  //        router.push('/frame')


  // };
  return (
    <>
      <br />
      <div className="px-4 ">
        {structure && (
          <div className="flex">
            <h2 className="text-black font-semibold text-lg ">Designs for {structure.name} ({structure._id})</h2>
            <div className="ml-4 tooltip">
              <FontAwesomeIcon icon={faPlus} className="cursor-pointer" onClick={() => {
                if (popupOpen === null) {
                  handleOPEN();
                }
              }}></FontAwesomeIcon>
              <span className="tooltiptext">Add Design</span>
            </div>
            <div className="justify-end"><button className=" bg-custom-yellow text-black py-1 ml-4 px-2 rounded"
              onClick={() => { handleUpdate() }}>Refresh</button></div>
          </div>
        )}

      </div>


      <div className=" my-4 px-4">

        <table className=" min-w-full mt-2">
          <thead>
            <tr className="bg-gray-300 border-b border-gray-300 ">
              <th className="p-1.5 ">Design Id</th>
              <th className="p-1.5 ">Design Name</th>
              <th className="p-1.5 ">DesignType</th>
              <th className="p-1.5 ">Created</th>
              <th className="p-1.5 ">Updated</th>
              <th className="p-1.5 ">Edit</th>
              <th className="p-1.5 ">Delete</th>
              <th className="p-1.5 ">view</th>
            </tr>
          </thead>

          <tbody>



            {designDetail?.filter((design) => design.structure === structure._id)
              .map((design) => {
                return <tr key={design._id}>
                  <td className="border-b p-1.5 text-center border-gray-300">
                    {design._id}
                  </td>
                  <td className="border-b p-1.5 text-center border-gray-300">
                    {design.name}
                  </td>
                  <td className="border-b p-1.5 text-center border-gray-300">
                    {design.type}
                  </td>
                  <td className="border-b p-1.5 text-center border-gray-300">
                    {Moment(design.createdAt).format('MMM Do YYYY')}
                  </td>
                  <td className="border-b p-1.5 text-center border-gray-300">
                    {Moment(design.updatedAt).format('MMM Do YYYY')}
                  </td>
                  <td className="border-b p-1.5 cursor-pointer text-center border-gray-300">
                    <FontAwesomeIcon icon={faPen} onClick={() => handleDesignClick(design._id)} />
                  </td>
                  <td className="border-b p-1.5 text-center cursor-pointer border-gray-300">
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleOpenPopup(design._id)} />
                  </td>
                  <td className="border-b p-1.5 text-center cursor-pointer border-gray-300">
                    <FontAwesomeIcon icon={faEye} />

                  </td>

                </tr>;
              }
              )}
          </tbody>
        </table>
        {filterdDesigns?.length === 0 &&
          <h3 className="text-center p-4 text-black-500">
            <b>No Designs available.</b>
          </h3>
        }

      </div>

      {loading && <div className='text-center py-4'>
        <FontAwesomeIcon icon={faSpinner} spin className='text-4xl text-black' />
      </div>}
      {popupOpen === 'editDesign' && (
        <div key={editDesignKey}>
          <EditDesign
            handlerClose={handlerClose}
            designId={selectedDesign}
            designIdDetails={designIdDetails as IdesignDetails}
            designStorage={designStorage as Istorage[]}
          ></EditDesign>
        </div>
      )}

      {popupOpen === 'Add Design' && (
        <div key={editDesignKey}><AddDesign

          handlerclose={handleCLOSE}
          structure={structure as ChildrenEntity}
          handleAddDesign={handleAddDesign}
          closeAddDesignPopup={closeAddDesignPopup}
          AddDesignStatus={handleAddDesignStatus}
        ></AddDesign>
        </div>)}
      {isPopUp &&
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-10">\
          <div className='fixed top-1/3 left-1/3  bg-white '  >
            <div className='flex justify-between py-2 px-4  border-b border-black'>
              <div></div>
              <div><FontAwesomeIcon icon={faXmark} onClick={() => handleClosePopup()} className='cursor-pointer'></FontAwesomeIcon></div>
            </div>
            <h1 className='py-4 px-4' >Are you sure you want to delete?</h1>
            <div className='py-4 px-4 text-bold' >Design ID:&nbsp;{selectedId}</div>
            <div className='flex justify-between py-2 px-4 '>
              <div onClick={() => handleClosePopup()} className='bg-white px-4 py-2 cursor-pointer'>Cancel</div>
              <div onClick={() => handleDeleteDesign(selectedId)} className='bg-custom-yellow px-4 py-2 rounded cursor-pointer'>DELETE</div>
            </div>
          </div>
        </div>
      }






    </>

  );
};

export default DesignIds;
