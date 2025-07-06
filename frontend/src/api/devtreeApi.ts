import { isAxiosError } from "axios";
import api from "../config/axios";
import type { User } from "../types";

export async function getUser() {
    try {
        const { data } = await api.get<User>('/user')
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateProfile(formData:User) {
    try {
        const { data } = await api.patch<string>('/user',formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function uploadImage(file:File) {
    const formData=new FormData()
    formData.append('file',file)
    try {
        const {data}=await api.post('/user/image',formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}