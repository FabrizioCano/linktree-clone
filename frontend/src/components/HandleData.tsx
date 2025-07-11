import type { SocialNetwork, UserHandle } from "../types";

type HandleDataProps = {
    data: UserHandle
}

const HandleData = ({ data }: HandleDataProps) => {
    const userLinks: SocialNetwork[] = JSON.parse(data.links).filter((link: SocialNetwork) => link.enabled)

    return (
        <div className="space-y-6 text-white">
            <p className="text-5xl text-center font-black">
                {data.handle}
            </p>
            {data.image &&
                <img src={data.image} alt="Imagen de Perfil" className="max-w-[250px] mx-auto" />
            }

            <p className="text-lg text-center font-bold">
                {data.description}
            </p>

            <div className="mt-20 flex flex-col gap-6">
                {userLinks.length ?
                    userLinks.map(link => (
                        <a 
                        key={link.name}
                        href={link.url}
                        className="bg-white px-5 py-3 flex items-center gap-5 rounded-lg"
                        target="_blank"
                        rel="no referrer noopener">
                            <img src={`/social/icon_${link.name}.svg`} className="w-12" alt="Imagen Red Social"/>
                            <p className="text-black font-bold capitalize text-lg">Visita mi: {link.name}</p>
                        </a>
                    ))
                    :
                    <p className="text-center">No hay enlaces en este perfil</p>}
            </div>
        </div>
    );
}

export default HandleData;