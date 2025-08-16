import axiosInstance from "@/api/axiosInstance.ts";

const getContainers=async()=>{
    const response=await axiosInstance.get("/containers");
    return response.data;
}
const startContainer=async(containerId:string)=>{
    const response=await axiosInstance.post(`/containers/${containerId}/start`);
    return response.data;
}
const stopContainer=async(containerId:string)=>{
    const response=await axiosInstance.post(`/containers/${containerId}/stop`);
    return response.data;
}
const restartContainer=async(containerId:string)=>{
    const response=await axiosInstance.post(`/containers/${containerId}/restart`);
    return response.data;
}
const deleteContainer=async(containerId:string)=>{
    const response=await axiosInstance.delete(`/containers/${containerId}`);
    return response.data;
}
const getContainerLogs=async(containerId:string)=>{
    const response=await axiosInstance.get(`/containers/${containerId}/logs`);
    return response.data;
}

export {getContainers,startContainer,stopContainer,restartContainer,deleteContainer,getContainerLogs};