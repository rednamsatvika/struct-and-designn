import React, { use, useEffect, useState } from "react";
import SideMenu from "../../../../components/layout/sideMenu";
import { useRouter } from "next/router";
import Header from "../../../../components/container/Header";
import { AxiosResponse } from 'axios'; 
import authHeader from '../../../../services/auth-header';
import axios from 'axios';
import { Ireality } from "../../../../models/ISnapShot";
import { useQuery } from 'react-query';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  ChildrenEntity,
  IChildStructure,
  IStructureInfo,
  IStrature,
} from "../../../../models/IStrature";
import StructureDetails from "../../../../components/container/StructureDetails";
import SnapshotDetails from "../../../../components/container/snapshotList";
import { displayStructureDetails ,fetchStructureDetails, getStructure} from "../../../../services/structure";
import { addDesign, getDesign } from "../../../../services/design";
import { IdesignDetails } from "../../../../models/IDesign";
import DesignIds from "../../../../components/container/DesignIds";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import RealityDetails from "../../../../components/container/RealityDetails";
import Capture from "../../../../components/container/Capture";
import { getCookie } from "cookies-next";
import { IUser } from "../../../../models/IUser";
import { IJobs } from "../../../../models/IJobs";
import { getjobsInfo } from "../../../../services/jobs";
import JobDetails from "../../../../components/container/jobDetails";
import { toast } from "react-toastify";
import { getallSnapshots } from "../../../../services/snapshot";
import { ISnap } from "../../../../models/ISnapShot";
import ProjectDetails from "../../../../components/container/projectDetails";
import { IProjects } from "../../../../models/IProjects";
import { getProjectDetails, getType, updateStatus } from "../../../../services/project";
import { allCaptures } from "../../../../services/capture";
import { ICaptureDetails } from "../../../../models/ICapture";
// interface IProps {
//   strature: ChildrenEntity;
//   structurenew: IStrature;
// }

