import axiosInstance from "@/api/axiosInstance.ts";

const getVolumes=async()=>{
    const response=await axiosInstance.get("/volumes");
    return response.data;
}
const deleteVolume=async(volumeId:string)=>{
    const response=await axiosInstance.delete(`/volumes/${volumeId}`);
    return response.data;
}

export {getVolumes,deleteVolume};