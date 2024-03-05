import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import ProjectsList from "../../components/container/projectsList";
import { IProjectsjobs } from "../../models/IProjects";
import { getProjectsJobs } from "../../services/project";
import router from "next/router";
import { getjobsInfo } from "../../services/jobs";
import { ApiDataContextProvider } from "../../useContext/projectContext";

const Projects: React.FC<any> = () => {
  const [jobDates, setJobDates] = useState<{ [key: string]: string[] }>({});
  let [name, setName] = useState<string>("");
  const [projects, setProjects] = useState<IProjectsjobs[]>([]);
  const [latestJobDates, setLatestJobDates] = useState<{
    [key: string]: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [projectCounting, setProjectCounting] = useState(0);
  const [projectStatus, setProjectStatus] = useState([]);
  const [projectLoading,setProjectLoading] = useState(true)
  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjectsJobs();
      if (response.data.success === true) {
        const projectData = response.data.result;
        const projectStatusArray = projectData.map((project:any) => ({
          _id: project?._id,
          status: false
        }));
        setProjectCounting(projectData.length);
        setProjects(projectData);
        setProjectStatus(projectStatusArray);
      }
     
      setProjectLoading(false)
    } catch (error) {
      // Handle error
      setProjectLoading(false)
    }
  };

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const jobPromises = projects.map(async (project: IProjectsjobs) => {
        try {
          const jobResponse = await getjobsInfo(project._id);
          if (jobResponse.data.success === true) {
            const jobDates = jobResponse.data.result.map((job: any) =>
              formatDate(new Date(job.updatedAt))
            );
            setJobDates((prevJobDates) => ({
              ...prevJobDates,
              [project._id]: jobDates,
            }));

            const latestDate =
              jobDates.length > 0
                ? jobDates.sort(
                    (a: string, b: string) =>
                      new Date(b).getTime() - new Date(a).getTime()
                  )[0]
                : null;

                
            setLatestJobDates((prevLatestDates) => ({
              ...prevLatestDates,
              [project._id]: latestDate,
            }));
            setProjectStatus((prevProjectStatus:any) =>
            prevProjectStatus.map((item:any) =>
              item._id === project?._id ? { ...item, status: true } : item
            )
          );
          
          
          }
        } catch (error) {
          // Handle error for a specific project
        }
      });

      await (jobPromises);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
 

  useEffect(() => {
    if (!getCookie("user")) {
      router.push("/login");
    }
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.fullName) {
      setName(user?.fullName);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    // Use a separate useEffect to load job details after projects have been fetched
    if (projects.length > 0) {
      fetchJobDetails();
    }
  }, [projects]);

  return (
    <ApiDataContextProvider 
    projectStatus={projectStatus}
    projects={projects as IProjectsjobs[]}
    latestJobDates={latestJobDates} 
    jobsDate={jobDates}
    name={name}
    isLoading={isLoading}
    projectCount={projectCounting}
    projectLoading={projectLoading}>
      <div className="calc-h overflow-auto">
        <ProjectsList
          // projects={projects as IProjectsjobs[]}
          // jobsDate={jobDates}
          // name={name}
          // isLoading={isLoading}
          // latestJobDates={latestJobDates}
          // projectCount={projectCounting}
          // projectStatus={projectStatus}
          // projectLoading={projectLoading}
        />
      </div>
      </ApiDataContextProvider>
  );
};

export default Projects;
