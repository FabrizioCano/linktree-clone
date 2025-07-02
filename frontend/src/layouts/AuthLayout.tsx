import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'
const AuthLayout = () => {
    return (
        <>
            <div className="bg-slate-700 min-h-screen">
                <div className="max-w-lg mx-auto pt-10 px-5">
                    <img src="/logo.svg" alt="Logo DevTree" />
                    <div className="py-10">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Toaster position='top-right' />

        </>
    );
}

export default AuthLayout;