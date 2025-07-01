import { Link } from "react-router-dom";
const LoginView = () => {
    return (
        <>
        
            <h1 className="text-4xl text-white font-bold">Iniciar Sesión</h1>
            <nav className="mt-10">
                <Link to='/auth/register' className="text-white text-center text-lg block">
                    No tienes cuenta? Regístrate
                </Link>
            </nav>
        </>
    );
}

export default LoginView;