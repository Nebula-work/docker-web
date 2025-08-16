import axiosInstance from "@/api/axiosInstance.ts";

const getNetworks=async()=>{
    const response=await axiosInstance.get("/networks");
    return response.data;
}
const deleteNetwork=async(networkId:string)=>{
    const response=await axiosInstance.delete(`/networks/${networkId}`);
    return response.data;
}
const createNetwork=async(networkName:string)=>{
    const response=await axiosInstance.post("/networks",{name:networkName});
    return response.data;
}

export {getNetworks,deleteNetwork,createNetwork};