const queryClient = new QueryClient();
export const Index: React.FC = () => {
  const [jobData, setJobData] = useState<IJobs[]>([]);
  const [typeData, setTypeData] = useState<string[]>([]);
  const [structureData, setstructureData] = useState<ChildrenEntity>();
  const [designDetails, setdesignDetails] = useState<IdesignDetails[]>();
  const [structureInfo, setStructureInfo] = useState<IStructureInfo>();
  const [parentNames, setParentNames] = useState<string[]>([]);
  const [children, setchildren] = useState<IChildStructure[]>([]);
  const [structureId, setStructureId] = useState<string>("");
  const [getProjectinfo, setGetProjectinfo] = useState<IProjects>();
  const [loading, setLoading] = useState<boolean>(false);
  const [snapshotDetails, setSnapshotsDetails] = useState<ISnap | undefined>();
  const [tabIndex, setTabIndex] = useState(0);
    const [sidebarStatus,setSideBarStatus]=useState(false);
    const [structureKey,setStructureKey] = useState(0)
    const [RevStatusChange,setRevStatusChange] = useState<boolean>()
    const [allJobButtonClickStatus,setAllJobButtonClickStatus] = useState(false);
    const [revAllJobButtonStatus,setRevAllJobButtonStatus] = useState(false)
    const [sideMenuReloadStatus,setSideMenuReloadStatus] = useState(false)
    const [RevsideMenuReloadStatus,setRevSideMenuReloadStatus] = useState(false)
    const [captureAddedStatus,setCaptureAddedStatus] = useState(false)
    const [allSnapshotButtonStatus,setAllSnapshotButtonStatus]=useState(false)
    const [allSnapshotTitleStatus, setAllSnapshotTitleStatus] = useState(false)
    const [structureNames,setStructureNames] = useState({});
    const [allStructureDeatils,setAllStructreDeatails] = useState<IStructureInfo>();
    const [tabVisible,setTabVisible] = useState(false)
    const [state, setState] = useState<ChildrenEntity[]>([]);
    const [capturesInfo, setCapturesInfo] = useState<ICaptureDetails[] | undefined>();
    const [designDetail, setDesignDetails] = useState<IdesignDetails[]>();
    const [realityDetails, setRealityDetails] = useState<Ireality[]>([]);
  
    
   
    const handleTabSelect = (index:any) => {
      setTabIndex(index);
      storeTabIndexInLocalStorage(index);
    };
  
    // Function to store the selected index in localStorage
    const storeTabIndexInLocalStorage = (index:any) => {
      // if(router.query.projectId === )
      localStorage.setItem('selectedTabIndex', index);
      localStorage.setItem('projectID', router.query.projectId as string);
      
      
    };

    function ReverseStatus(e:boolean){
      setRevStatusChange(e)
    }
  const router = useRouter();
    function handleSideBarStatus(e:boolean){
      setSideBarStatus(e);
    }
    function handleAllJobButtonStatus(e:boolean){
      setAllJobButtonClickStatus(e)
    }
    function handleRevAllJobButtonStatus(e:boolean){
      setRevAllJobButtonStatus(e)
    }

    const handleSideMenuReload = (e:boolean) =>{
      setSideMenuReloadStatus(e)
    }
    const handleSideMenuReloadState = (e:boolean)=>{
      setRevSideMenuReloadStatus(e)
    }
    const handleCaptureAddedStatus=(e:boolean)=>{
        setCaptureAddedStatus(e)
    }
    const handleAllSnapShotButtonStatus=(e:boolean)=>{
        setAllSnapshotButtonStatus(e)
    }

    useEffect(()=>{
      if (structureId) {
        setStructureKey((prevKey) => prevKey + 1);
      }
    },[structureInfo])
  
    useEffect(()=>{

      if(router.isReady)
      
      {
        const selectedTab = localStorage.getItem('selectedTabIndex');
        const structId = localStorage.getItem('clickedStructure')
        const projID = localStorage.getItem('projectID')
        // const structureInf = JSON.parse(localStorage.getItem('structureInfo')||'null')
        // setStructureInfo(structureInf)
       

        if(router.query.projectId === projID){
          setStructureId(structId??'')
          const parsedSelectedTab = selectedTab !== null ? Number.parseInt(selectedTab) : null;
          setTabIndex(parsedSelectedTab??0)
        }
        else{
          setTabIndex(0)
        }
      
        
        getjobsInfo(router.query.projectId as string).then((response)=>{
          if(response.data.success===true){
            setJobData(response.data.result);

          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push("/login");
          }
        });
        
      }

      
     
     },[router.isReady,captureAddedStatus])
   //todo----------------------------------------------------------------------------------------------------------  
 
   const { data: structuresData, isLoading: structureLoading, isError: structureError } = useQuery({
    queryKey: ['structure', router.query.projectId],
    queryFn: () => getStructure(router.query.projectId as string)
      .then((response: AxiosResponse<any>) => response.data.result),
   // enabled:  ,
    staleTime: Infinity
    // Only enable the query when the router is ready
  });
  const invalidateStructureQuery = () => {
    queryClient.invalidateQueries(['structure', router.query.projectId]);
  };
  useEffect(() => {
    if (!structureLoading && !structureError && structureData) {
      setState(structuresData);
      setLoading(false);
    }
  }, [structureLoading, structureError]);
   
      //todo--------------------------------------------------------------------------------------------------------------------
      const getStructureData = (strature: ChildrenEntity) => {
        if (strature?.children?.length!== 0){ 
        const result= strature;
        setstructureData(result);
    }else if(strature.children?.length === 0){
        const result=strature;
        setstructureData(result);
    }
    const value=strature?._id;
    setStructureId(value);
     
    displayStructureDetails(router.query.projectId  as string)
    
       .then((Response)=>{
        setTabVisible(true)


         if(Response.data.success===true){
          setAllStructreDeatails(Response.data.result)
          const selectedStructure=Response.data.result.find((structure:IStructureInfo)=>{
            return structure._id===value;});
            console.log("ssel",selectedStructure)
           const idToNameMap: { [key: string]: string } = {};
           const parentName: string[] = [];
           const childrenName: string[] = [];
            setStructureNames(idToNameMap)
           Response.data.result.forEach((structure: IStructureInfo) => {
             idToNameMap[structure._id] = structure.name;
     
             if (structure?.children?.includes(selectedStructure._id)) {
               parentName.push(structure.name);
               setParentNames([structure.name]);
              }

            
             if (structure.parent === selectedStructure._id) {
              const child= { name: structure.name, _id: structure._id,wbs:structure.wbs,parent:structure?.parent };
              childrenName.push(structure.name);
              setchildren(prevChildren => [...prevChildren, child]);
              
             }
           });
          
           setStructureInfo(selectedStructure);
           localStorage.setItem("structureInfo", selectedStructure)
           setTabVisible(false)
        }
       })
       .catch((error)=>{
        setTabVisible(false)
       });


     
    };
  let[userValue, setuserValue]=useState<IUser>()
  
  const { data: snapshotsDetails, isLoading:snaploading, isError:snapError } = useQuery({
    queryKey: ['snapshots', router.query.projectId, structureId], // Provide the queryKey property
    queryFn: () => getallSnapshots(router.query.projectId as string, structureId)
      .then(response => response.data.result),
      enabled: tabIndex === 2 ,
      staleTime: Infinity
  });
  const invalidateSnapshotsQuery = () => {
    queryClient.invalidateQueries(['snapshots', router.query.projectId, structureId]);
  };
  const { data: designDetailsData, isLoading:designloading, isError:designError, error:designFetchError } = useQuery({
    queryKey: ['designDetails', router.query.projectId],
    queryFn: () => getDesign(router.query.projectId as string).then(response => response.data.result),
    
      enabled:  tabIndex === 1 ,
      staleTime: Infinity,
    
    }
  );

  const fetchDesignDetails = () => {
    queryClient.invalidateQueries(['designDetails', router.query.projectId]);
  };
  useEffect(() => {
    if (router.isReady) {
      const userObj: any = getCookie("user");
      let user = null;
      if (userObj) user = JSON.parse(userObj);
      setuserValue(user);

      // Check if the tabIndex is 2
      if (tabIndex === 1) {
        if (designloading) {
          // Loading state
          setLoading(true);
        } else if (designError) {
          // Error state
          toast.error("Failed to fetch snapshots");
        } else {
          // Data fetched successfully
          setLoading(false);
          setdesignDetails(designDetailsData)
        }
      }

     
   
      
      // Check if the tabIndex is 2
      if (tabIndex === 2) {
        if (snaploading) {
          // Loading state
          setLoading(true);
        } else if (snapError) {
          // Error state
          toast.error("Failed to fetch snapshots");
        } else {
          // Data fetched successfully
          setLoading(false);
          setSnapshotsDetails(snapshotsDetails);
        }
      }
      if (tabIndex === 6) {
        getProjectDetails(router.query.projectId as string)
          .then((Response) => {
            if (Response.data.success === true) {
              setGetProjectinfo(Response.data.result);
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              router.push("/login");
            }
          });
        getType().then((Response) => {
          if (Response.data.success === true) {
            setTypeData(Response.data.result);
          }
        });
      }

    
      
   
    if (!structureData && router.isReady) {
      
      setTabVisible(true)
      displayStructureDetails(router?.query?.projectId as string)
        .then((Response) => {
          
          
          if (Response.data.success === true) {
           
            if (Response.data.result.length > 0) {
              const defaultStructure = Response.data.result[0];
              getStructureData(defaultStructure);
            }
            setTabVisible(false)
          }
         
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push('/login');
            setTabVisible(false)
            
            
          }
        });
        
      }}
  }, [tabIndex, structureData,router.isReady]);
 
     
     const reloadData = (jData: IJobs, type: string) => {
       if (type.localeCompare('changeStatus') === 0) {
         const target: any = jobData?.find((obj) => obj._id === jData._id);
         target.status = jData.status;
         Object.assign(target, target);
         setJobData(jobData);
       } else if (type.localeCompare('selectedCapture') === 0) {
         const target: any = jobData?.find((obj) => obj._id === jData._id);
         if (jData.selectedCaptures?.length == 0) {
           target.selectedCaptures = jData.selectedCaptures;
           Object.assign(target, target);
           setJobData(jobData);
         } else {
           target.selectedCaptures = target.captures.filter((capData: any) => {
             return jData.selectedCaptures?.indexOf(capData._id) !== -1;
           });
           Object.assign(target, target);
           setJobData(jobData);
         }
       }
       
     };
     //todo--------------------------------------------------------------------------------------------------------------
