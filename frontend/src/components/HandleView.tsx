import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserByHandle } from "../api/devtreeApi";
import HandleData from "./HandleData";
const HandleView = () => {
    const params=useParams()
    const handle=params.handle!
    const {data,error,isLoading} = useQuery({
        queryFn: () => getUserByHandle(handle),
        queryKey:['handle',handle],
        retry:1
    })

    if(isLoading){
        return <p className="font-bold text-2xl text-white text-center">Cargando...</p>
    }
    if(error){
        return <Navigate to={'/404'}/>
    }

    if(data) {
        return ( 
            <div>
                <HandleData data={data}/>
            </div>
         );
        
    }
}
 
export default HandleView;