import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import { addNewStructure, getStructure } from '../../services/structure';
import Treelist from './treeList';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { boolean } from 'yup';
import { TypeValue } from '../../utils/constants';
interface IProps {
  getStructureData: (strature: ChildrenEntity) => void;
  sidebarStatus: boolean;
  revSideBarStatusChange: (newStatus: boolean) => void;
  AllJobButtonStatusChange: boolean;
  RevAllJobStatusChange: (newStatus: boolean) => void;
  sideMenuReload: boolean;
  RevSideMenuReloadStatus: (newStatus: boolean) => void;
  AllSnapShotButtonStatus: boolean
  state:ChildrenEntity[];
  invalidateStructureQuery: () => void;
}

const Structure: React.FC<IProps> = ({ getStructureData,state, sidebarStatus, revSideBarStatusChange, AllJobButtonStatusChange, RevAllJobStatusChange, sideMenuReload, RevSideMenuReloadStatus, AllSnapShotButtonStatus,invalidateStructureQuery }) => {
  let router = useRouter();
 
  let [states, setState] = useState(state);
  console.log('state',state)
  let [newStructure, setNewStructure] = useState<any>({ name: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [revAllJobButtonStatus, setRevAllJobButtonStatus] = useState(false)
  const [revSideBarStatus, setRevSideBarStatus] = useState(true)
  const [RevSideMenuReloadState, setRevSideMenuReloadStatus] = useState(false)
  const [pathFieldStatus,setPathFieldStatus] = useState(false);
  RevSideMenuReloadStatus(RevSideMenuReloadState)
  RevAllJobStatusChange(revAllJobButtonStatus)
  //invalidateStructureQuery();
  useEffect(() => {
    if (AllJobButtonStatusChange) {
    //   getStructure(router.query.projectId as string)
    //     .then((response: AxiosResponse<any>) => {
    //       setState([...response.data.result]);
    //       setLoading(false);

    //     })
    //     .catch((error) => {
    //       setLoading(false);

    //     });
    }
  }, [sidebarStatus, revSideBarStatusChange, AllJobButtonStatusChange])
  useEffect(() => {
    if (sidebarStatus) {
        //setState(state)
    //   getStructure(router.query.projectId as string)
    //     .then((response: AxiosResponse<any>) => {
    //       setState([...response.data.result]);
    //       setLoading(false);

    //     })
    //     .catch((error) => {
    //       setLoading(false);

    //     });
    }

  }, [sidebarStatus, AllJobButtonStatusChange])
  useEffect(() => {
    if (sideMenuReload) {
    
    }

  }, [sidebarStatus, RevSideMenuReloadStatus])
  useEffect(() => {
    if (router.isReady) {
     invalidateStructureQuery()
     

    //   getStructure(router.query.projectId as string)
    //     .then((response: AxiosResponse<any>) => {
    //       setState([...response.data.result]);
    //       console.log("get str dettt",response.data.result)
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       setLoading(false);

    //     });
     }

  }, [router.isReady, router.query.projectId]);

  const [popup, setPopup] = useState<'addNew' | null>(null)
  const handleOpen = () => {
    setPopup('addNew');
  };

  const handleNewSubmit = (e: any) => {
    e.preventDefault();

    addNewStructure(router.query.projectId as string, newStructure)
      .then((Response) => {
        if (Response.data.success === true) {

          setNewStructure({ name: "", type: "" });

          toast.success("structure added successfully");
          router.reload();

        }

      })
      .catch((error) => {

        router.reload();
      })
  };
 const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStructure({ ...newStructure, [name]: value });
    if (e.target.value.trim().length === 0) {
      setPathFieldStatus(true)
    }
    else{
      setPathFieldStatus(false)
    }
  };
  

  function RevSideBarStatusChange(e: boolean) {
    setRevSideBarStatus(e)
    revSideBarStatusChange(e)
  }
  function handleRevAllJobButtonStatusChange(e: boolean) {
    setRevAllJobButtonStatus(e)
  }



  return (
    <div>
      <React.Fragment>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : state.length !== 0 ? (
            <Treelist treeList={state} getStructureData={getStructureData} sidebarStatus={sidebarStatus} RevSideBarStatusChange={RevSideBarStatusChange} AllJobButtonStatusChange={AllJobButtonStatusChange}
              RevAllJobStatusChange={handleRevAllJobButtonStatusChange}
              AllSnapShotButtonStatus={AllSnapShotButtonStatus} />
          ) : (
            <div className='px-2'>
              <button
                className=" mt-1 w-full bg-custom-yellow hover:bg-custom-yellow text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  if (popup === null) {
                    handleOpen();
                  }
                }}
              >
                Add new Structure
              </button>
              {popup === 'addNew' && (
                <div>
                  <form onSubmit={handleNewSubmit}>
                    <label className='block text-gray-700 font-medium mb-2'>Name</label>
                    <input className=" border border-border-yellow border-solid  focus:outline-yellow-500   p-2 rounded hover:border-yellow-500"
                      name="name"
                      value={newStructure.name}
                      onChange={handleInputChange} required/>
                      {pathFieldStatus ? (
                          <p className="text-red-500">Fill this field</p>
                       ) : (
                          ""
                        )}
                    <label className='block text-gray-700 font-medium mb-2'>Type</label>
                    <select
                      name="type"
                      className="w-full border border-border-yellow border-solid focus:outline-yellow-500 p-2 rounded hover:border-yellow-500"
                      onChange={handleInputChange}
                    required>
                      <option value="" disabled>select type</option>
                      {TypeValue.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex  justify-center">
                      <button className="bg-custom-yellow hover:bg-custom-yellow text-black font-medium py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={pathFieldStatus}>Add Structure</button>
                    </div>

                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default Structure;
