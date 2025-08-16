import axiosInstance from "@/api/axiosInstance.ts";

const getImages=async()=>{
    const response=await axiosInstance.get("/images");
    return response.data;
}
const deleteImage=async(imageId:string)=>{
    const response=await axiosInstance.delete(`/images/${imageId}`);
    return response.data;
}

export {getImages,deleteImage};