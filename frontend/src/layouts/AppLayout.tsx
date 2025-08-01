import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getUser } from "../api/devtreeApi";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    })

    if (isLoading) {
        return 'Cargando...'
    }

    if (isError) {
        return <Navigate to={"/auth/login"} />
    }
   

    if (data)
        return (
            <DevTree data={data} />
        )
}