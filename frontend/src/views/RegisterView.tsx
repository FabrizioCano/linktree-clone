import { Link } from "react-router-dom";
import {useForm} from "react-hook-form";
import {isAxiosError} from "axios";
import api from "../config/axios";
import {toast} from "sonner";
import type { RegisterForm } from "../types";
import ErrorMessage from "../components/ErrorMessage";
const RegisterView = () => {


    const initialValues = {
        name: '',
        email: '',
        handle: '',
        password: '',
        password_confirmation: ''
    };

    //useForm is a hook from react-hook-form that helps manage form state and validation
    //defaultValues is an object that sets the initial values for the form fields
    const {register,watch,reset,handleSubmit,formState:{errors}}=useForm<RegisterForm>({defaultValues: initialValues});

    const password = watch('password');
    
    const handleRegister = async (formData: RegisterForm) => {
        try {
            const {data} = await api.post('/auth/register', formData);

            toast.success(data);
            reset()
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error);
            }
        }
    }
    return (
        <>
            <h1 className="text-4xl text-center text-white font-bold">Crear Cuenta</h1>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu Nombre"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register('name',{
                        required: 'El nombre es obligatorio',
                    })}
                    />
                </div>
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('email',{
                        required: 'El email es obligatorio',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Email no válido',
                        },
                    })}
                    />
                </div>
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="Nombre de usuario: sin espacios"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('handle',{
                        required: 'El handle es obligatorio',
                        
                    })}
                    />
                </div>
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password',{
                        required: 'La contraseña es obligatoria',
                        minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                        },
                    })}
                    />
                </div>
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repetir Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password_confirmation',{
                        required: 'Repetir la contraseña es obligatorio',
                        validate:(value)=> value === password || 'Las contraseñas no coinciden'
                    })}
                    />
                </div>
                {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value='Crear Cuenta'
                />
            </form>


            <nav className="mt-10">
                <Link to='/auth/login' className="text-white text-center text-lg block">
                    Ya tienes cuenta? Inicia sesión
                </Link>
            </nav>
        </>
    );
}

export default RegisterView;