//structure management api
// const [allStructureDetails, setAllStructureDetails] = useState<IStructureInfo[]>([]);

// useEffect(() => {
//     if (router.isReady) {
//       // Fetch structure details
//       fetchStructureDetails(router.query.projectId as string, structureId)
//         .then((response) => {
//           if (response.data.success === true) {
//             setAllStructreDeatails(response.data.result);
//             const responseData = response.data.result;
//             if (Array.isArray(responseData)) {
//               const selectedStructure = responseData.find(
//                 (structure: IStructureInfo) => structure._id === structureId
//               );
//               const idToNameMap: { [key: string]: string } = {};
//               const parentName: string[] = [];
//               const childrenName: string[] = [];
//               setStructureNames(idToNameMap);
//               responseData.forEach((structure: IStructureInfo) => {
//                 idToNameMap[structure._id] = structure.name;

//                 if (structure?.children?.includes(selectedStructure._id)) {
//                   parentName.push(structure.name);
//                   setParentNames([structure.name]);
//                 }

//                 if (structure.parent === selectedStructure._id) {
//                   const child = {
//                     name: structure.name,
//                     _id: structure._id,
//                     wbs: structure.wbs,
//                     parent: structure?.parent,
//                   };
//                   childrenName.push(structure.name);
//                   setchildren((prevChildren) => [...prevChildren, child]);
//                 }
//               });
//               setStructureInfo(allStructureDeatils);
//             }
//           }
//         })
//         .catch((error) => {
//           // Handle error
//           console.log("Error fetching structure details:", error);
//         });
//     }
//   }, []);

