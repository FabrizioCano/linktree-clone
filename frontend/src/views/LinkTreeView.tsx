import React, { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/devtreeApi";
import type { DevTreeLink, SocialNetwork, User } from "../types";
const LinkTreeView = () => {

    const [devTreeLinks, setDevTreeLinks] = useState(social)

    const queryClient = useQueryClient()
    const user: User = queryClient.getQueryData(['user'])!
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)

        },
        onSuccess: () => {
            toast.success('Actualizado Correctamente')
        }
    })

    useEffect(() => {
        //iterar sobre el arreglo de links actual y comparar con el arreglo de links del usuario obtenido de la base de datos de manera a mostrar los links que posean informacion en la UI
        const updatedData = devTreeLinks.map(item => {
            const userLinks=JSON.parse(user.links).find((link:SocialNetwork)=> link.name===item.name)
            if(userLinks){
                return {
                    ...item,
                    url:userLinks.url,
                    enabled: userLinks.enabled
                }
                return item
            }
        })

        setDevTreeLinks(updatedData)
    },[])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link)
        setDevTreeLinks(updatedLinks)
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks)
            }
        })
    }

    const handleEnableLinks = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetwork) {
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled }
                }
                else {
                    toast.error("Url no valida")
                }
            }
            return link

        })
        setDevTreeLinks(updatedLinks)
        //escribir los links que se habilitaron o deshabilitaron en la instancia del user que esta en cache para poder utilizar en la mutacion los datos actualizados
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks)
            }
        })
    }

    return (
        <>
            <div className="space-y-5">
                {devTreeLinks.map(item => (
                    <DevTreeInput key={item.name} item={item} handleUrlChange={handleUrlChange} handleEnableLinks={handleEnableLinks} />
                ))}

                <button className="bg-cyan-300 p-2 text-lg w-full uppercase text-slate-500 rounded-lg font-bold"
                    onClick={() => mutate(user)}
                >
                    Guardar cambios

                </button>
            </div>
        </>
    );
}

export default LinkTreeView;