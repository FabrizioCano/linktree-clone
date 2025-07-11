import { Link } from "react-router-dom";
const HomeNavigation = () => {
    return ( 
        <>
        <Link
            className="text-white p-2 uppercase font-black text-xs cursor-pointer "
            to='/auth/login'>
        Iniciar Sesion</Link>
        
        <Link
            className="bg-lime-500 p-2 text-slate-700 uppercase font-black text-xs cursor-pointer rounded-lg "
            to='/auth/register'
        >Registrarme</Link>

        </>
     );
}
 
export default HomeNavigation;