//todo-------------------------------------------------------------------------------------------------------------------

  //todo---------------------------------------------------------------------------------------------
  const getallCaptures = () => {
    setLoading(true);
    allCaptures(router.query.projectId as string)
      .then((Response) => {
        if (Response.data.success === true) {

          setCapturesInfo(Response.data.result);
          setLoading(false);
        }
      }).catch((error) => {
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      })

  };
  useEffect(() => {
    getallCaptures();
}, [router.isReady]);
//todo----------------------------------------------------------------------------------------------

//todo------------------------------------------------
const fetchRealityDetails = async (snapshotId: string | undefined) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/projects/${
          router.query.projectId as string
        }/reality?snapshot=${snapshotId}`,
        {
          headers: authHeader.authHeader(),
        }
      );
      setRealityDetails(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reality details:", error);
      setLoading(false);
    }
  };

  // Call fetchRealityDetails on component mount
  useEffect(() => {
    if (router.query.snapshotId) {
      fetchRealityDetails(router.query.snapshotId as string);
    }
  }, [router.query.snapshotId]);
  //todo---------------------------------------------------------------------------------
const handleAddNewDesign = (formValue:{  project:string,
  structure:string,
  type:string,
  name:string,
  providerType:string,
  tm: {
    tm: number[],
    offset: number[]
  }
}) => {
  
    
  addDesign(router.query.projectId as string, formValue as any).then(
      (response)=>{
          if(response){
          if(response.data.success===true){
          toast.success('Design added successfully!');
            designDetails?.push(response.data.result)
          }}
      },
      (error) => {
        toast.error("design not added");
      }
    )
  };
  //capture management

  // project approval
  const updateProjectStatus = (projectID:string,projectName:string)=>{
    updateStatus(projectID,{ status: "Approved" }).then(
      (response)=>{
        if(response.data.success===true){
          setGetProjectinfo(response.data.result)
          toast.success(projectName+" is Approved")
        }
      },
      (error) => {
        toast.error("Failed");
      }
    )
  }
 

return (
<QueryClientProvider client={queryClient}>
      <React.Fragment>
        <div className="h-screen overflow-y-hidden">
          <div>
            <Header name={router.query.name as string} />
          </div>
          <div className="w-full  flex ">
          <div className='w-[180px] bg-gray-50'>
              <SideMenu getStructureData={getStructureData} 
              state={state as ChildrenEntity[]}
              sidebarStatus={sidebarStatus} 
              RevSideBarStatusChange={ReverseStatus} 
              AllJobButtonStatusChange={allJobButtonClickStatus} 
              RevAllJobStatusChange={handleRevAllJobButtonStatus} 
              SideMenuReload={sideMenuReloadStatus}
              RevSideMenuReloadState={handleSideMenuReloadState}
              AllSnapShotButtonStatus={allSnapshotButtonStatus}
              invalidateStructureQuery={invalidateStructureQuery}/>
             
            </div>
            <div className=' basis-11/12 calc-h overflow-y-auto  '>
           
              <Tabs className="text-sm" onSelect={handleTabSelect} selectedIndex={tabIndex}>
                <TabList className="bg-orange-300">
                <Tab >Structure Management</Tab>
                <Tab>Design Management</Tab>
                {tabVisible ? (<Tab disabled={true}>Snapshot Management</Tab>):(<Tab disabled={false}>Snapshot Management</Tab>)}
                
                <Tab >Reality Management</Tab>
                <Tab>Capture Management</Tab>
                <Tab>Job Management</Tab>
                <Tab>Project Management</Tab>
                </TabList>
                <TabPanel>
                 
                  {structureData&&(
                    <StructureDetails
                    key={structureKey}
                    strature={structureData as ChildrenEntity}
                    structure={structureInfo as IStructureInfo}
                    parentName={parentNames}
                    child={children}
                    onSidebarStatusChange ={handleSideBarStatus}
                    RevSideBarStatus={RevStatusChange}
                    SideMenuReload={handleSideMenuReload}
                    RevSideMenuReloadStatus={RevsideMenuReloadStatus}
                    StructureName={structureNames}
                    invalidateStructureQuery={invalidateStructureQuery}
                  />  
                  )}
                  
               </TabPanel>
                <TabPanel>
                {structureData&&(
                  <div >
                   
                    <DesignIds
                   designDetails={designDetails as IdesignDetails[]} 
                    structure={structureData as ChildrenEntity}
                    handleAddDesign={handleAddNewDesign}
                    load={loading}

                    />
                  </div>
                )}
                </TabPanel>
                <TabPanel>
                {structureData&&(
                    <SnapshotDetails  
                        structure={structureInfo as IStructureInfo}
                       AllSnapButtonStatusChange={handleAllSnapShotButtonStatus}
                       allStructureNames={structureNames}
                       allStructureDetails={allStructureDeatils}
                       allSnapshotsTitleStatus={allSnapshotTitleStatus}
                       snapshotsDetails={snapshotDetails as ISnap}

                      />
                )}
                </TabPanel>
                <TabPanel>
                {structureData&&(
                    <RealityDetails 
                       structure={structureInfo as IStructureInfo}
                       snapshotsDetails={snapshotDetails as ISnap}
                       realityDetails={realityDetails}
                       
                       />
                )}</TabPanel>
                <TabPanel>
                {structureData&&(
                  <div >
                     {structureInfo&&
                     <Capture 
                     structure={structureInfo}
                      userValue={userValue as IUser} 
                      captureAddedStatusValue={handleCaptureAddedStatus}
                      capturesInfos={capturesInfo as ICaptureDetails[] }/>}
                  </div>)}
                </TabPanel>
                <TabPanel>
                {structureData&&jobData!=undefined&&(
                    <JobDetails
                    structure={structureData as ChildrenEntity} 
                    jobs={jobData} 
                    reloadData={reloadData} 
                    AllJobButtonStatusChange={handleAllJobButtonStatus}
                    revAllJobButtonStatus={revAllJobButtonStatus}
                    allStructureNames={structureNames}
                    
                    

                    />)}
               </TabPanel>
               <TabPanel>
                {structureData && (
                  <div>
                    {structureInfo && (
                      <ProjectDetails
                        getProjectinfo={getProjectinfo as IProjects}
                        setProjectInfo={setGetProjectinfo}
                        typeData={typeData}
                        updateProjectStatus={updateProjectStatus}
                      />
                    )}
                  </div>
                )}
              </TabPanel>
              
              </Tabs>
          
             </div> 
            
               </div>       
</div>         
 </React.Fragment>
 </QueryClientProvider>
    );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  );
  
  export default App;