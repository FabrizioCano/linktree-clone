import React, { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/devtreeApi";
import type { SocialNetwork, User } from "../types";

const LinkTreeView = () => {
  // Estado local para manejar los links del DevTree en la UI
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  // Acceso al cliente de cache de react-query
  const queryClient = useQueryClient();

  // Obtener datos del usuario cacheados (puede ser undefined si no está logueado)
  const user = queryClient.getQueryData<User>(['user']);

  // Mutación para actualizar el perfil
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error: Error) => {
      toast.error(error.message || 'Error desconocido');
    },
    onSuccess: () => {
      toast.success('Actualizado Correctamente');
    }
  });

  // useEffect para sincronizar el estado local con los links que tiene el usuario
  useEffect(() => {
    // Si no hay usuario o no tiene links, no hacemos nada
    if (!user || !user.links) return;

    try {
      // Parseamos los links del usuario desde JSON
      const userLinks: SocialNetwork[] = JSON.parse(user.links);

      // Mapeamos los links locales para actualizar su url y estado habilitado según el usuario
      const updatedData = devTreeLinks.map(item => {
        const userLink = userLinks.find(link => link.name === item.name);
        if (userLink) {
          return {
            ...item,
            url: userLink.url,
            enabled: userLink.enabled
          };
        }
        return item;
      });

      // Actualizamos el estado local con los datos del usuario
      setDevTreeLinks(updatedData);
    } catch (e) {
      console.error("Error parsing user links", e);
    }
  }, [user]); // Dependemos del usuario para que se actualice si cambia

  // Maneja el cambio de URL en los inputs de los links
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    );
    setDevTreeLinks(updatedLinks);
  };

  // Maneja la activación o desactivación de links
  const handleEnableLinks = (socialNetwork: string) => {
    // Validar que el usuario esté autenticado y tenga links
    if (!user || !user.links) {
      toast.error("Usuario no autenticado");
      return;
    }

    // Intentar parsear los links actuales del usuario
    let links: SocialNetwork[] = [];
    try {
      links = JSON.parse(user.links);
    } catch {
      links = [];
    }

    // Actualizamos el estado local invirtiendo el enabled solo si la url es válida
    const updatedLinks = devTreeLinks.map(link => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error("Url no válida");
        }
      }
      return link;
    });

    let updatedItems: SocialNetwork[] = [];

    // Obtenemos el link que se está habilitando o deshabilitando
    const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork);

    // Si el link está habilitado, asignamos un id nuevo y actualizamos o agregamos el link en el arreglo de usuario
    if (selectedSocialNetwork?.enabled) {
      const id = links.filter(link => link.id > 0).length + 1;

      if (links.some(link => link.name === socialNetwork)) {
        updatedItems = links.map(link => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id: id
            };
          } else {
            return link;
          }
        });
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id: id
        };
        updatedItems = [...links, newItem];
      }
    } else {
      // Si el link está deshabilitado, ponemos enabled en false y id en 0
      // Además, ajustamos ids de otros links para no tener duplicados
      const indexToUpdate = links.findIndex(link => link.name === socialNetwork);

      updatedItems = links.map(link => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            enabled: false,
            id: 0
          };
        } else if (link.id > (links[indexToUpdate]?.id ?? 0)) {
          return {
            ...link,
            id: link.id - 1
          };
        } else {
          return link;
        }
      });
    }

    // Actualizamos el estado local con la nueva lista
    setDevTreeLinks(updatedLinks);

    // Actualizamos el cache de react-query para reflejar los cambios en el usuario
    queryClient.setQueryData(['user'], (prevData: User | undefined) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        links: JSON.stringify(updatedItems)
      };
    });
  };

  // Mostrar mensaje mientras se carga el usuario o si no está autenticado
  if (!user) {
    return <p className="text-center p-4">Cargando usuario o no autenticado...</p>;
  }

  // Renderizado principal del componente
  return (
    <div className="space-y-5">
      {devTreeLinks.map(item => (
        <DevTreeInput
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLinks={handleEnableLinks}
        />
      ))}

      <button
        className="bg-cyan-300 p-2 text-lg w-full uppercase text-slate-500 rounded-lg font-bold"
        onClick={() => mutate(queryClient.getQueryData(['user'])!)}
      >
        Guardar cambios
      </button>
    </div>
  );
};

export default LinkTreeView;
