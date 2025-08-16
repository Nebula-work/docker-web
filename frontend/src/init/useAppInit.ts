import {useDispatch} from "react-redux";
import {store} from "@/store";
import {useEffect} from "react";
import {fetchContainers} from "@/store/slices/containersSlice.ts";
import {fetchNetworks} from "@/store/slices/networksSlice.ts";
import {fetchImages} from "@/store/slices/imagesSlice.ts";
import {fetchVolumes} from "@/store/slices/volumesSlice.ts";


export const useAppInit = () => {
    const dispath = store.dispatch;
    // dispatch start up actions here
    useEffect(()=>{
        dispath(fetchContainers())
        dispath(fetchNetworks())
        dispath(fetchImages())
        dispath(fetchVolumes())
    },[dispath])
}