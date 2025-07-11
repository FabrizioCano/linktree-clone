import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorMessage from '../components/ErrorMessage'
import type { UserProfileForm, User } from '../types'
import { updateProfile, uploadImage } from '../api/devtreeApi'

export default function ProfileView() {
    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData(['user'])!

    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileForm>({
        defaultValues: {
            handle: data.handle,
            description: data.description
        }
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onMutate: async () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    })

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    image: data
                }
            })
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadImageMutation.mutate(e.target.files[0])
        }
    }

    const handleUserProfileForm = (formData: UserProfileForm) => {
        const user: User = queryClient.getQueryData(['user'])!
        user.description = formData.description
        user.handle = formData.handle
        updateProfileMutation.mutate(user)
    }

    return (
        <form
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register('handle', {
                        required: "El Nombre de Usuario es obligatorio"
                    })}
                />

                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register('description', {
                        required: "La Descripción es obligatoria"
                    })}
                />

                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="image"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="image"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}