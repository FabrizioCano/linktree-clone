import NavigationTabs from './NavigationTabs';
import { Link, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { SocialNetwork, User } from '../types';
import { useEffect, useState } from 'react';
import DevTreeLink from './DevTreeLink';
import { useQueryClient } from '@tanstack/react-query';
import Header from './Header';

type DevTreeProps = {
    data: User
};

const DevTree = ({ data }: DevTreeProps) => {

    //obtener los links habilitados por el usuario
    const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))

    useEffect(() => {
        setEnabledLinks(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    }, [data])

    const queryClient = useQueryClient()

    const handleDragEnd = (e:DragEndEvent) => {
        //index del active, para verificar posiicon previa y cual es su posicion final
        const {active,over} = e

        if(over && over.id) {
            const prevIndex = enabledLinks.findIndex(link => link.id === active.id)
            const newIndex = enabledLinks.findIndex(link => link.id === over.id)
            //se encarga de reordenar el arreglo de los links habilitados
            const order = arrayMove(enabledLinks,prevIndex,newIndex)
            
            

            //order contiene los links activos actuales modificados por el drag and drop, por lo que se hace set de ese arreglo al state
            setEnabledLinks(order)

            //Se debe recuperar aquellos links que no estan habilitados porque el drag and drop solo actualiza aquellos links activos y que se muestran y se sobreescribiria si no se hace esto
            const disabledLinks:SocialNetwork[] = JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled)

            //esto une los links activos y no activos
            const links = order.concat(disabledLinks)
            
            //tambien se debe escribir los cambios en la informacion del cache del usuario
            queryClient.setQueryData(['user'],(prevData:User) => {
                return {
                    ...prevData,
                    links:JSON.stringify(links)
                }
            })
            
        }


    }
    return (
        <>
            <Header/>
            <div className="bg-gray-100  min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-10 md:p-0">
                    <NavigationTabs />

                    <div className="flex justify-end">
                        <Link
                            className="font-bold text-center text-slate-800 text-2xl"
                            to={`/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >Visita Mi Perfil: /{data.handle}</Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            <Outlet />
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">

                            <p className='text-4xl text-center text-white'>{data.handle}</p>
                            {data.image &&
                                <img src={data.image} alt="Imagen de Perfil " className="mx-auto max-w-[250px]" />
                            }
                            <p className='text-lg font-black text-center text-white'>{data.description}</p>


                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >

                                <div className='mt-20 flex flex-col gap-5'>
                                    <SortableContext
                                    //que elementos se harian drag and drop
                                    items={enabledLinks}
                                    strategy={verticalListSortingStrategy}
                                    >
                                        {enabledLinks.map(link => (
                                            <DevTreeLink key={link.name} link={link} />
                                        ))}
                                    </SortableContext>
                                </div>

                            </DndContext>


                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    );
}

export default DevTree;